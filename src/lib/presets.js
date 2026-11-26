import { GRAVITATIONAL_CONSTANT } from './physics/constants.js';

const systems = {
    solarSystem: [
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
            color: '#A5A5A5', // Mercury's grayish color
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
            color: '#E6C35A', // Venus's yellowish color
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
            velocity: [0, 24.077e3, 0], // 24.077 km/s orbital velocity
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
            position: [778.6e9, 0, 0], // 778.6 million km from sun
            velocity: [0, 13.07e3, 0], // 13.07 km/s orbital velocity
            color: '#E39E5B', // Jupiter's orangish color
            texture: 'jupiter.jpg',
        },
        // Saturn
        {
            id: 'saturn',
            name: 'Saturn',
            type: 'planet',
            mass: 5.683e26, // kg
            radius: 58232000, // meters
            position: [1433.5e9, 0, 0], // 1.4335 billion km from sun
            velocity: [0, 9.69e3, 0], // 9.69 km/s orbital velocity
            color: '#F4D4A9', // Saturn's pale yellow color
            texture: 'saturn.jpg',
        },
        // Uranus
        {
            id: 'uranus',
            name: 'Uranus',
            type: 'planet',
            mass: 8.681e25, // kg
            radius: 25362000, // meters
            position: [2872.5e9, 0, 0], // 2.8725 billion km from sun
            velocity: [0, 6.81e3, 0], // 6.81 km/s orbital velocity
            color: '#A4D2E0', // Uranus's pale blue color
            texture: 'uranus.jpg',
        },
        // Neptune
        {
            id: 'neptune',
            name: 'Neptune',
            type: 'planet',
            mass: 1.024e26, // kg
            radius: 24622000, // meters
            position: [4495.1e9, 0, 0], // 4.4951 billion km from sun
            velocity: [0, 5.43e3, 0], // 5.43 km/s orbital velocity
            color: '#4B70DD', // Neptune's blue color
            texture: 'neptune.jpg',
        }
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
const phases = [0, 0.64, 2.5, 3.67, 5.32, 2.94, 0.47, 4.14, 5.75];

export const presets = [
    { id: 'solarSystem', name: 'Solar System', description: 'The Sun and its eight planets', icon: 'sun', color: '#f5bb70' },
    { id: 'earthMoonSystem', name: 'Earth & Moon', description: 'A planet and its satellite', icon: 'moon', color: '#8abaff' },
    { id: 'binaryStarSystem', name: 'Binary Stars', description: 'Two stars in a shared orbit', icon: 'binary', color: '#d4a6ff' },
    { id: 'blackHoleSystem', name: 'Black Hole', description: 'Orbits around a massive object', icon: 'hole', color: '#ee9b9d' },
    { id: 'chaosSystem', name: 'Chaotic System', description: 'A close encounter of many bodies', icon: 'chaos', color: '#8ad7bf' }
];

export function setupPreset(id) {
    const bodies = systems[id];
    const binarySeparation = 3e10;
    const binaryMass = bodies[0].mass + (bodies[1]?.mass ?? 0);
    return bodies.map((body, index) => {
        if (id === 'binaryStarSystem' && index < 2) {
            const x = (index === 0 ? -1 : 1) * binarySeparation * bodies[1 - index].mass / binaryMass;
            const angularSpeed = Math.sqrt(GRAVITATIONAL_CONSTANT * binaryMass / binarySeparation ** 3);
            return { ...body, position: [x, 0, 0], velocity: [0, x * angularSpeed, 0] };
        }
        if (id === 'blackHoleSystem' && index > 0) {
            return { ...body, velocity: [0, Math.sqrt(GRAVITATIONAL_CONSTANT * bodies[0].mass / body.position[0]), 0] };
        }
        if (id !== 'solarSystem') return structuredClone(body);
        const phase = phases[index];
        const distance = body.position[0];
        const speed = body.velocity[1];
        return {
            ...body,
            position: [distance * Math.cos(phase), distance * Math.sin(phase), 0],
            velocity: [-speed * Math.sin(phase), speed * Math.cos(phase), 0]
        };
    });
}
