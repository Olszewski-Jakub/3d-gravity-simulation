'use client';

import React from 'react';

const LoadingFallback = () => {
    return (
        <div className="w-full h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
            {/* Stars background */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(100)].map((_, i) => {
                    const size = Math.random() * 2 + 1;
                    const top = Math.random() * 100;
                    const left = Math.random() * 100;
                    const duration = Math.random() * 3 + 2;
                    return (
                        <div
                            key={i}
                            className="absolute rounded-full bg-white animate-pulse"
                            style={{
                                width: `${size}px`,
                                height: `${size}px`,
                                top: `${top}%`,
                                left: `${left}%`,
                                opacity: Math.random() * 0.8 + 0.2,
                                animationDuration: `${duration}s`
                            }}
                        />
                    )
                })}
            </div>

            <div className="z-10 text-center px-4">
                {/* Planet loading animation */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                    {/* Orbit path */}
                    <div className="absolute inset-0 border-2 border-blue-500/20 rounded-full"></div>

                    {/* Sun */}
                    <div className="absolute w-10 h-10 top-1/2 left-1/2 -mt-5 -ml-5 bg-orange-400 rounded-full shadow-lg shadow-orange-500/50 animate-pulse"></div>

                    {/* Orbiting planet */}
                    <div className="absolute w-4 h-4 bg-blue-400 rounded-full shadow-md animate-spin"
                         style={{
                             top: 'calc(50% - 2px)',
                             left: 'calc(100% - 8px)',
                             transformOrigin: 'calc(-50% + 4px) 2px',
                             animationDuration: '3s'
                         }}>
                    </div>
                </div>

                <h2 className="text-xl font-bold text-white mb-2">Loading Gravity Simulator</h2>

                <div className="max-w-md mx-auto">
                    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-progress"></div>
                    </div>
                    <p className="text-gray-400 mt-3 animate-pulse">Initializing physics engine...</p>
                </div>
            </div>

            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes progress {
                    0% { width: 5%; }
                    50% { width: 70%; }
                    100% { width: 90%; }
                }
                .animate-spin {
                    animation: spin 3s linear infinite;
                }
                .animate-progress {
                    animation: progress 2s ease-in-out infinite alternate;
                }
            `}</style>
        </div>
    );
};

export default LoadingFallback;