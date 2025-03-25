'use client';

import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import Scene from './Scene';
import CustomOrbitControls from './CustomOrbitControls';
import FallbackRenderer from './FallbackRenderer';
import { SimulationProvider } from './SimulationContext';

/**
 * Client-only wrapper for Three.js components
 * This prevents server-side rendering issues with Three.js
 */
const ClientWrapper = ({
                           bodies,
                           orbitalPaths,
                           showOrbitalPaths,
                           onSelectBody,
                           selectedBodyId
                       }) => {
    const [canUseWebGL, setCanUseWebGL] = useState(true);

    // Check if WebGL is available
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                setCanUseWebGL(!!gl);
            } catch (e) {
                console.error("WebGL detection error:", e);
                setCanUseWebGL(false);
            }
        }
    }, []);

    // Find Sun position for initial camera focus
    const sunPosition = React.useMemo(() => {
        const sun = bodies.find(body => body.type === 'star' && body.name === 'Sun');
        if (sun) {
            // Apply scaling factor to make the scene more visible
            const SCALE_FACTOR = 1e-9;
            return sun.position.map(pos => pos * SCALE_FACTOR);
        }
        return [0, 0, 0]; // Default if Sun not found
    }, [bodies]);

    // Use fallback renderer if WebGL is not available
    if (!canUseWebGL) {
        return <FallbackRenderer bodies={bodies} />;
    }

    // Use React Three Fiber if WebGL is available
    return (
        <SimulationProvider
            bodies={bodies}
            orbitalPaths={orbitalPaths}
            showOrbitalPaths={showOrbitalPaths}
            onSelectBody={onSelectBody}
            selectedBodyId={selectedBodyId}
        >
            <Canvas
                camera={{
                    position: [sunPosition[0]+300, sunPosition[1] + 100, sunPosition[2] + 100],
                    fov: 60,
                    near: 0.1,
                    far: 1000000000000000000000000
                }}
                gl={{ antialias: true }}
                dpr={[1, 2]} // Responsive to device pixel ratio
            >
                <Scene />
                <CustomOrbitControls initialTarget={sunPosition} />

                {/* Enhanced lighting */}
                <ambientLight intensity={0.8} />
                <hemisphereLight intensity={0.8} color="#ffffff" groundColor="#000000" />
                <pointLight position={sunPosition} intensity={5} distance={1000} />

                {/* Additional stars background */}
                <Stars radius={300} depth={60} count={5000} factor={7} saturation={0} fade />
            </Canvas>
        </SimulationProvider>
    );
};

export default ClientWrapper;