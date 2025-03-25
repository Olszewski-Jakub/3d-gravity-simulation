import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-space-medium bg-opacity-90 text-white p-3 text-center text-sm">
            <div className="container mx-auto">
                <p>
                    3D Gravity Simulator built with Next.js, React Three Fiber, and Tailwind CSS
                </p>
                <p className="text-gray-400 mt-1">
                    Simulating Newton's Law of Universal Gravitation with accurate numerical methods
                </p>
            </div>
        </footer>
    );
};

export default Footer;