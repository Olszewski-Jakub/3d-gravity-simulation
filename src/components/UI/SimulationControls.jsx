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
    const [showIntegratorInfo, setShowIntegratorInfo] = useState(false);

    // Time scale presets
    const timeScalePresets = [
        { label: '1x', value: 1 },
        { label: '10x', value: 10 },
        { label: '100x', value: 100 },
        { label: '1000x', value: 1000 },
        { label: '10000x', value: 10000 },
        { label: '100000x', value: 100000 },
    ];

    // Integration method options with additional information
    const integrationMethods = [
        {
            label: 'Euler',
            value: 'euler',
            description: 'Simple first-order method. Fast but less accurate for long-term simulations.',
            recommended: false
        },
        {
            label: 'Verlet',
            value: 'verlet',
            description: 'Second-order method with better energy conservation. Good balance of speed and accuracy.',
            recommended: true
        },
        {
            label: 'RK4',
            value: 'rk4',
            description: 'Fourth-order method with high accuracy. More computationally expensive.',
            recommended: false
        },
    ];

    // Handle integration method change with confirmation if switching from a more accurate method
    const handleIntegrationMethodChange = (method) => {
        // If switching from a more accurate method to a less accurate one, show confirmation
        const currentMethodIndex = integrationMethods.findIndex(m => m.value === integrationMethod);
        const newMethodIndex = integrationMethods.findIndex(m => m.value === method);

        if (newMethodIndex < currentMethodIndex) {
            if (window.confirm(`Switching to ${integrationMethods[newMethodIndex].label} might be less accurate. Continue?`)) {
                onUpdateIntegrationMethod(method);
            }
        } else {
            onUpdateIntegrationMethod(method);
        }
    };

    return (
        <div className="backdrop-blur-md bg-black/30 text-white rounded-xl p-4 shadow-lg overflow-hidden border border-white/10">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    Controls
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

            {/* Basic controls always visible */}
            <div className="mt-4 space-y-4">
                {/* Play/Pause Button */}
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Simulation</span>
                    <button
                        onClick={onTogglePause}
                        className={`flex items-center justify-center w-24 py-1.5 rounded-full font-medium transition-colors ${
                            paused
                                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30'
                                : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                        }`}
                    >
                        {paused ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                                Play
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="6" y="4" width="4" height="16"></rect>
                                    <rect x="14" y="4" width="4" height="16"></rect>
                                </svg>
                                Pause
                            </>
                        )}
                    </button>
                </div>

                {/* Time Scale Controls */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium">Time Scale</label>
                        <span className="text-blue-400 text-sm font-mono">{timeScale}x</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                        {timeScalePresets.map(preset => (
                            <button
                                key={preset.value}
                                onClick={() => onUpdateTimeScale(preset.value)}
                                className={`px-2 py-1.5 rounded text-sm transition-colors ${
                                    timeScale === preset.value
                                        ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                                        : 'bg-white/5 hover:bg-white/10 border border-white/10'
                                }`}
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Advanced controls visible when expanded */}
            {isExpanded && (
                <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                    {/* Integration Method */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium">Integration Method</label>
                            <button
                                onClick={() => setShowIntegratorInfo(!showIntegratorInfo)}
                                className="text-xs text-blue-400 hover:text-blue-300 flex items-center"
                            >
                                {showIntegratorInfo ? 'Hide Info' : 'Show Info'}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="16" x2="12" y2="12"></line>
                                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                            </button>
                        </div>

                        <div className="flex space-x-2">
                            {integrationMethods.map(method => (
                                <button
                                    key={method.value}
                                    onClick={() => handleIntegrationMethodChange(method.value)}
                                    className={`flex-1 px-2 py-1.5 rounded text-sm transition-colors ${
                                        integrationMethod === method.value
                                            ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                                            : 'bg-white/5 hover:bg-white/10 border border-white/10'
                                    } ${method.recommended ? 'ring-1 ring-green-400/50' : ''}`}
                                    title={method.recommended ? 'Recommended' : ''}
                                >
                                    {method.label}
                                    {method.recommended && <span className="text-xs text-green-400 ml-1">✓</span>}
                                </button>
                            ))}
                        </div>

                        {showIntegratorInfo && (
                            <div className="mt-2 p-3 bg-blue-900/20 border border-blue-500/20 rounded-md text-xs text-blue-100">
                                {integrationMethods.find(m => m.value === integrationMethod)?.description}

                                {integrationMethod === 'euler' && (
                                    <div className="mt-1 text-yellow-300">
                                        Note: Euler method may cause instability with certain configurations.
                                        If you encounter errors, try switching to Verlet.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Toggle Switches */}
                    <div className="space-y-3">
                        {/* Orbital Paths Toggle */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Orbital Paths</span>
                            <button
                                onClick={onToggleOrbitalPaths}
                                className={`w-12 h-6 rounded-full relative transition-colors ${
                                    showOrbitalPaths ? 'bg-blue-500/50' : 'bg-white/10'
                                }`}
                                aria-checked={showOrbitalPaths}
                                role="switch"
                            >
                                <span
                                    className={`absolute w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
                                        showOrbitalPaths ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                    style={{ top: '2px' }}
                                />
                            </button>
                        </div>

                        {/* Collisions Toggle */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Enable Collisions</span>
                            <button
                                onClick={onToggleCollisions}
                                className={`w-12 h-6 rounded-full relative transition-colors ${
                                    enableCollisions ? 'bg-blue-500/50' : 'bg-white/10'
                                }`}
                                aria-checked={enableCollisions}
                                role="switch"
                            >
                                <span
                                    className={`absolute w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
                                        enableCollisions ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                    style={{ top: '2px' }}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Gravitational Constant */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-medium">Gravitational Constant (G)</label>
                            <span className="text-blue-400 text-xs font-mono">{gravitationalConstant.toExponential(2)}</span>
                        </div>
                        <input
                            type="range"
                            min={-13}
                            max={-9}
                            step={0.1}
                            value={Math.log10(gravitationalConstant)}
                            onChange={(e) => onUpdateGravitationalConstant(Math.pow(10, parseFloat(e.target.value)))}
                            className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-400"
                        />
                        <div className="flex justify-between mt-1 text-xs text-gray-400">
                            <span>Weaker</span>
                            <span>Standard: 6.67×10⁻¹¹</span>
                            <span>Stronger</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SimulationControls;