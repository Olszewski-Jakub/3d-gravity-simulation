/**
 * A utility to handle physics and rendering errors in the gravity simulation
 */

// Create a cache to avoid flooding with the same error multiple times
const errorCache = {
    lastErrors: {},
    cooldowns: {},
    messageCount: 0
};

/**
 * Check if an error message is already being handled/cooldown
 * @param {string} errorType - Type of error (integrator, material, etc)
 * @param {string} errorMessage - The error message
 * @returns {boolean} - True if the error should be suppressed
 */
const isErrorDuplicate = (errorType, errorMessage) => {
    const cacheKey = `${errorType}:${errorMessage.substring(0, 100)}`;
    const now = Date.now();

    // Check if we have too many errors in a short period
    if (errorCache.messageCount > 5) {
        const oldestError = Math.min(...Object.values(errorCache.cooldowns));
        if (now - oldestError < 10000) {
            // Too many errors, suppress all for a while
            return true;
        }
        // Reset counter after cooldown period
        errorCache.messageCount = 0;
    }

    if (errorCache.cooldowns[cacheKey] && now - errorCache.cooldowns[cacheKey] < 5000) {
        // Error is in cooldown period
        return true;
    }

    // Update cache
    errorCache.lastErrors[cacheKey] = errorMessage;
    errorCache.cooldowns[cacheKey] = now;
    errorCache.messageCount++;

    return false;
};

/**
 * Handle an integrator error
 * @param {Error} error - The error object
 * @param {string} integratorName - Name of the integrator that failed
 * @returns {Object|null} - Error description or null if suppressed
 */
export const handleIntegratorError = (error, integratorName) => {
    const errorMessage = error.message || String(error);

    if (isErrorDuplicate('integrator', errorMessage)) {
        return null;
    }

    console.error(`[Physics] Error in ${integratorName} integrator:`, error);

    return {
        type: 'integrator',
        message: `The physics engine encountered an error with the ${integratorName} integrator.`,
        details: errorMessage,
        timestamp: Date.now(),
        integratorName
    };
};

/**
 * Handle a Three.js material error
 * @param {Error} error - The error object
 * @returns {Object|null} - Error description or null if suppressed
 */
export const handleMaterialError = (error) => {
    const errorMessage = error.message || String(error);

    // Filter out errors that match the specific three.js pattern
    if (errorMessage.includes('Cannot read properties of undefined (reading \'value\')') &&
        errorMessage.includes('refreshUniformsCommon')) {

        if (isErrorDuplicate('material', 'refreshUniformsCommon')) {
            return null;
        }

        console.error('[Renderer] Material uniform error:', errorMessage);

        return {
            type: 'material',
            message: 'A rendering error occurred with object materials. This may be caused by physics calculation issues.',
            details: 'Error in Three.js refreshUniformsCommon. Try switching to a more stable integrator.',
            timestamp: Date.now()
        };
    }

    return null;
};

/**
 * Handle collision detection errors
 * @param {Error} error - The error object
 * @returns {Object|null} - Error description or null if suppressed
 */
export const handleCollisionError = (error) => {
    const errorMessage = error.message || String(error);

    if (isErrorDuplicate('collision', errorMessage)) {
        return null;
    }

    console.error('[Physics] Collision calculation error:', error);

    return {
        type: 'collision',
        message: 'An error occurred in collision detection calculations.',
        details: errorMessage,
        timestamp: Date.now()
    };
};

/**
 * Install global error handlers to catch physics and rendering errors
 * @param {Function} onError - Callback function when an error is detected
 * @returns {Function} - Function to remove the error handlers
 */
export const installGlobalErrorHandlers = (onError) => {
    if (typeof window === 'undefined') return () => {};

    // Store original error handlers
    const originalWindowError = window.onerror;
    const originalConsoleError = console.error;

    // Override window.onerror
    window.onerror = (message, source, lineno, colno, error) => {
        // Call original handler
        if (originalWindowError) {
            originalWindowError(message, source, lineno, colno, error);
        }

        // Check if this is a material error
        const errorInfo = handleMaterialError(error || new Error(message));
        if (errorInfo && onError) {
            onError(errorInfo);
        }

        return false; // Let the error propagate
    };

    // Override console.error to detect specific error patterns
    console.error = (...args) => {
        // Call original console.error
        originalConsoleError.apply(console, args);

        const errorString = args.join(' ');

        // Check for specific error messages
        if (errorString.includes('refreshUniformsCommon') ||
            errorString.includes('Cannot read properties of undefined')) {

            const errorInfo = handleMaterialError(new Error(errorString));
            if (errorInfo && onError) {
                onError(errorInfo);
            }
        }
    };

    // Return cleanup function
    return () => {
        window.onerror = originalWindowError;
        console.error = originalConsoleError;
    };
};

/**
 * Safe wrapper for physics integration
 * @param {Function} integratorFn - The integration function
 * @param {Array} bodies - Celestial bodies array
 * @param {Number} dt - Time step
 * @param {Number} G - Gravitational constant
 * @param {string} integratorName - Name of the integrator
 * @param {Function} onError - Error callback
 * @returns {Array} - Updated bodies array
 */
export const safeIntegrate = (integratorFn, bodies, dt, G, integratorName, onError) => {
    try {
        return integratorFn(bodies, dt, G);
    } catch (error) {
        const errorInfo = handleIntegratorError(error, integratorName);
        if (errorInfo && onError) {
            onError(errorInfo);
        }

        // Try to recover from the error using verlet integrator
        if (integratorName !== 'verlet') {
            try {
                console.warn('[Physics] Falling back to verlet integrator with reduced step');
                return integratorFn === verletIntegrator ?
                    [...bodies] : // Can't even use verlet, return original bodies
                    verletIntegrator(bodies, dt * 0.1, G); // Smaller step
            } catch (fallbackError) {
                console.error('[Physics] Critical error, returning original bodies:', fallbackError);
            }
        }

        // Last resort: return unchanged bodies
        return [...bodies];
    }
};