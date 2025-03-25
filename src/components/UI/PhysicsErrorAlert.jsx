import React, { useState, useEffect } from 'react';

/**
 * A user-friendly alert component for physics engine errors
 * that offers solutions and information about the error
 */
const PhysicsErrorAlert = ({ error, onDismiss, onSwitchIntegrator }) => {
    const [countdown, setCountdown] = useState(10);

    // Auto-dismiss after countdown
    useEffect(() => {
        if (!error) return;

        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onDismiss();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [error, onDismiss]);

    // Reset countdown when error changes
    useEffect(() => {
        setCountdown(10);
    }, [error]);

    if (!error) return null;

    const { type, message, details } = error;

    const getErrorTitle = () => {
        switch (type) {
            case 'integrator':
                return 'Physics Integrator Error';
            case 'material':
                return 'Rendering Material Error';
            case 'collision':
                return 'Collision Detection Error';
            default:
                return 'Physics Engine Error';
        }
    };

    const getSuggestion = () => {
        switch (type) {
            case 'integrator':
                return 'Try switching to the Verlet integrator which is more stable.';
            case 'material':
                return 'The renderer encountered an error. Try adjusting time scale or camera position.';
            case 'collision':
                return 'Disable collisions temporarily or reduce the time scale.';
            default:
                return 'Try reducing the time scale or reloading the simulation.';
        }
    };

    return (
        <div className="fixed bottom-24 right-4 max-w-md bg-red-900 bg-opacity-90 text-white rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-300 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <h3 className="font-bold text-sm">{getErrorTitle()}</h3>
                    </div>
                    <button
                        onClick={onDismiss}
                        className="text-red-300 hover:text-white"
                        aria-label="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                <div className="mt-2 text-sm">
                    <p>{message}</p>
                    <p className="mt-2 text-red-300 text-xs">{getSuggestion()}</p>
                </div>

                <div className="mt-3 flex justify-between items-center">
                    {type === 'integrator' && (
                        <button
                            onClick={onSwitchIntegrator}
                            className="text-xs bg-red-700 hover:bg-red-600 px-3 py-1 rounded-md"
                        >
                            Switch to Verlet
                        </button>
                    )}

                    {type !== 'integrator' && (
                        <button
                            onClick={onDismiss}
                            className="text-xs bg-red-700 hover:bg-red-600 px-3 py-1 rounded-md"
                        >
                            Dismiss
                        </button>
                    )}

                    <span className="text-xs text-red-300">Closing in {countdown}s</span>
                </div>
            </div>

            {/* Progress bar for auto-dismiss */}
            <div
                className="h-1 bg-red-600 transition-all duration-1000"
                style={{ width: `${(countdown / 10) * 100}%` }}
            ></div>
        </div>
    );
};

export default PhysicsErrorAlert;