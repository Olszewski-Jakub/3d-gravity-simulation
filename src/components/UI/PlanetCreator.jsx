import React, { useState, useEffect } from 'react';
import { calculateOrbitalVelocity } from '@/lib/physics/gravitationalForce';

const PlanetCreator = ({
                           onAdd,
                           onUpdate,
                           onRemove,
                           selectedBody,
                           celestialBodies
                       }) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTab, setCurrentTab] = useState('basic'); // 'basic' or 'advanced'

    const defaultPlanet = {
        name: '',
        type: 'planet',
        mass: 5.972e24,
        radius: 6371000,
        position: [0, 0, 0],
        velocity: [0, 0, 0],
        color: '#3498db',
        texture: '',
    };

    const [formState, setFormState] = useState(defaultPlanet);

    const planetTypes = [
        { value: 'planet', label: 'Planet', icon: 'planet' },
        { value: 'star', label: 'Star', icon: 'star' },
        { value: 'moon', label: 'Moon', icon: 'moon' },
        { value: 'asteroid', label: 'Asteroid', icon: 'asteroid' },
        { value: 'comet', label: 'Comet', icon: 'comet' },
        { value: 'blackhole', label: 'Black Hole', icon: 'blackhole' },
    ];

    // Color presets
    const colorPresets = [
        { color: '#3498db', name: 'Blue' },
        { color: '#e74c3c', name: 'Red' },
        { color: '#2ecc71', name: 'Green' },
        { color: '#f39c12', name: 'Orange' },
        { color: '#9b59b6', name: 'Purple' },
        { color: '#1abc9c', name: 'Teal' },
        { color: '#7f8c8d', name: 'Gray' },
        { color: '#FFFFFF', name: 'White' },
    ];

    useEffect(() => {
        if (selectedBody) {
            const body = celestialBodies.find(body => body.id === selectedBody);
            if (body) {
                setFormState({
                    ...body,
                    position: [...body.position],
                    velocity: [...body.velocity]
                });
                setIsEditing(true);
                setIsCreating(false);
            }
        } else {
            if (isEditing) {
                setIsEditing(false);
                setFormState(defaultPlanet);
            }
        }
    }, [selectedBody, celestialBodies]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, index] = name.split('.');
            setFormState(prev => {
                const updated = [...prev[parent]];
                updated[index] = parseFloat(value);
                return { ...prev, [parent]: updated };
            });
        } else if (name === 'mass' || name === 'radius') {
            let parsedValue;
            try {
                parsedValue = value.toLowerCase().includes('e')
                    ? parseFloat(value)
                    : parseFloat(value);
            } catch (e) {
                parsedValue = 0;
            }
            setFormState(prev => ({ ...prev, [name]: parsedValue }));
        } else {
            setFormState(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleColorSelect = (color) => {
        setFormState(prev => ({ ...prev, color }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing) {
            onUpdate(selectedBody, formState);
            setIsEditing(false);
        } else {
            onAdd(formState);
            setIsCreating(false);
        }

        setFormState(defaultPlanet);
    };

    const calculateOrbit = () => {
        const centralBody = celestialBodies.reduce((prev, current) =>
            prev.mass > current.mass ? prev : current
        );

        const distanceFromCenter = centralBody.radius * 10;

        const newPosition = [
            centralBody.position[0] + distanceFromCenter,
            centralBody.position[1],
            centralBody.position[2]
        ];

        const orbitSpeed = calculateOrbitalVelocity(
            centralBody.mass,
            distanceFromCenter,
            6.67430e-11 // G constant
        );

        const newVelocity = [
            0,
            orbitSpeed,
            0
        ];

        setFormState(prev => ({
            ...prev,
            position: newPosition,
            velocity: newVelocity
        }));
    };

    const applyTypePreset = (type) => {
        let preset = {};

        switch (type) {
            case 'star':
                preset = {
                    mass: 1.989e30, // Sun-like
                    radius: 696340000,
                    color: '#FFB142'
                };
                break;
            case 'planet':
                preset = {
                    mass: 5.972e24, // Earth-like
                    radius: 6371000,
                    color: '#3498db'
                };
                break;
            case 'moon':
                preset = {
                    mass: 7.342e22, // Moon-like
                    radius: 1737400,
                    color: '#7f8c8d'
                };
                break;
            case 'asteroid':
                preset = {
                    mass: 1e20,
                    radius: 500000,
                    color: '#7f8c8d'
                };
                break;
            case 'comet':
                preset = {
                    mass: 1e13,
                    radius: 10000,
                    color: '#7FB3D5'
                };
                break;
            case 'blackhole':
                preset = {
                    mass: 1e36,
                    radius: 100000000,
                    color: '#8A2BE2'
                };
                break;
            default:
                return;
        }

        setFormState(prev => ({
            ...prev,
            ...preset,
            type
        }));
    };

    const handleTypeChange = (e) => {
        const newType = e.target.value;
        applyTypePreset(newType);
    };

    const getTypeIcon = (type) => {
        switch(type) {
            case 'star':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                );
            case 'planet':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M8 12s.5-4 4-4 4 4 4 4-.5 4-4 4-4-4-4-4z"></path>
                    </svg>
                );
            case 'moon':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                );
            case 'blackhole':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="4"></circle>
                    </svg>
                );
            case 'asteroid':
            case 'comet':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="8"></circle>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                );
            default:
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="8"></circle>
                    </svg>
                );
        }
    };

    const renderForm = isCreating || isEditing;
    const formTitle = isEditing ? 'Edit Celestial Body' : 'Create Celestial Body';

    return (
        <div className="backdrop-blur-md bg-black/30 rounded-xl p-4 shadow-md border border-white/10">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                    Celestial Bodies
                </h3>
            </div>

            {!renderForm && (
                <div className="space-y-3">
                    <button
                        onClick={() => setIsCreating(true)}
                        className="w-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 hover:from-blue-500/40 hover:to-purple-500/40 border border-blue-500/30 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="16"></line>
                            <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg>
                        Create New Body
                    </button>

                    {selectedBody && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 text-blue-300 py-1.5 px-4 rounded-lg transition-colors flex items-center justify-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                                Edit
                            </button>

                            <button
                                onClick={() => onRemove(selectedBody)}
                                className="bg-red-600/20 hover:bg-red-600/30 border border-red-600/30 text-red-300 py-1.5 px-4 rounded-lg transition-colors flex items-center justify-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                                Remove
                            </button>
                        </div>
                    )}
                </div>
            )}

            {renderForm && (
                <div>
                    {/* Tab navigation */}
                    <div className="flex border-b border-white/10 mb-4">
                        <button
                            className={`flex-1 py-2 text-sm font-medium ${currentTab === 'basic' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                            onClick={() => setCurrentTab('basic')}
                        >
                            Basic
                        </button>
                        <button
                            className={`flex-1 py-2 text-sm font-medium ${currentTab === 'advanced' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                            onClick={() => setCurrentTab('advanced')}
                        >
                            Advanced
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {currentTab === 'basic' && (
                            <>
                                {/* Name */}
                                <div>
                                    <label className="block text-sm mb-1">Name:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formState.name}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/20 border border-white/10 px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="e.g. Earth, Mars, etc."
                                        required
                                    />
                                </div>

                                {/* Type */}
                                <div>
                                    <label className="block text-sm mb-1">Type:</label>
                                    <div className="relative">
                                        <select
                                            name="type"
                                            value={formState.type}
                                            onChange={handleTypeChange}
                                            className="w-full bg-black/20 border border-white/10 px-3 py-2 rounded-lg text-white appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            required
                                        >
                                            {planetTypes.map(type => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Mass and Radius in a grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Mass */}
                                    <div>
                                        <label className="block text-sm mb-1">
                                            Mass (kg):
                                        </label>
                                        <input
                                            type="text"
                                            name="mass"
                                            value={formState.mass}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/20 border border-white/10 px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="e.g. 5.972e24"
                                            required
                                        />
                                    </div>

                                    {/* Radius */}
                                    <div>
                                        <label className="block text-sm mb-1">
                                            Radius (m):
                                        </label>
                                        <input
                                            type="text"
                                            name="radius"
                                            value={formState.radius}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/20 border border-white/10 px-3 py-2 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="e.g. 6371000"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Color */}
                                <div>
                                    <label className="block text-sm mb-1">Color:</label>
                                    <div className="flex items-center">
                                        <input
                                            type="color"
                                            name="color"
                                            value={formState.color}
                                            onChange={handleInputChange}
                                            className="w-10 h-10 bg-black/20 border border-white/10 rounded-lg overflow-hidden"
                                        />
                                        <div className="ml-2 flex-1 grid grid-cols-4 gap-1">
                                            {colorPresets.map(preset => (
                                                <button
                                                    key={preset.color}
                                                    type="button"
                                                    onClick={() => handleColorSelect(preset.color)}
                                                    className="w-full h-6 rounded-md border border-white/10 hover:border-white/30 transition-colors"
                                                    style={{ backgroundColor: preset.color }}
                                                    title={preset.name}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Orbit Calculator */}
                                <div>
                                    <button
                                        type="button"
                                        onClick={calculateOrbit}
                                        className="w-full bg-purple-600/20 hover:bg-purple-600/30 border border-purple-600/30 text-purple-300 py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="2"></circle>
                                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                        </svg>
                                        Calculate Stable Orbit
                                    </button>
                                    <p className="text-xs mt-1 text-gray-400">
                                        Places the body in a circular orbit around the most massive object
                                    </p>
                                </div>
                            </>
                        )}

                        {currentTab === 'advanced' && (
                            <>
                                {/* Position */}
                                <div>
                                    <label className="block text-sm mb-1">Position (x, y, z):</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[0, 1, 2].map(index => (
                                            <div key={`pos-${index}`} className="relative">
                                                <input
                                                    type="number"
                                                    name={`position.${index}`}
                                                    value={formState.position[index]}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-black/20 border border-white/10 pl-6 pr-3 py-2 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    step="any"
                                                    required
                                                />
                                                <div className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-400 text-sm">
                                                    {index === 0 ? 'X:' : index === 1 ? 'Y:' : 'Z:'}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Velocity */}
                                <div>
                                    <label className="block text-sm mb-1">Velocity (x, y, z):</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[0, 1, 2].map(index => (
                                            <div key={`vel-${index}`} className="relative">
                                                <input
                                                    type="number"
                                                    name={`velocity.${index}`}
                                                    value={formState.velocity[index]}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-black/20 border border-white/10 pl-6 pr-3 py-2 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    step="any"
                                                    required
                                                />
                                                <div className="absolute inset-y-0 left-0 pl-2 flex items-center text-gray-400 text-sm">
                                                    {index === 0 ? 'X:' : index === 1 ? 'Y:' : 'Z:'}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Texture option (if available) */}
                                <div>
                                    <label className="block text-sm mb-1">Texture:</label>
                                    <div className="relative">
                                        <select
                                            name="texture"
                                            value={formState.texture || ''}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/20 border border-white/10 px-3 py-2 rounded-lg text-white appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                            <option value="">None (use color)</option>
                                            <option value="earth.jpg">Earth</option>
                                            <option value="mars.jpg">Mars</option>
                                            <option value="moon.jpg">Moon</option>
                                            <option value="sun.jpg">Sun</option>
                                            <option value="venus.jpg">Venus</option>
                                            <option value="jupiter.jpg">Jupiter</option>
                                            <option value="mercury.jpg">Mercury</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-xs mt-1 text-gray-400">
                                        Select a texture image or use a solid color
                                    </p>
                                </div>
                            </>
                        )}

                        {/* Form Actions */}
                        <div className="flex space-x-2 pt-2 mt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30 hover:from-blue-500/40 hover:to-purple-500/40 border border-blue-500/30 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                            >
                                {isEditing ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                            <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                            <polyline points="7 3 7 8 15 8"></polyline>
                                        </svg>
                                        Update
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="8" x2="12" y2="16"></line>
                                            <line x1="8" y1="12" x2="16" y2="12"></line>
                                        </svg>
                                        Create
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsCreating(false);
                                    setIsEditing(false);
                                    setFormState(defaultPlanet);
                                }}
                                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PlanetCreator;