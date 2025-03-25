import React from 'react';

/**
 * A fallback component to display when physics errors occur
 */
const PhysicsErrorFallback = ({ error, resetErrorBoundary }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-space-dark text-white p-6">
            <div className="max-w-lg w-full bg-space-medium p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold text-red-400 mb-4">
                    Physics Simulation Error
                </h2>

                <p className="mb-4">
                    An error occurred while calculating the physics simulation. This usually happens when the
                    numerical methods become unstable due to extreme conditions in the simulation.
                </p>

                <div className="bg-black bg-opacity-50 p-4 rounded overflow-auto max-h-40 w-full mb-4">
                    <code className="text-red-300 text-sm break-all">
                        {error?.toString() || "Unknown physics calculation error"}
                    </code>
                </div>

                <div className="space-y-2">
                    <p className="text-sm mb-2">Suggested fixes:</p>
                    <ul className="list-disc list-inside text-sm text-gray-300">
                        <li>Try using the Verlet integration method instead of Euler</li>
                        <li>Decrease the time scale to a smaller value</li>
                        <li>Reduce the gravitational constant</li>
                        <li>Try a different planetary system preset</li>
                    </ul>
                </div>

                <div className="mt-6 flex space-x-4">
                    <button
                        onClick={resetErrorBoundary}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded transition-colors"
                    >
                        Try Again
                    </button>

                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
                    >
                        Reload Page
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PhysicsErrorFallback;