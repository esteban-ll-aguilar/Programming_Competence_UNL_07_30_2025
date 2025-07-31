import React, { useEffect, useState } from 'react';

const NotFoundError = () => {
  const [scanProgress, setScanProgress] = useState(0);
  const [glitchText, setGlitchText] = useState('404');

  useEffect(() => {
    const interval = setInterval(() => {
      setScanProgress((prev) => (prev >= 100 ? 0 : prev + Math.random() * 4));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const glitchTexts = ['404', '4Ø4', '4◊4', '4□4', '404'];
      setGlitchText(glitchTexts[Math.floor(Math.random() * glitchTexts.length)]);
    }, 2000);
    return () => clearInterval(glitchInterval);
  }, []);

  // Componente para partículas de código flotante
  const CodeParticle = ({ delay = 0 }) => (
    <div
      className="absolute text-xs font-mono text-purple-500/30 dark:text-purple-400/40 
                 animate-pulse select-none pointer-events-none"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${4 + Math.random() * 3}s`,
      }}
    >
      {Math.random() > 0.5 ? '</>' : '{}'}
    </div>
  );

  // Componente para ondas de radar
  const RadarWave = ({ delay = 0, size = 'w-32 h-32' }) => (
    <div
      className={`absolute ${size} border-2 border-cyan-400/20 dark:border-cyan-300/30 
                  rounded-full animate-ping`}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: '3s',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 
                    relative overflow-hidden bg-gradient-to-br from-slate-50 to-indigo-100 
                    dark:from-gray-900 dark:to-indigo-900 transition-colors duration-500">
      
      {/* Partículas de código flotante */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 20 }, (_, i) => (
          <CodeParticle key={i} delay={i * 0.3} />
        ))}
      </div>

      {/* Sistema de radar/búsqueda */}
      <div className="relative mb-12 z-10 transform hover:scale-105 transition-transform duration-300">
        <div className="w-80 h-80 bg-gray-900/90 dark:bg-gray-800/95 rounded-full 
                        shadow-2xl border-4 border-cyan-500/30 dark:border-cyan-400/40 
                        flex items-center justify-center backdrop-blur-sm relative overflow-hidden">
          
          {/* Ondas de radar */}
          <div className="absolute inset-0">
            <RadarWave delay={0} size="w-20 h-20" />
            <RadarWave delay={1} size="w-40 h-40" />
            <RadarWave delay={2} size="w-60 h-60" />
            <RadarWave delay={3} size="w-72 h-72" />
          </div>

          {/* Línea de barrido rotatoria */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-36 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent 
                            animate-spin origin-center opacity-70"
                 style={{ animationDuration: '4s' }} />
          </div>

          {/* Puntos de búsqueda */}
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-red-400 dark:bg-red-300 rounded-full animate-pulse"
              style={{
                left: `${30 + Math.random() * 40}%`,
                top: `${30 + Math.random() * 40}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${1.5 + Math.random()}s`,
              }}
            />
          ))}

          {/* Icono central de búsqueda */}
          <div className="relative z-10 text-cyan-400 dark:text-cyan-300">
            <svg className="w-16 h-16 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>

          {/* Texto "SCANNING" */}
          <div className="absolute bottom-4 text-cyan-400 dark:text-cyan-300 font-mono text-sm animate-pulse">
            SCANNING...
          </div>

          {/* Icono de alerta */}
          <div className="absolute -top-4 -right-4 text-orange-500 dark:text-orange-400 
                          animate-bounce transform hover:scale-110 transition-transform duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-xl">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido del error */}
      <div className="max-w-lg text-center z-10 space-y-6">
        <div className="space-y-4">
          <h1 className="text-8xl font-black text-purple-600 dark:text-purple-400 
                         animate-pulse drop-shadow-lg filter blur-[0.5px] hover:blur-none 
                         transition-all duration-300 cursor-default select-none"
              style={{
                textShadow: '0 0 10px rgba(147, 51, 234, 0.5)',
                animation: 'glitch 2s infinite'
              }}>
            {glitchText}
          </h1>
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            La página que buscas ha desaparecido en el ciberespacio. Nuestros exploradores la están rastreando.
          </p>
        </div>

        {/* Terminal de búsqueda */}
        <div className="bg-black/90 dark:bg-gray-900/95 rounded-lg p-4 text-left 
                        border border-purple-500/30 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse delay-200"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse delay-500"></div>
            <span className="text-purple-400 text-sm ml-2 font-mono">explorer@web:~$</span>
          </div>
          <div className="text-purple-400 font-mono text-sm space-y-1">
            <div className="animate-pulse">
              <span className="text-red-400">[404]</span> Resource not found: /requested-page
            </div>
            <div className="animate-pulse delay-300">
              <span className="text-cyan-400">[SCAN]</span> Searching in {Math.floor(scanProgress)}% of web space...
            </div>
            <div className="animate-pulse delay-700">
              <span className="text-green-400">[HINT]</span> Try navigating to home or search...
            </div>
          </div>
          
          {/* Barra de progreso de búsqueda */}
          <div className="mt-3 bg-gray-800 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-300 rounded-full"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Botones mejorados */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6 z-10">
        <button
          onClick={() => window.location.href = '/'}
          className="group px-8 py-4 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 
                     dark:hover:bg-purple-600 text-white font-semibold rounded-xl 
                     transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25
                     hover:-translate-y-1 transform active:scale-95 border-2 
                     border-purple-500/20 hover:border-purple-400/40"
        >
          <span className="flex items-center justify-center gap-2 font-mono">
            🏠 RETURN_HOME
          </span>
        </button>
      </div>

      {/* Partículas decorativas flotantes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/40 dark:bg-purple-300/30 rounded-full 
                       animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Efectos CSS adicionales */}
      <style jsx>{`
        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          10% { transform: translate(-2px, -1px); }
          20% { transform: translate(2px, 1px); }
          30% { transform: translate(-1px, 2px); }
          40% { transform: translate(1px, -1px); }
          50% { transform: translate(-2px, 2px); }
          60% { transform: translate(2px, -2px); }
          70% { transform: translate(-1px, -1px); }
          80% { transform: translate(1px, 2px); }
          90% { transform: translate(-2px, -1px); }
        }
      `}</style>
    </div>
  );
};

export default NotFoundError;