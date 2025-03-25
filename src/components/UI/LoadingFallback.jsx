'use client';

import React from 'react';

const LoadingFallback = () => {
    return (
        <div className="w-full h-screen bg-space-dark flex flex-col items-center justify-center">
            <div className="text-center">
                <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-bold text-white mb-2">Loading Gravity Simulator</h2>
                <p className="text-gray-300">Initializing physics engine...</p>
            </div>
        </div>
    );
};

export default LoadingFallback;