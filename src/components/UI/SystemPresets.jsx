import React, { useState } from 'react';

const SystemPresets = ({ onSelect }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Preset solar systems
    const presets = {
        solarSystem: [
            // Sun
            {
                id: 'sun',
                name: 'Sun',
                type: 'star',
                mass: 1.989e30, // kg
                radius: 696340000, // meters
                position: [0, 0, 0],
                velocity: [0, 0, 0],
                color: '#FFB142',
                texture: 'sun.jpg',
            },
            // Mercury
            {
                id: 'mercury',
                name: 'Mercury',
                type: 'planet',
                mass: 3.3011e23, // kg
                radius: 2439700, // meters
                position: [57.9e9, 0, 0], // 57.9 million km from sun
                velocity: [0, 47.36e3, 0], // 47.36 km/s orbital velocity
                color: '#B7B7B7',
                texture: 'mercury.jpg',
            },
            // Venus
            {
                id: 'venus',
                name: 'Venus',
                type: 'planet',
                mass: 4.8675e24, // kg
                radius: 6051800, // meters
                position: [108.2e9, 0, 0], // 108.2 million km from sun
                velocity: [0, 35.02e3, 0], // 35.02 km/s orbital velocity
                color: '#E6C35A',
                texture: 'venus.jpg',
            },
            // Earth
            {
                id: 'earth',
                name: 'Earth',
                type: 'planet',
                mass: 5.972e24, // kg
                radius: 6371000, // meters
                position: [149.6e9, 0, 0], // 149.6 million km from sun
                velocity: [0, 29.78e3, 0], // 29.78 km/s orbital velocity
                color: '#1289A7',
                texture: 'earth.jpg',
            },
            // Mars
            {
                id: 'mars',
                name: 'Mars',
                type: 'planet',
                mass: 6.39e23, // kg
                radius: 3389500, // meters
                position: [227.9e9, 0, 0], // 227.9 million km from sun
                velocity: [0, 24.07e3, 0], // 24.07 km/s orbital velocity
                color: '#D0312D',
                texture: 'mars.jpg',
            },
            // Jupiter
            {
                id: 'jupiter',
                name: 'Jupiter',
                type: 'planet',
                mass: 1.898e27, // kg
                radius: 69911000, // meters
                position: [778.5e9, 0, 0], // 778.5 million km from sun
                velocity: [0, 13.07e3, 0], // 13.07 km/s orbital velocity
                color: '#E59F71',
                texture: 'jupiter.jpg',
            },
        ],
        earthMoonSystem: [
            // Earth
            {
                id: 'earth',
                name: 'Earth',
                type: 'planet',
                mass: 5.972e24, // kg
                radius: 6371000, // meters
                position: [0, 0, 0],
                velocity: [0, 0, 0],
                color: '#1289A7',
                texture: 'earth.jpg',
            },
            // Moon
            {
                id: 'moon',
                name: 'Moon',
                type: 'moon',
                mass: 7.342e22, // kg
                radius: 1737400, // meters
                position: [384400000, 0, 0], // 384,400 km from Earth
                velocity: [0, 1022, 0], // 1.022 km/s orbital velocity
                color: '#CCCCCC',
                texture: 'moon.jpg',
            }
        ],
        binaryStarSystem: [
            // Star A
            {
                id: 'starA',
                name: 'Star A',
                type: 'star',
                mass: 1.5e30, // kg
                radius: 696340000, // meters
                position: [-1.5e10, 0, 0],
                velocity: [0, -15000, 0],
                color: '#FFB142',
                texture: 'sun.jpg',
            },
            // Star B
            {
                id: 'starB',
                name: 'Star B',
                type: 'star',
                mass: 1.0e30, // kg
                radius: 600000000, // meters
                position: [1.5e10, 0, 0],
                velocity: [0, 22500, 0],
                color: '#FF5722',
                texture: 'sun.jpg',
            },
            // Planet
            {
                id: 'binaryPlanet',
                name: 'Binary Planet',
                type: 'planet',
                mass: 6.0e24, // kg
                radius: 6371000, // meters
                position: [0, 5e10, 0],
                velocity: [30000, 0, 0],
                color: '#3498db',
                texture: 'earth.jpg',
            }
        ],
        blackHoleSystem: [
            // Supermassive black hole with orbiting bodies
            {
                id: 'blackhole',
                name: 'Black Hole',
                type: 'blackhole',
                mass: 4.3e36, // kg
                radius: 1.5e10, // Event horizon
                position: [0, 0, 0],
                velocity: [0, 0, 0],
                color: '#000000',
                texture: '',
            },
            // Orbiting star
            {
                id: 'orbitingStar',
                name: 'Orbiting Star',
                type: 'star',
                mass: 1.5e30, // kg
                radius: 6.0e8, // meters
                position: [3.0e11, 0, 0],
                velocity: [0, 5.0e4, 0],
                color: '#FFB142',
                texture: 'sun.jpg',
            },
            // Planet system in stable orbit
            {
                id: 'farPlanet1',
                name: 'Far Planet 1',
                type: 'planet',
                mass: 5.0e24, // kg
                radius: 6.4e6, // meters
                position: [8.0e11, 0, 0],
                velocity: [0, 3.5e4, 0],
                color: '#3498db',
                texture: 'earth.jpg',
            },
            {
                id: 'farPlanet2',
                name: 'Far Planet 2',
                type: 'planet',
                mass: 6.2e24, // kg
                radius: 7.2e6, // meters
                position: [1.2e12, 0, 0],
                velocity: [0, 2.8e4, 0],
                color: '#e74c3c',
                texture: 'mars.jpg',
            }
        ],
        chaosSystem: [
            // Multiple bodies with random positions and velocities for an unstable, chaotic system
            {
                id: 'center',
                name: 'Central Mass',
                type: 'star',
                mass: 2.0e30, // kg
                radius: 696340000, // meters
                position: [0, 0, 0],
                velocity: [0, 0, 0],
                color: '#FFB142',
                texture: 'sun.jpg',
            },
            // Random planet 1
            {
                id: 'planet1',
                name: 'Planet 1',
                type: 'planet',
                mass: 5.0e24, // kg
                radius: 6000000, // meters
                position: [1.2e11, 0, 0],
                velocity: [0, 25000, 10000],
                color: '#1289A7',
                texture: 'earth.jpg',
            },
            // Random planet 2
            {
                id: 'planet2',
                name: 'Planet 2',
                type: 'planet',
                mass: 4.0e24, // kg
                radius: 5500000, // meters
                position: [-8.0e10, 1.0e11, 0],
                velocity: [-10000, -15000, 5000],
                color: '#D0312D',
                texture: 'mars.jpg',
            },
            // Random planet 3
            {
                id: 'planet3',
                name: 'Planet 3',
                type: 'planet',
                mass: 3.5e24, // kg
                radius: 5000000, // meters
                position: [5.0e10, -1.3e11, 2.0e10],
                velocity: [20000, -8000, -12000],
                color: '#9b59b6',
                texture: 'venus.jpg',
            },
            // Random planet 4
            {
                id: 'planet4',
                name: 'Planet 4',
                type: 'planet',
                mass: 7.0e24, // kg
                radius: 7200000, // meters
                position: [0, 1.7e11, -1.0e11],
                velocity: [-18000, 5000, 15000],
                color: '#2ecc71',
                texture: 'earth.jpg',
            }
        ]
    };

    // Get system info for each preset
    const getSystemInfo = (system) => {
        const bodies = system.length;
        const stars = system.filter(body => body.type === 'star').length;
        const planets = system.filter(body => body.type === 'planet').length;
        const moons = system.filter(body => body.type === 'moon').length;
        const blackholes = system.filter(body => body.type === 'blackhole').length;

        return { bodies, stars, planets, moons, blackholes };
    };

    return (
        <div className="backdrop-blur-md bg-black/30 rounded-xl p-4 shadow-md border border-white/10">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                    System Presets
                </h3>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-white hover:text-blue-300 transition-colors rounded-full p-1 hover:bg-white/10"
                >
                    {isExpanded ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 15l-6-6-6 6"></path>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 9l6 6 6-6"></path>
                        </svg>
                    )}
                </button>
            </div>

            {isExpanded && (
                <div className="mt-4 space-y-4">
                    <p className="text-sm text-gray-300">
                        Load a pre-configured planetary system:
                    </p>

                    <div className="grid grid-cols-1 gap-3">
                        {/* Solar system preset */}
                        <button
                            onClick={() => onSelect(presets.solarSystem)}
                            className="flex items-center bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 border border-yellow-500/30 text-white py-2 px-3 rounded-lg transition-colors text-left group"
                        >
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="5"></circle>
                                    <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"></path>
                                </svg>
                            </div>
                            <div>
                                <span className="block font-medium">Solar System</span>
                                <span className="text-xs text-gray-300">Sun + 6 planets</span>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7"></path>
                            </svg>
                        </button>

                        {/* Earth-Moon System */}
                        <button
                            onClick={() => onSelect(presets.earthMoonSystem)}
                            className="flex items-center bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 border border-blue-500/30 text-white py-2 px-3 rounded-lg transition-colors text-left group"
                        >
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <circle cx="17" cy="7" r="4"></circle>
                                </svg>
                            </div>
                            <div>
                                <span className="block font-medium">Earth-Moon System</span>
                                <span className="text-xs text-gray-300">Closely orbiting celestial bodies</span>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7"></path>
                            </svg>
                        </button>

                        {/* Binary Star System */}
                        <button
                            onClick={() => onSelect(presets.binaryStarSystem)}
                            className="flex items-center bg-gradient-to-r from-orange-500/20 to-red-500/20 hover:from-orange-500/30 hover:to-red-500/30 border border-orange-500/30 text-white py-2 px-3 rounded-lg transition-colors text-left group"
                        >
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="8" cy="12" r="3"></circle>
                                    <circle cx="16" cy="12" r="3"></circle>
                                    <path d="M21 12c0 5-9 5-9 0"></path>
                                    <path d="M3 12c0 5 9 5 9 0"></path>
                                </svg>
                            </div>
                            <div>
                                <span className="block font-medium">Binary Star System</span>
                                <span className="text-xs text-gray-300">Two stars orbiting with a planet</span>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7"></path>
                            </svg>
                        </button>

                        {/* Black Hole System */}
                        <button
                            onClick={() => onSelect(presets.blackHoleSystem)}
                            className="flex items-center bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 border border-purple-500/30 text-white py-2 px-3 rounded-lg transition-colors text-left group"
                        >
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </div>
                            <div>
                                <span className="block font-medium">Black Hole System</span>
                                <span className="text-xs text-gray-300">Supermassive black hole with orbiting bodies</span>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7"></path>
                            </svg>
                        </button>

                        {/* Chaos System */}
                        <button
                            onClick={() => onSelect(presets.chaosSystem)}
                            className="flex items-center bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 border border-red-500/30 text-white py-2 px-3 rounded-lg transition-colors text-left group"
                        >
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                    <line x1="12" y1="9" x2="12" y2="13"></line>
                                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                </svg>
                            </div>
                            <div>
                                <span className="block font-medium">Chaos System</span>
                                <span className="text-xs text-gray-300">Unstable system with unpredictable orbits</span>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7"></path>
                            </svg>
                        </button>
                    </div>

                    <div className="flex items-center justify-center p-2 bg-yellow-600/10 border border-yellow-600/20 rounded-lg mt-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <p className="text-xs text-yellow-200">
                            Loading a new system will replace all current bodies
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SystemPresets;