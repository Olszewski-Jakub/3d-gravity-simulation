import React from 'react';

const Header = () => {
    return (
        <header className="bg-space-medium bg-opacity-90 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Gravity Simulator</h1>

                <div className="flex space-x-4">
          <span className="hidden md:inline text-blue-300">
            Explore Newtonian Physics in 3D Space
          </span>

                    <a
                        href="https://github.com/your-repo/gravity-simulator"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-blue-300 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                    </a>
                </div>
            </div>
        </header>
    );
};

export default Header;