import React, { useEffect, useState } from 'react';

/**
 * A component to monitor integrator errors and display them in a user-friendly way
 */
const IntegratorErrorHandler = () => {
    const [error, setError] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    // Monitor console errors related to the integrators
    useEffect(() => {
        // Store original console.error
        const originalConsoleError = console.error;

        // Override console.error to detect integrator errors
        console.error = (...args) => {
            // Call the original console.error first
            originalConsoleError.apply(console, args);

            // Check if the error is related to physics calculations
            const errorString = args.join(' ');
            if (
                errorString.includes('Physics calculation error') ||
                errorString.includes('Error in RK4 integrator') ||
                errorString.includes('Cannot read properties of undefined')
            ) {
                setError({
                    message: errorString,
                    timestamp: new Date().toISOString()
                });
                setIsVisible(true);
            }
        };

        // Restore original console.error on cleanup
        return () => {
            console.error = originalConsoleError;
        };
    }, []);

    // Auto-hide after 10 seconds
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [isVisible]);

    // Close the error panel
    const handleClose = () => {
        setIsVisible(false);
    };

    if (!error || !isVisible) return null;

    return (
        <div className="fixed top-16 right-4 bg-red-800 bg-opacity-90 text-white p-3 rounded-lg shadow-lg max-w-md z-50">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-sm">Physics Calculation Error</h3>
                <button
                    onClick={handleClose}
                    className="text-white text-xs bg-red-600 hover:bg-red-500 px-2 py-1 rounded"
                >
                    Close
                </button>
            </div>

            <div className="text-xs max-h-32 overflow-auto bg-red-900 bg-opacity-50 p-2 rounded">
                <pre>{error.message}</pre>
            </div>

            <div className="mt-2 text-xs flex justify-between">
                <span>Time: {new Date(error.timestamp).toLocaleTimeString()}</span>
                <span>
          <button
              onClick={() => {
                  if (window.confirm('Try switching to Verlet integrator?')) {
                      // This is just a suggestion - you'd need to implement the actual switching logic
                      alert('Please select Verlet integration method from the controls panel');
                  }
              }}
              className="text-yellow-300 hover:text-yellow-100"
          >
            Try Verlet Integrator
          </button>
        </span>
            </div>
        </div>
    );
};

export default IntegratorErrorHandler;