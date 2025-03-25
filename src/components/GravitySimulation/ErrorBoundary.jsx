import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to console for debugging
        console.error('WebGL/React Three Fiber Error:', error);
        console.error('Component Stack:', errorInfo.componentStack);

        this.setState({
            errorInfo
        });

        // Basic diagnostics
        const diagnostics = {
            userAgent: navigator.userAgent,
            renderer: null,
            vendor: null,
            webglSupport: false
        };

        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

            if (gl) {
                diagnostics.webglSupport = true;
                diagnostics.renderer = gl.getParameter(gl.RENDERER);
                diagnostics.vendor = gl.getParameter(gl.VENDOR);
            }
        } catch (e) {
            console.error('Error checking WebGL support:', e);
        }

        console.log('System Diagnostics:', diagnostics);
    }

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            return (
                <div className="w-full h-full flex flex-col items-center justify-center bg-space-dark text-white p-6">
                    <h2 className="text-xl font-bold text-red-400 mb-4">
                        3D Rendering Error
                    </h2>

                    <p className="mb-4 text-center max-w-lg">
                        We encountered an error rendering the 3D gravity simulation. This could be due to
                        WebGL compatibility issues or browser limitations.
                    </p>

                    <div className="bg-black bg-opacity-50 p-4 rounded overflow-auto max-h-60 w-full max-w-lg mb-4">
                        <code className="text-red-300 text-sm">
                            {this.state.error?.toString()}
                        </code>
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded transition-colors"
                    >
                        Reload Page
                    </button>

                    <div className="mt-4 text-sm text-gray-400">
                        Try using a different browser or check if hardware acceleration is enabled.
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;