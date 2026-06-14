import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronRight } from 'lucide-react';

interface BlogPost {
  title: string;
  link: string;
  date: Date;
  content: string;
  summary: string;
  imageSmall: string | null;
  imageMedium: string | null;
  labels: string[];
  blog: {
    id: string;
    name: string;
    url: string;
    color: string;
  };
}

const BLOGS = [
  { id: 'novas', name: 'Novas', url: 'https://agaxnet.blogspot.com', color: '#006699' },
  { id: 'agaxnet', name: 'agax.net', url: 'https://xadrezatlantico.blogspot.com', color: '#0099CC' },
  { id: 'xogando', name: 'Xogando co Xadrez', url: 'https://www.xogandocoxadrez.eu', color: '#00AA66' },
  { id: 'xadrecista', name: 'Xadrecistas', url: 'https://www.xadrecista.eu', color: '#CC6600' },
  { id: 'norte', name: 'Xadrez do Norte', url: 'https://www.xadrezdonorte.org', color: '#3367ba' }
];

export const Home: React.FC = () => {
  const blogPageSize = 100;
  const maxFeedRequestsPerBlog = 200;
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    searchText: '',
    dateFrom: '',
    dateTo: '',
    blogSource: 'all'
  });
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [page, setPage] = useState(1);
  const postsPerLoad = 20;

  // Load blogs
  useEffect(() => {
    const loadBlogs = async () => {
      setIsLoading(true);
      try {
        const promises = BLOGS.map(blog => loadBlogPosts(blog));
        const results = await Promise.all(promises);
        const posts = results.flat().sort((a, b) => b.date.getTime() - a.date.getTime());
        setAllPosts(posts);
        setFilteredPosts(posts);
      } catch (error) {
        console.error('Error loading blogs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBlogs();
  }, []);

  // Filter posts
  useEffect(() => {
    let result = allPosts;

    if (filters.searchText) {
      const lowerSearch = filters.searchText.toLowerCase();
      result = result.filter(post => post.title.toLowerCase().includes(lowerSearch));
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter(post => post.date >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59);
      result = result.filter(post => post.date <= toDate);
    }

    if (filters.blogSource !== 'all') {
      result = result.filter(post => post.blog.id === filters.blogSource);
    }

    setFilteredPosts(result);
    setPage(1);
  }, [filters, allPosts]);

  // Pagination / Infinite Scroll
  useEffect(() => {
    setDisplayedPosts(filteredPosts.slice(0, page * postsPerLoad));
  }, [filteredPosts, page]);

  const loadBlogFeedPage = (blog: any, startIndex: number, maxResults: number): Promise<any | null> => {
    return new Promise((resolve) => {
      const callbackName = 'blogCallback' + Date.now() + Math.random().toString(36).substr(2, 9);
      const feedUrl = `${blog.url}/feeds/posts/default?alt=json-in-script&start-index=${startIndex}&max-results=${maxResults}&callback=${callbackName}`;
      
      const timeout = setTimeout(() => {
        cleanup();
        resolve(null);
      }, 10000);

      const cleanup = () => {
        clearTimeout(timeout);
        // @ts-ignore
        delete window[callbackName];
        if (script.parentNode) document.body.removeChild(script);
      };

      // @ts-ignore
      window[callbackName] = (data: any) => {
        cleanup();
        resolve(data);
      };

      const script = document.createElement('script');
      script.src = feedUrl;
      script.onerror = () => {
        cleanup();
        resolve(null);
      };
      document.body.appendChild(script);
    });
  };

  const loadBlogPosts = async (blog: any): Promise<BlogPost[]> => {
    const collectedPosts: BlogPost[] = [];
    let startIndex = 1;
    let expectedTotal = Number.POSITIVE_INFINITY;
    let requests = 0;

    // Keep requesting pages until the feed is exhausted or we hit a request safety cap.
    while (startIndex <= expectedTotal && requests < maxFeedRequestsPerBlog) {
      const data = await loadBlogFeedPage(blog, startIndex, blogPageSize);
      if (!data?.feed?.entry || data.feed.entry.length === 0) break;

      requests += 1;

      const totalFromFeed = Number(data.feed['openSearch$totalResults']?.$t ?? '0');
      if (Number.isFinite(totalFromFeed) && totalFromFeed > 0) {
        expectedTotal = totalFromFeed;
      }

      const pagePosts = parseBlogPosts(data, blog);
      collectedPosts.push(...pagePosts);

      if (data.feed.entry.length < blogPageSize) break;
      startIndex += data.feed.entry.length;
    }

    return collectedPosts;
  };

  const parseBlogPosts = (data: any, blog: any): BlogPost[] => {
    if (!data.feed || !data.feed.entry) return [];
    return data.feed.entry.map((post: any) => {
      const content = post.content ? post.content.$t : '';
      const summary = post.summary ? post.summary.$t : content.replace(/<[^>]*>/g, '').substring(0, 250) + '...';
      
      let imageSmall = null;
      let imageMedium = null;
      
      // Extract image
      const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
      if (imgMatch) imageMedium = imgMatch[1];
      else if (post.media$thumbnail) imageMedium = post.media$thumbnail.url;

      if (imageMedium) {
         imageSmall = imageMedium; // Simplified for now
      }

      return {
        title: post.title.$t,
        link: post.link.find((l: any) => l.rel === 'alternate').href,
        date: new Date(post.published.$t),
        content,
        summary: summary.replace(/<[^>]*>/g, '').substring(0, 250) + '...',
        imageSmall,
        imageMedium,
        labels: post.category ? post.category.map((c: any) => c.term) : [],
        blog
      };
    });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      if (displayedPosts.length < filteredPosts.length) {
        setPage(p => p + 1);
      }
    }
  };

  return (
    <div className="main-container">
      <section className="content-main">
        <div className="blog-container" onScroll={handleScroll}>
          {/* Hero Section */}
          <div className="mb-8 p-6 md:p-10 rounded-2xl bg-gradient-to-r from-[#006699] to-[#004466] text-white relative overflow-hidden shadow-lg border border-white/10">
            {/* Decorative background Chess Pieces */}
            <div className="absolute inset-0 opacity-5 flex justify-around pointer-events-none select-none">
              <span className="text-[10rem] -mt-10">♟</span>
              <span className="text-[12rem] mt-6">♞</span>
              <span className="text-[10rem] -mt-5">♜</span>
            </div>
            
            <div className="relative z-10 max-w-3xl">
              <span className="inline-block bg-white/20 text-blue-100 text-[10px] md:text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider mb-3">
                XXXVII Aniversario (1989-2026)
              </span>
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-4 drop-shadow-sm">
                Benvido á Asociación Galega de Xadrecistas
              </h1>
              <p className="text-sm md:text-base text-blue-100 mb-6 max-w-2xl leading-relaxed">
                Promovemos o xadrez e os xogos de mesa en Galicia. Únete á nosa comunidade de xadrecistas, inscríbete como socio para apoiar as nosas actividades ou xoga connosco en liña nos nosos torneos.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                  to="/alta-socio" 
                  className="inline-flex items-center justify-center px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-sm transition-all hover:scale-102 active:scale-98 text-sm gap-1.5"
                >
                  <span>Faite socio</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link 
                  to="/registro-lichess" 
                  className="inline-flex items-center justify-center px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg border border-white/30 backdrop-blur-sm transition-all hover:scale-102 active:scale-98 text-sm gap-1.5"
                >
                  <span>Inscrición AGAX Aberto en Lichess</span>
                  <span className="text-[10px] bg-blue-500/80 px-1.5 py-0.5 rounded">Lichess</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="blog-header">
            <div className="search-filters">
              <div className="search-box">
                <input 
                  type="text" 
                  placeholder="🔍 Buscar por título..." 
                  className="search-input"
                  value={filters.searchText}
                  onChange={e => setFilters({...filters, searchText: e.target.value})}
                />
              </div>
              <div className="date-filters">
                <input 
                  type="date" 
                  className="date-input"
                  value={filters.dateFrom}
                  onChange={e => setFilters({...filters, dateFrom: e.target.value})}
                />
                <span>-</span>
                <input 
                  type="date" 
                  className="date-input"
                  value={filters.dateTo}
                  onChange={e => setFilters({...filters, dateTo: e.target.value})}
                />
              </div>
              <div className="blog-chips">
                {BLOGS.map(blog => (
                  <button
                    key={blog.id}
                    className={`blog-chip chip-${blog.id} ${filters.blogSource === blog.id ? 'active' : ''}`}
                    onClick={() => setFilters({...filters, blogSource: filters.blogSource === blog.id ? 'all' : blog.id})}
                  >
                    {blog.name.toUpperCase()}
                  </button>
                ))}
              </div>
              <button 
                className="btn-clear"
                onClick={() => setFilters({searchText: '', dateFrom: '', dateTo: '', blogSource: 'all'})}
              >
                ✖ Limpar
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Cargando máis publicacións...</p>
            </div>
          ) : (
            <>
              <div className="posts-grid">
                {displayedPosts.map((post, idx) => (
                  <article key={idx} className="post-card">
                    <div className="post-image-wrapper" onClick={() => setSelectedPost(post)} style={{cursor: 'pointer'}}>
                      <span className={`blog-source ${post.blog.id}`} style={{backgroundColor: post.blog.color}}>
                        {post.blog.name}
                      </span>
                      {post.imageSmall ? (
                        <img src={post.imageSmall} alt={post.title} className="post-image" loading="lazy" />
                      ) : (
                        <div className="post-image placeholder">♟️</div>
                      )}
                    </div>
                    <div className="post-content">
                      <h3 className="post-title">
                        <a href="#" onClick={(e) => { e.preventDefault(); setSelectedPost(post); }}>{post.title}</a>
                      </h3>
                      <div className="post-meta">
                        <span className="post-date">📅 {format(post.date, "d 'de' MMMM 'de' yyyy", { locale: es })}</span>
                      </div>
                      <div className="post-summary">{post.summary}</div>
                      <div className="post-footer">
                        <button className="post-read-more" onClick={() => setSelectedPost(post)}>Ler máis →</button>
                        <div className="post-labels">
                          {post.labels.slice(0, 3).map(label => (
                            <span key={label} className="post-label">{label}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {displayedPosts.length < filteredPosts.length && (
                <div className="load-more-wrapper">
                  <button className="btn-load-more" onClick={() => setPage(p => p + 1)}>
                    Cargar máis publicacións
                  </button>
                </div>
              )}
            </>
          )}
          
          {!isLoading && displayedPosts.length === 0 && (
             <div className="end-message">
                <p>Non se atoparon resultados</p>
             </div>
          )}
        </div>
      </section>

      <aside className="sidebar-right">
        <div className="sponsors">
            <h3>Entidades colaboradoras</h3>
            <div className="sponsor-logos">
                <a href="https://www.coruna.gal/deportes" target="_blank" rel="noopener noreferrer">
                    <img src="/imax/concecoru.png" alt="Concello da Coruña" />
                </a>
                <img src="/imax/Depuok.png" alt="Deputación da Coruña" />
            </div>
        </div>
      </aside>

      {/* Modal */}
      {selectedPost && (
        <div className="modal" style={{display: 'flex'}}>
          <div className="modal-overlay" onClick={() => setSelectedPost(null)}></div>
          <div className="modal-content">
            <button className="modal-close" onClick={() => setSelectedPost(null)}>&times;</button>
            <div className="modal-header">
              <h2>{selectedPost.title}</h2>
              <div className="modal-meta">
                <span>📅 {format(selectedPost.date, "d 'de' MMMM 'de' yyyy", { locale: es })}</span>
              </div>
            </div>
            <div className="modal-body">
               <div style={{backgroundColor: selectedPost.blog.color, color: 'white', padding: '0.5rem 1rem', borderRadius: '5px', display: 'inline-block', marginBottom: '1rem', fontWeight: 'bold'}}>
                  📰 {selectedPost.blog.name}
               </div>
               <div dangerouslySetInnerHTML={{ __html: selectedPost.content.replace(/<img([^>]*)>/gi, '<img$1 style="max-width: 100%; height: auto; display: block; margin: 1rem auto;">') }} />
            </div>
              <div className="modal-footer">
                <a
                  href={selectedPost.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-original"
                >
                  Ver o post orixinal
                </a>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};
