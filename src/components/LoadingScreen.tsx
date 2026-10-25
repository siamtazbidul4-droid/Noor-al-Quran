import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete?: () => void;
  minimumDuration?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  onComplete, 
  minimumDuration = 5000 
}) => {
  const [stage, setStage] = useState<'entering' | 'presenting' | 'exiting'>('entering');

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Stage 1: Entrance (0-500ms)
    const entranceTimer = setTimeout(() => {
      setStage('presenting');
    }, 500);

    // Stage 2: Presentation continues until 4700ms

    // Stage 3: Exit preparation (4700ms)
    const exitTimer = setTimeout(() => {
      setStage('exiting');
    }, 4700);

    // Complete and unmount at exactly 5000ms
    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, minimumDuration);

    return () => {
      clearTimeout(entranceTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [minimumDuration, onComplete]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-gradient-to-b from-[#0A3328] via-[#0B3D32] to-[#111C19] flex items-center justify-center overflow-hidden"
      style={{
        animation: stage === 'exiting' ? 'fadeOut 300ms ease-out forwards' : 'none'
      }}
      role="progressbar"
      aria-label="Loading Noor Al-Quran"
      aria-live="polite"
    >
      {/* Decorative Islamic Geometric Pattern Background */}
      <div 
        className="absolute inset-0 opacity-[0.07]"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B38A42' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Radial Glow Behind Quran */}
      <div 
        className="absolute inset-0 opacity-40"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 600px 400px at center, rgba(179, 138, 66, 0.25) 0%, transparent 60%)',
          animation: stage === 'presenting' ? 'glowPulse 4s ease-in-out infinite' : 'none'
        }}
      />

      {/* Main Content Container */}
      <div 
        className="relative z-10 flex flex-col items-center justify-center px-4 w-full max-w-lg"
        style={{
          animation: stage === 'entering' 
            ? 'contentEnter 500ms cubic-bezier(0.16, 1, 0.3, 1) forwards'
            : stage === 'exiting'
            ? 'contentExit 300ms ease-out forwards'
            : 'none'
        }}
      >
        {/* Ornamental Ring Container */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 mb-8" aria-hidden="true">
          {/* Rotating Ornamental Ring */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 200 200"
            style={{
              animation: stage === 'presenting' ? 'rotateRing 20s linear infinite' : 'none'
            }}
          >
            {/* Outer Decorative Circle */}
            <circle
              cx="100"
              cy="100"
              r="95"
              fill="none"
              stroke="url(#goldGradient)"
              strokeWidth="0.5"
              opacity="0.3"
            />
            
            {/* Ornamental Pattern Elements */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <g key={angle} transform={`rotate(${angle} 100 100)`}>
                {/* Small decorative star */}
                <circle cx="100" cy="8" r="2" fill="#B38A42" opacity="0.6" />
                <path
                  d="M 100 5 L 101 7 L 103 7 L 101.5 8.5 L 102 10.5 L 100 9 L 98 10.5 L 98.5 8.5 L 97 7 L 99 7 Z"
                  fill="#DFC186"
                  opacity="0.5"
                />
              </g>
            ))}

            {/* Inner decorative elements */}
            {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle) => (
              <g key={angle} transform={`rotate(${angle} 100 100)`}>
                <rect
                  x="99"
                  y="15"
                  width="2"
                  height="8"
                  rx="1"
                  fill="#B38A42"
                  opacity="0.4"
                />
              </g>
            ))}

            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#B38A42" />
                <stop offset="50%" stopColor="#DFC186" />
                <stop offset="100%" stopColor="#B38A42" />
              </linearGradient>
            </defs>
          </svg>

          {/* Central Quran Book */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{
              animation: stage === 'presenting' ? 'quranFloat 6s ease-in-out infinite' : 'none'
            }}
          >
            <svg
              width="140"
              height="180"
              viewBox="0 0 140 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-2xl"
            >
              {/* Book Shadow */}
              <ellipse cx="70" cy="175" rx="45" ry="5" fill="#000000" opacity="0.2" />

              {/* Book Spine (Left Edge) */}
              <path
                d="M 15 10 L 15 170 L 20 175 L 20 15 Z"
                fill="url(#spineGradient)"
              />

              {/* Main Book Body */}
              <rect
                x="20"
                y="10"
                width="110"
                height="160"
                rx="3"
                fill="url(#bookGradient)"
                stroke="#8C6B2D"
                strokeWidth="1"
              />

              {/* Book Cover Decorative Border */}
              <rect
                x="28"
                y="18"
                width="94"
                height="144"
                rx="2"
                fill="none"
                stroke="#DFC186"
                strokeWidth="1.5"
                opacity="0.8"
              />

              {/* Inner Decorative Border */}
              <rect
                x="33"
                y="23"
                width="84"
                height="134"
                rx="1"
                fill="none"
                stroke="#DFC186"
                strokeWidth="0.5"
                opacity="0.5"
              />

              {/* Central Islamic Geometric Ornament */}
              <g transform="translate(70, 90)">
                {/* Central Star */}
                <circle cx="0" cy="0" r="25" fill="none" stroke="#DFC186" strokeWidth="1" opacity="0.6" />
                <circle cx="0" cy="0" r="20" fill="none" stroke="#DFC186" strokeWidth="0.5" opacity="0.4" />
                
                {/* 8-point Star Pattern */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                  const rad = (angle * Math.PI) / 180;
                  const x1 = Math.cos(rad) * 10;
                  const y1 = Math.sin(rad) * 10;
                  const x2 = Math.cos(rad) * 22;
                  const y2 = Math.sin(rad) * 22;
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#DFC186"
                      strokeWidth="1.5"
                      opacity="0.7"
                    />
                  );
                })}

                {/* Center Circle */}
                <circle cx="0" cy="0" r="8" fill="#B38A42" opacity="0.8" />
                <circle cx="0" cy="0" r="5" fill="#DFC186" opacity="0.9" />
              </g>

              {/* Top Decorative Element */}
              <text
                x="70"
                y="45"
                textAnchor="middle"
                fill="#DFC186"
                fontSize="16"
                fontFamily="serif"
                fontWeight="bold"
                opacity="0.9"
              >
                القرآن
              </text>

              {/* Bottom Decorative Accent */}
              <g transform="translate(70, 145)">
                <path
                  d="M -15 0 L -5 0 L -3 2 L 3 2 L 5 0 L 15 0"
                  stroke="#DFC186"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.6"
                />
              </g>

              {/* Book Pages Effect (Right Edge) */}
              <g opacity="0.3">
                <line x1="128" y1="12" x2="128" y2="168" stroke="#FFFFFF" strokeWidth="0.5" />
                <line x1="126" y1="13" x2="126" y2="167" stroke="#FFFFFF" strokeWidth="0.5" />
                <line x1="124" y1="14" x2="124" y2="166" stroke="#FFFFFF" strokeWidth="0.5" />
              </g>

              {/* Shine Effect */}
              <rect
                x="20"
                y="10"
                width="40"
                height="160"
                rx="3"
                fill="url(#shineGradient)"
                opacity="0.3"
              />

              <defs>
                <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#B38A42" />
                  <stop offset="50%" stopColor="#9B7435" />
                  <stop offset="100%" stopColor="#8C6B2D" />
                </linearGradient>
                <linearGradient id="spineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6B5321" />
                  <stop offset="100%" stopColor="#8C6B2D" />
                </linearGradient>
                <linearGradient id="shineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Application Branding */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide drop-shadow-lg">
            Noor Al-Quran
          </h1>
          <p className="text-base sm:text-lg text-[#DFC186]/90 font-bengali tracking-wide">
            আল-কুরআন — হৃদয়ের প্রশান্তি
          </p>
        </div>

        {/* Decorative Bottom Accent */}
        <div className="mt-10 flex items-center gap-3 opacity-40" aria-hidden="true">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#B38A42] to-[#B38A42]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#DFC186]" />
          <div className="w-12 h-px bg-gradient-to-l from-transparent via-[#B38A42] to-[#B38A42]" />
        </div>
      </div>

      <style>{`
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes contentEnter {
          from {
            opacity: 0;
            transform: scale(0.92);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes contentExit {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.96);
          }
        }

        @keyframes glowPulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes rotateRing {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes quranFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        /* Respect reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          @keyframes contentEnter {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes contentExit {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          @keyframes glowPulse {
            0%, 100% { opacity: 0.35; }
          }
          @keyframes rotateRing {
            from { transform: rotate(0deg); }
            to { transform: rotate(0deg); }
          }
          @keyframes quranFloat {
            0%, 100% { transform: translateY(0px); }
          }
        }
      `}</style>
    </div>
  );
};
