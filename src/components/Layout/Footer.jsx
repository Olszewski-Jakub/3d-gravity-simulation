import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-black/40 backdrop-blur-md border-t border-white/10 text-white py-2 px-6">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center text-xs text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    Built with Next.js, React Three Fiber, and Tailwind CSS
                </div>

                <div className="flex space-x-4 mt-2 md:mt-0">
                    <div className="flex items-center text-xs text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        Simulation time: <span className="font-mono ml-1" id="simulation-time">00:00:00</span>
                    </div>

                    <button className="text-xs text-blue-300 hover:text-blue-200 transition-colors flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="16"></line>
                            <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg>
                        Help
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;