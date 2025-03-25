// Updated Header.jsx
import React from 'react';

const Header = () => {
    return (
        <header className="bg-black/40 backdrop-blur-md border-b border-white/10 text-white py-3 px-6 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="2"></circle>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        <path d="M2 12h20"></path>
                    </svg>
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">COSMOS</h1>
                        <p className="text-xs text-blue-300">Gravity Simulator</p>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="hidden md:flex items-center space-x-1 text-sm">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        <span className="text-gray-300">
                            Powered by Newtonian Physics
                        </span>
                    </div>

                    <a
                        href="https://github.com/Olszewski-Jakub/3d-gravity-simulation"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-md hover:bg-white/5"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                        GitHub
                    </a>
                </div>
            </div>
        </header>
    );
};

export default Header;