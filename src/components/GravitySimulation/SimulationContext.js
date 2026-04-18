'use client';

import React, { createContext, useContext } from 'react';

// Create a context for sharing simulation data
const SimulationContext = createContext(null);

// Context Provider component
export const SimulationProvider = ({
                                       bodies,
                                       orbitalPaths,
                                       showOrbitalPaths,
                                       onSelectBody,
                                       selectedBodyId,
                                       focusLock,
                                       children
                                   }) => {
    const contextValue = {
        bodies,
        orbitalPaths,
        showOrbitalPaths,
        onSelectBody,
        selectedBodyId,
        focusLock,
    };

    return (
        <SimulationContext.Provider value={contextValue}>
            {children}
        </SimulationContext.Provider>
    );
};

// Hook to use the simulation context
export const useSimulation = () => {
    const context = useContext(SimulationContext);

    if (context === null) {
        throw new Error('useSimulation must be used within a SimulationProvider');
    }

    return context;
};