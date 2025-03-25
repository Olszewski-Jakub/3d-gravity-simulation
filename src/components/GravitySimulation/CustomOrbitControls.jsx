'use client';

import React, { useRef, useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimulation } from './SimulationContext';

// Scale factor to make the scene more visible (same as in Scene.jsx)
const SCALE_FACTOR = 1e-9;

/**
 * Custom OrbitControls that can focus on selected celestial bodies
 */
const CustomOrbitControls = (props) => {
    const controlsRef = useRef();
    const { selectedBodyId, bodies } = useSimulation();

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