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
        { value: 'planet', label: 'Planet' },
        { value: 'star', label: 'Star' },
        { value: 'moon', label: 'Moon' },
        { value: 'asteroid', label: 'Asteroid' },
        { value: 'comet', label: 'Comet' },
        { value: 'blackhole', label: 'Black Hole' },
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
                    color: '#000000'
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

    const renderForm = isCreating || isEditing;
    const formTitle = isEditing ? 'Edit Celestial Body' : 'Create Celestial Body';

    return (
        <div className="bg-space-medium rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold mb-2">Celestial Bodies</h3>

            {!renderForm && (
                <div className="space-y-3">
                    <button
                        onClick={() => setIsCreating(true)}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded transition-colors"
                    >
                        Create New Body
                    </button>

                    {selectedBody && (
                        <div className="space-y-2">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="w-full bg-green-600 hover:bg-green-500 text-white py-1.5 px-4 rounded transition-colors"
                            >
                                Edit Selected Body
                            </button>

                            <button
                                onClick={() => onRemove(selectedBody)}
                                className="w-full bg-red-600 hover:bg-red-500 text-white py-1.5 px-4 rounded transition-colors"
                            >
                                Remove Selected Body
                            </button>
                        </div>
                    )}
                </div>
            )}

            {renderForm && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h4 className="font-medium">{formTitle}</h4>

                    {/* Name */}
                    <div>
                        <label className="block text-sm mb-1">Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formState.name}
                            onChange={handleInputChange}
                            className="w-full bg-space-dark px-3 py-2 rounded text-white"
                            placeholder="e.g. Earth, Mars, etc."
                            required
                        />
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-sm mb-1">Type:</label>
                        <select
                            name="type"
                            value={formState.type}
                            onChange={handleTypeChange}
                            className="w-full bg-space-dark px-3 py-2 rounded text-white"
                            required
                        >
                            {planetTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

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
                            className="w-full bg-space-dark px-3 py-2 rounded text-white"
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
                            className="w-full bg-space-dark px-3 py-2 rounded text-white"
                            placeholder="e.g. 6371000"
                            required
                        />
                    </div>

                    {/* Position */}
                    <div>
                        <label className="block text-sm mb-1">Position (x, y, z):</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[0, 1, 2].map(index => (
                                <input
                                    key={`pos-${index}`}
                                    type="number"
                                    name={`position.${index}`}
                                    value={formState.position[index]}
                                    onChange={handleInputChange}
                                    className="w-full bg-space-dark px-3 py-2 rounded text-white"
                                    step="any"
                                    required
                                />
                            ))}
                        </div>
                    </div>

                    {/* Velocity */}
                    <div>
                        <label className="block text-sm mb-1">Velocity (x, y, z):</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[0, 1, 2].map(index => (
                                <input
                                    key={`vel-${index}`}
                                    type="number"
                                    name={`velocity.${index}`}
                                    value={formState.velocity[index]}
                                    onChange={handleInputChange}
                                    className="w-full bg-space-dark px-3 py-2 rounded text-white"
                                    step="any"
                                    required
                                />
                            ))}
                        </div>
                    </div>

                    {/* Orbit Calculator */}
                    <div>
                        <button
                            type="button"
                            onClick={calculateOrbit}
                            className="w-full bg-purple-600 hover:bg-purple-500 text-white py-1.5 px-4 rounded transition-colors"
                        >
                            Calculate Stable Orbit
                        </button>
                        <p className="text-xs mt-1 text-gray-300">
                            Places the body in a circular orbit around the most massive object
                        </p>
                    </div>

                    {/* Color */}
                    <div>
                        <label className="block text-sm mb-1">Color:</label>
                        <input
                            type="color"
                            name="color"
                            value={formState.color}
                            onChange={handleInputChange}
                            className="w-full h-8 bg-space-dark rounded overflow-hidden"
                        />

                        <div className="grid grid-cols-4 gap-1 mt-2">
                            {colorPresets.map(preset => (
                                <button
                                    key={preset.color}
                                    type="button"
                                    onClick={() => handleColorSelect(preset.color)}
                                    className="w-full h-6 rounded border border-gray-600 hover:border-white transition-colors"
                                    style={{ backgroundColor: preset.color }}
                                    title={preset.name}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex space-x-2 pt-2">
                        <button
                            type="submit"
                            className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded transition-colors"
                        >
                            {isEditing ? 'Update' : 'Create'}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setIsCreating(false);
                                setIsEditing(false);
                                setFormState(defaultPlanet);
                            }}
                            className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default PlanetCreator;