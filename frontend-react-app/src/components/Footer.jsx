import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';
import { FaWhatsapp, FaFacebook, FaInstagram, FaGithub, FaLinkedin } from 'react-icons/fa'; 
import useThemeContext from '../hooks/useThemeContext';
import { LOGO192 } from '../lib/constants';

export default function Footer() {
  const { isDark } = useThemeContext();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`w-full py-12 px-4 md:px-8 lg:px-16   ${isDark ? 'bg-secondary/80 s shadow-[0_4px_20px_rgba(0,123,255,0.4)] ' : 'bg-secondary/20 shadow-[0_4px_20px_rgba(128,0,255,0.2)]'}`}>

      <div className="container mx-auto">

        {/* Enlaces y Contacto */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Columna 1: Información de la empresa */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src={LOGO192} 
                alt="Logo" 
                className="h-10 w-10 rounded-full"
              />
              <span className="text-xl font-bold text-primary">Competencia 2025</span>
            </div>
            <p className="text-muted-foreground mb-6">
              Desarrollado por Esteban Leon Aguilar
            </p>
            <div className="flex gap-3">
              <a 
                href="https://www.linkedin.com/in/esteban-leon-aguilar/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`w-9 h-9 rounded-full ${isDark ? 'bg-background' : 'bg-white'} flex items-center justify-center text-muted-foreground hover:text-white hover:bg-blue-400 transition-colors`}
                aria-label="LinkedIn"
              >
                <FaLinkedin size={18} />
              </a>
              <a 
                href="https://github.com/esteban-ll-aguilar/Programming_Competence_UNL_07_30_2025" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`w-9 h-9 rounded-full ${isDark ? 'bg-background' : 'bg-white'} flex items-center justify-center text-muted-foreground hover:text-white hover:bg-blue-950 transition-colors`}
                aria-label="GitHub"
              >
                <FaGithub size={18} />
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h4 className="text-lg font-bold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full ${isDark ? 'bg-background' : 'bg-white'} flex items-center justify-center`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  </div>
                  <span>XXXXXXXXXXXXXXXX</span>
                </Link>
              </li>
              <li>
                <Link to="/servicios" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full ${isDark ? 'bg-background' : 'bg-white'} flex items-center justify-center`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                    </svg>
                  </div>
                  <span>XXXXXXXXXXXXXXXX</span>
                </Link>
              </li>
              <li>
                <Link to="/proyectos" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full ${isDark ? 'bg-background' : 'bg-white'} flex items-center justify-center`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <span>XXXXXXXXXXXXXXXX</span>
                </Link>
              </li>
              <li>
                <Link to="/sobre-nosotros" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full ${isDark ? 'bg-background' : 'bg-white'} flex items-center justify-center`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <span>XXXXXXXXXXXXXXXX</span>
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full ${isDark ? 'bg-background' : 'bg-white'} flex items-center justify-center`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <span>XXXXXXXXXXXXXXXX</span>
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full ${isDark ? 'bg-background' : 'bg-white'} flex items-center justify-center`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-warning">
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5z"></path>
                      <path d="M8 7h6"></path>
                      <path d="M8 11h8"></path>
                      <path d="M8 15h5"></path>
                    </svg>
                  </div>
                  <span>XXXXXXXXXXXXXXXX</span>
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full ${isDark ? 'bg-background' : 'bg-white'} flex items-center justify-center`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <path d="M12 17h.01"></path>
                    </svg>
                  </div>
                  <span>XXXXXXXXXXXXXXXX</span>
                </Link>
              </li>
            </ul>
          </div>


          {/* Columna 4: Contacto */}
          <div>
            <h4 className="text-lg font-bold mb-4">Información de Contacto</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-primary min-w-5 h-5 mt-0.5" />
                <span className="text-muted-foreground">
                  Av. Universitaria<br />
                  Loja, Ecuador
                </span>
              </li>
              <li className="flex items-start gap-3">
                <FaWhatsapp className="text-primary min-w-5 h-5 mt-0.5" />
                <span className="text-muted-foreground">
                  <a href="https://wa.me/5939931144884" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  +593 99 311 4884
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="text-primary min-w-5 h-5 mt-0.5" />
                <span className="text-muted-foreground">
                  <a href="mailto:esteban.leon@unl.edu.ec" className="hover:text-primary transition-colors">
                  esteban.leon@unl.edu.ec
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className={`h-px w-full ${isDark ? 'bg-muted' : 'bg-secondary/50'} mb-6`}></div>

        {/* Copyright */}
        <div className="text-center text-muted-foreground text-sm">
          <p>© {currentYear} Todos los derechos reservados.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link to="/politica-de-privacidad" className="hover:text-primary transition-colors">Política de Privacidad</Link>
            <Link to="/terminos-y-condiciones" className="hover:text-primary transition-colors">Términos de Servicio</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
