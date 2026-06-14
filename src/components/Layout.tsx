import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900">
      {/* Header */}
      <header className="header sticky top-0 z-50">
        {/* Main Header Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo and Branding */}
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-3" onClick={closeMenu}>
                <img 
                  src="/imax/logoagax01.gif" 
                  alt="Logo AGAX" 
                  className="h-10 w-auto md:h-14 filter drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.3))" 
                />
                <div className="flex flex-col">
                  <span className="font-bold text-sm md:text-base tracking-wider leading-tight text-white">
                    AGAX
                  </span>
                  <span className="hidden sm:inline text-[9px] md:text-xs text-blue-200 font-bold uppercase tracking-wide">
                    Asociación Galega de Xadrecistas
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Center Section (Anniversary and Domains) - Hidden on Mobile */}
            <div className="hidden lg:flex flex-col items-center text-center">
              <span className="text-[10px] md:text-xs text-blue-200 font-bold tracking-wider">
                1989-2026. XXXVII Aniversario.
              </span>
              <div className="flex items-center space-x-2 mt-0.5">
                <a href="https://www.xadrez.gal" className="text-xs md:text-sm font-semibold text-white hover:text-blue-200 transition-colors">xadrez.gal</a>
                <span className="text-blue-300">|</span>
                <a href="https://www.agax.org" className="text-xs md:text-sm font-semibold text-white hover:text-blue-200 transition-colors">agax.org</a>
              </div>
            </div>

            {/* Desktop Right Banner / Internal Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="hidden lg:block">
                <img 
                  src="/imax/agax.gif" 
                  alt="Banner AGAX" 
                  className="h-10 md:h-12 w-auto filter drop-shadow(1px 1px 3px rgba(0, 0, 0, 0.3)) rounded" 
                />
              </div>
              <nav className="flex space-x-2 text-xs md:text-sm font-medium">
                <Link to="/" className={`px-2.5 py-1.5 rounded hover:bg-white/10 transition-colors ${location.pathname === '/' ? 'bg-white/15 text-white' : 'text-gray-100'}`}>Inicio</Link>
                <Link to="/directiva" className={`px-2.5 py-1.5 rounded hover:bg-white/10 transition-colors ${location.pathname === '/directiva' ? 'bg-white/15 text-white' : 'text-gray-100'}`}>Directiva</Link>
                <Link to="/alta-socio" className={`px-3 py-1.5 rounded bg-green-600 hover:bg-green-700 text-white font-bold transition-all`}>Faite socio</Link>
              </nav>
            </div>

            {/* Mobile Hamburger Button - Hidden on Desktop */}
            <div className="flex md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-white/10 focus:outline-none transition-all"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Abrir menú principal</span>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Desktop Bottom Navigation Bar (External Links) - Hidden on Mobile */}
        <div className="hidden md:block bg-black/15 border-t border-white/10 py-1.5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex justify-center space-x-6 text-[11px] md:text-xs">
              <a href="https://www.xogandocoxadrez.eu" target="_blank" rel="noopener noreferrer" className="hover:text-blue-200 transition-colors flex items-center">
                <span className="text-green-400 mr-1.5 font-bold text-[8px]">●</span> Novidades en xogando co xadrez
              </a>
              <a href="https://www.xadrecista.eu" target="_blank" rel="noopener noreferrer" className="hover:text-blue-200 transition-colors flex items-center">
                <span className="text-green-400 mr-1.5 font-bold text-[8px]">●</span> Torneos en xadrecista.eu
              </a>
              <a href="https://www.agax.net" target="_blank" rel="noopener noreferrer" className="hover:text-blue-200 transition-colors flex items-center">
                <span className="text-green-400 mr-1.5 font-bold text-[8px]">●</span> Xadrez en liña en agax.net
              </a>
            </nav>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#004466] border-t border-white/10 transition-all duration-300">
            <div className="px-3 pt-2 pb-4 space-y-1">
              <Link
                to="/"
                onClick={closeMenu}
                className={`block px-3 py-2 rounded text-base font-medium ${location.pathname === '/' ? 'bg-white/15 text-white' : 'text-gray-200 hover:bg-white/10'}`}
              >
                Inicio
              </Link>
              <Link
                to="/directiva"
                onClick={closeMenu}
                className={`block px-3 py-2 rounded text-base font-medium ${location.pathname === '/directiva' ? 'bg-white/15 text-white' : 'text-gray-200 hover:bg-white/10'}`}
              >
                Directiva
              </Link>
              <Link
                to="/alta-socio"
                onClick={closeMenu}
                className={`block px-3 py-2 rounded text-base font-bold bg-green-600 text-white hover:bg-green-700`}
              >
                Faite socio
              </Link>
              <Link
                to="/registro-lichess"
                onClick={closeMenu}
                className={`block px-3 py-2 rounded text-base font-medium ${location.pathname === '/registro-lichess' ? 'bg-white/15 text-white' : 'text-gray-200 hover:bg-white/10'}`}
              >
                Inscrición Equipo Online
              </Link>

              <div className="border-t border-white/10 my-2 pt-2"></div>

              <a
                href="https://www.xogandocoxadrez.eu"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 rounded text-sm font-medium text-gray-200 hover:bg-white/10"
              >
                <span className="text-green-400 mr-1.5 text-[8px]">●</span> Novidades en xogando co xadrez
              </a>
              <a
                href="https://www.xadrecista.eu"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 rounded text-sm font-medium text-gray-200 hover:bg-white/10"
              >
                <span className="text-green-400 mr-1.5 text-[8px]">●</span> Torneos en xadrecista.eu
              </a>
              <a
                href="https://www.agax.net"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 rounded text-sm font-medium text-gray-200 hover:bg-white/10"
              >
                <span className="text-green-400 mr-1.5 text-[8px]">●</span> Xadrez en liña en agax.net
              </a>

              <div className="border-t border-white/10 my-2 pt-2 px-3 text-center">
                <p className="text-xs text-blue-300 font-bold uppercase tracking-wider">
                  XXXVII Aniversario (1989-2026)
                </p>
                <div className="flex justify-center space-x-4 mt-1">
                  <a href="https://www.xadrez.gal" className="text-xs font-semibold text-white hover:underline">xadrez.gal</a>
                  <span className="text-blue-400">|</span>
                  <a href="https://www.agax.org" className="text-xs font-semibold text-white hover:underline">agax.org</a>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
            <main className={isHome ? 'layout-main layout-main-home' : 'layout-main layout-main-default'}>
        {children}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
            <div className="footer-links">
                <div className="footer-section">
                    <h4>Información</h4>
                    <Link to="/directiva">Directiva</Link>
                    <a href="/pdfs/estatutos%20agax.pdf" target="_blank">Estatutos</a>
                    <a href="/arquivos/arquivo.htm" target="_blank">Arquivos Antigos</a>

                    <h4 style={{ marginTop: '1.1rem' }}>Contacto</h4>
                    <a href="mailto:correo@agax.org?subject=Contacto dende a web">correo@agax.org</a>
                </div>
                <div className="footer-section">
                    <h4>Formularios</h4>
                    <Link to="/alta-socio">Faite socio</Link>
                    <Link to="/registro-lichess">Inscrición Equipo Online</Link>
                    <a href="http://eepurl.com/chIhNH" target="_blank">Subscribirse á lista de correo</a>
                </div>
                <div className="footer-section">
                    <h4>Redes Sociais</h4>
                    <a href="https://www.instagram.com/xadrecistas" target="_blank">Instagram</a>
                    <a href="https://www.facebook.com/xadrecistas" target="_blank">Facebook</a>
                    <a href="https://twitter.com/xadrecistas" target="_blank">Twitter</a>
                </div>
                <div className="footer-section">
                    <h4>Legal</h4>
                    <p className="legal-text">© 2026 ASOCIACIÓN GALEGA DE XADRECISTAS</p>
                    <p className="legal-text">@xadrecistas</p>
                    <p className="legal-text">Número de inscrición: 88.357</p>
                    <p className="legal-text">Rexistro do Ministerio de Interior</p>
                    <p className="legal-text">1 de setembro de 1989</p>
                    <p className="legal-text">Asociación sen ánimo de lucro</p>
                    <p className="legal-text">CIF: G-15228844</p>
                    <Link to="/politica-privacidade" className="legal-text" style={{ textDecoration: 'underline' }}>Política de privacidade</Link>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};
