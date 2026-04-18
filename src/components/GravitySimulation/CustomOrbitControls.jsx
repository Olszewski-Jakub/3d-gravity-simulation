'use client';

import React, { useRef, useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useSimulation } from './SimulationContext';

// Scale factor to make the scene more visible (same as in Scene.jsx)
const SCALE_FACTOR = 1e-9;

/**
 * Custom OrbitControls that can focus on selected celestial bodies
 */
const CustomOrbitControls = ({ initialTarget = [0, 0, 0], ...props }) => {
    const controlsRef = useRef();
    const { selectedBodyId, bodies, focusLock } = useSimulation();

    // Initialize control target on mount
    useEffect(() => {
        if (controlsRef.current) {
            // Set initial target position
            controlsRef.current.target.set(initialTarget[0], initialTarget[1], initialTarget[2]);
            controlsRef.current.update();
        }
    }, [initialTarget]);

    // Handle body selection changes
    useEffect(() => {
        if (selectedBodyId && controlsRef.current) {
            const selectedBody = bodies.find(body => body.id === selectedBodyId);

            if (selectedBody) {
                // Get scaled position
                const [x, y, z] = selectedBody.position.map(pos => pos * SCALE_FACTOR);

                // Update orbit controls target
                controlsRef.current.target.set(x, y, z);
                controlsRef.current.update();
            }
        }
    }, [selectedBodyId, bodies]);

    // Continuously track selected body when focus lock is enabled
    useFrame(() => {
        if (focusLock && selectedBodyId && controlsRef.current) {
            const selectedBody = bodies.find(body => body.id === selectedBodyId);
            if (selectedBody) {
                const [x, y, z] = selectedBody.position.map(pos => pos * SCALE_FACTOR);
                controlsRef.current.target.set(x, y, z);
                controlsRef.current.update();
            }
        }
    });

    return (
        <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            zoomSpeed={0.6}
            panSpeed={0.5}
            rotateSpeed={0.5}
            makeDefault
            {...props}
        />
    );
};

export default CustomOrbitControls;