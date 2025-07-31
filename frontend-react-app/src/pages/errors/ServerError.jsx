import React, { useEffect, useState } from 'react';

const ServerError = () => {
  const [, setRepairProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRepairProgress((prev) => (prev >= 100 ? 100 : prev + Math.random() * 3));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Componente para las partículas de humo
  const SmokeParticle = ({ delay = 0 }) => (
    <div 
      className="absolute w-3 h-3 bg-gray-400/60 dark:bg-gray-200/40 rounded-full 
                 animate-bounce opacity-0"
      style={{
        animationDelay: `${delay}s`,
        animationDuration: '3s',
        animationIterationCount: 'infinite',
        left: `${Math.random() * 30}px`,
      }}
    />
  );

  // Componente para la lluvia binaria
  const BinaryRain = ({ delay = 0 }) => (
    <div
      className="absolute text-xs font-mono text-emerald-500/20 dark:text-emerald-400/30 
                 animate-pulse select-none"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${3 + Math.random() * 2}s`,
      }}
    >
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="leading-3">
          {Math.round(Math.random())}
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 
                    relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 
                    dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      
      {/* Lluvia binaria de fondo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 15 }, (_, i) => (
          <BinaryRain key={i} delay={i * 0.5} />
        ))}
      </div>

      {/* Rack del servidor */}
      <div className="relative mb-12 z-10 transform hover:scale-105 transition-transform duration-300">
        <div className="w-72 h-96 bg-gray-800 dark:bg-gray-700 rounded-xl shadow-2xl 
                        border-4 border-gray-600 dark:border-gray-500 flex flex-col overflow-hidden
                        backdrop-blur-sm">
          
          {/* Servidores individuales */}
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className={`h-12 border-b border-gray-600 dark:border-gray-500 flex items-center 
                         justify-between px-4 transition-all duration-500 ${
                i === 3 
                  ? 'bg-red-900/40 dark:bg-red-800/50 animate-pulse' 
                  : 'bg-gray-900 dark:bg-gray-800 hover:bg-gray-800 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === 3 
                    ? 'bg-red-500 animate-ping shadow-lg shadow-red-500/50' 
                    : 'bg-emerald-500 shadow-sm shadow-emerald-500/30'
                }`} />
                <span className="text-sm text-gray-300 dark:text-gray-200 font-mono">
                  srv-{String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping delay-300" />
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping delay-700" />
              </div>
            </div>
          ))}

          {/* Efectos de humo */}
          <div className="absolute top-36 right-8 pointer-events-none">
            {Array.from({ length: 6 }, (_, i) => (
              <SmokeParticle key={i} delay={i * 0.8} />
            ))}
          </div>

          {/* Rayo eléctrico */}
          <div className="absolute top-32 left-1/2 transform -translate-x-1/2 
                          text-yellow-400 dark:text-yellow-300 animate-pulse">
            <svg className="w-12 h-12 drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* Icono de herramientas */}
          <div className="absolute -bottom-6 -right-6 text-gray-500 dark:text-gray-400 
                          animate-spin transform hover:scale-110 transition-transform duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-xl">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido del error */}
      <div className="max-w-lg text-center z-10 space-y-6">
        <div className="space-y-4">
          <h1 className="text-8xl font-black text-red-500 dark:text-red-400 
                         animate-pulse drop-shadow-lg">
            500
          </h1>
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
            Server Error
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Nuestros servidores están en mantenimiento. Estamos trabajando para solucionarlo.
          </p>
        </div>

        
        {/* Terminal de estado */}
          <div className="bg-black/90 dark:bg-gray-900/95 rounded-lg p-4 text-left 
                          border border-green-500/30 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse delay-200"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse delay-500"></div>
              <span className="text-green-400 text-sm ml-2 font-mono">system@server:~$</span>
            </div>
            <div className="text-green-400 font-mono text-sm space-y-1">
              <div className="animate-pulse">
                <span className="text-red-400">[ERROR]</span> Connection timeout: srv-04
              </div>
              <div className="animate-pulse delay-300">
                <span className="text-yellow-400">[WARN]</span> High memory usage detected
              </div>
              <div className="animate-pulse delay-700">
                <span className="text-green-400">[INFO]</span> Initiating recovery sequence...
              </div>
            </div>
          </div>
        </div>

        {/* Botones mejorados */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
          <button
            onClick={() => window.location.href = '/'}
            className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 
                       dark:hover:bg-blue-600 text-white font-semibold rounded-xl 
                       transition-all duration-300 shadow-lg hover:shadow-xl 
                       hover:-translate-y-1 transform active:scale-95 border-2 
                       border-blue-500/20 hover:border-blue-400/40"
          >
            <span className="flex items-center justify-center gap-2 font-mono">
              🏠 RETURN_HOME
            </span>
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="group px-8 py-4 bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 
                       dark:hover:bg-gray-600 text-green-400 dark:text-green-300 font-semibold 
                       rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl 
                       hover:-translate-y-1 transform active:scale-95 flex items-center 
                       justify-center gap-3 border-2 border-green-500/30 hover:border-green-400/50"
          >
            <svg className="w-5 h-5 animate-spin group-hover:animate-spin" 
                 fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" 
                      stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="font-mono">RETRY_CONN</span>
          </button>
          
        {/* Botones mejorados */}
      </div>

      {/* Decoración de partículas flotantes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 dark:bg-blue-300/20 rounded-full 
                       animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ServerError;