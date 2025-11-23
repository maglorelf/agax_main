import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900">
      {/* Header */}
      <header className="header">
        <div className="header-main">
            <div className="logo-section">
                <Link to="/">
                    <img src="/imax/logoagax01.gif" alt="Logo AGAX" className="logo-small" />
                </Link>
            </div>
            
            <div className="title-section">
                <h1>ASOCIACIÓN GALEGA DE XADRECISTAS</h1>
                <p className="anniversary">1989-2025. XXXVI Aniversario.</p>
                <div className="domains">
                    <a href="https://www.xadrez.gal" className="domain">xadrez.gal</a>
                    <span className="separator">|</span>
                    <a href="https://www.agax.org" className="domain">agax.org</a>
                </div>
            </div>
            
            <div className="banner-section">
                <img src="/imax/agax.gif" alt="Banner AGAX" className="banner" />
            </div>
        </div>
        
        <div className="header-bottom">
            <nav className="bottom-nav">
                <span className="nav-highlight">●</span>
                <a href="https://www.xogandocoxadrez.eu" target="_blank" rel="noopener noreferrer">Novidades en xogando co xadrez</a>
                <span className="separator">●</span>
                <a href="https://www.xadrecista.eu" target="_blank" rel="noopener noreferrer">Torneos en xadrecista.eu</a>
                <span className="separator">●</span>
                <a href="https://www.agax.net" target="_blank" rel="noopener noreferrer">Xadrez en liña en agax.net</a>
                <span className="separator">●</span>
                <Link to="/registro-lichess" className={location.pathname === '/registro-lichess' ? 'nav-highlight' : ''}>
                    Inscrición Equipo Online
                </Link>
                <span className="separator">●</span>
            </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
            <div className="footer-links">
                <div className="footer-section">
                    <h4>Información</h4>
                    <a href="/pax/directiva.htm" target="_blank">Directiva</a>
                    <a href="/pdfs/estatutos%20agax.pdf" target="_blank">Estatutos</a>
                    <a href="/arquivos/arquivo.htm" target="_blank">Arquivos Antigos</a>
                </div>
                <div className="footer-section">
                    <h4>Contacto</h4>
                    <a href="mailto:correo@agax.org?subject=Contacto dende a web">correo@agax.org</a>
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
                    <p className="legal-text">© 2025 ASOCIACIÓN GALEGA DE XADRECISTAS</p>
                    <p className="legal-text">@xadrecistas</p>
                    <p className="legal-text">Número de inscrición: 88.357</p>
                    <p className="legal-text">Rexistro do Ministerio de Interior</p>
                    <p className="legal-text">1 de setembro de 1989</p>
                    <p className="legal-text">Asociación sen ánimo de lucro</p>
                    <p className="legal-text">CIF: G-15228844</p>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};
