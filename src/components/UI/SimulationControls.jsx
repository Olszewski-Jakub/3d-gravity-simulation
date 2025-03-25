import React, { useState } from 'react';

const SimulationControls = ({
                                timeScale,
                                paused,
                                integrationMethod,
                                showOrbitalPaths,
                                enableCollisions,
                                gravitationalConstant,
                                onUpdateTimeScale,
                                onTogglePause,
                                onUpdateIntegrationMethod,
                                onToggleOrbitalPaths,
                                onToggleCollisions,
                                onUpdateGravitationalConstant
                            }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Time scale presets
    const timeScalePresets = [
        { label: '0.1x', value: 0.1 },
        { label: '1x', value: 1 },
        { label: '10x', value: 10 },
        { label: '100x', value: 100 },
        { label: '1000x', value: 1000 },
        { label: '10000x', value: 10000 },
        { label: '100000x', value: 100000 },
        { label: '1000000x', value: 1000000 },
    ];

    // Integration method options
    const integrationMethods = [
        { label: 'Euler', value: 'euler' },
        { label: 'Verlet', value: 'verlet' },
        { label: 'Runge-Kutta 4', value: 'rk4' },
    ];

    return (
        <div className="bg-space-medium bg-opacity-90 text-white rounded-lg p-3 shadow-lg min-w-64 transition-all">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Simulation Controls</h3>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-white hover:text-blue-300 transition-colors"
                >
                    {isExpanded ? '▲' : '▼'}
                </button>
            </div>

            {/* Basic controls always visible */}
            <div className="mt-3 space-y-3">
                {/* Play/Pause Button */}
                <div className="flex justify-center">
                    <button
                        onClick={onTogglePause}
                        className={`px-6 py-2 rounded-full font-medium ${
                            paused
                                ? 'bg-green-600 hover:bg-green-500'
                                : 'bg-red-600 hover:bg-red-500'
                        } transition-colors`}
                    >
                        {paused ? 'Play' : 'Pause'}
                    </button>
                </div>

                {/* Time Scale Controls */}
                <div>
                    <div className="flex justify-between items-center">
                        <label className="font-medium">Time Scale: {timeScale}x</label>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                        {timeScalePresets.map(preset => (
                            <button
                                key={preset.value}
                                onClick={() => onUpdateTimeScale(preset.value)}
                                className={`px-2 py-1 rounded ${
                                    timeScale === preset.value
                                        ? 'bg-blue-600'
                                        : 'bg-gray-700 hover:bg-gray-600'
                                } text-sm`}
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Advanced controls visible when expanded */}
            {isExpanded && (
                <div className="mt-4 pt-3 border-t border-gray-700 space-y-4">
                    {/* Integration Method */}
                    <div>
                        <label className="font-medium block mb-1">Integration Method:</label>
                        <div className="flex flex-wrap gap-1">
                            {integrationMethods.map(method => (
                                <button
                                    key={method.value}
                                    onClick={() => onUpdateIntegrationMethod(method.value)}
                                    className={`px-3 py-1 rounded ${
                                        integrationMethod === method.value
                                            ? 'bg-blue-600'
                                            : 'bg-gray-700 hover:bg-gray-600'
                                    } text-sm`}
                                >
                                    {method.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Toggle Switches */}
                    <div className="space-y-2">
                        {/* Orbital Paths Toggle */}
                        <div className="flex items-center justify-between">
                            <span>Show Orbital Paths:</span>
                            <button
                                onClick={onToggleOrbitalPaths}
                                className={`w-12 h-6 rounded-full relative ${
                                    showOrbitalPaths ? 'bg-blue-600' : 'bg-gray-600'
                                } transition-colors`}
                            >
                <span
                    className={`absolute w-5 h-5 rounded-full bg-white transition-transform 
                  ${showOrbitalPaths ? 'transform translate-x-6' : 'translate-x-1'}`}
                    style={{ top: '2px' }}
                />
                            </button>
                        </div>

                        {/* Collisions Toggle */}
                        <div className="flex items-center justify-between">
                            <span>Enable Collisions:</span>
                            <button
                                onClick={onToggleCollisions}
                                className={`w-12 h-6 rounded-full relative ${
                                    enableCollisions ? 'bg-blue-600' : 'bg-gray-600'
                                } transition-colors`}
                            >
                <span
                    className={`absolute w-5 h-5 rounded-full bg-white transition-transform 
                  ${enableCollisions ? 'transform translate-x-6' : 'translate-x-1'}`}
                    style={{ top: '2px' }}
                />
                            </button>
                        </div>
                    </div>

                    {/* Gravitational Constant */}
                    <div>
                        <label className="font-medium block mb-1">
                            Gravitational Constant (G):
                        </label>
                        <div className="flex items-center">
                            <input
                                type="range"
                                min={-13}
                                max={-9}
                                step={0.1}
                                value={Math.log10(gravitationalConstant)}
                                onChange={(e) => onUpdateGravitationalConstant(Math.pow(10, parseFloat(e.target.value)))}
                                className="w-full"
                            />
                        </div>
                        <div className="text-sm text-gray-300 mt-1">
                            G = {gravitationalConstant.toExponential(5)} m³/kg·s²
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SimulationControls;