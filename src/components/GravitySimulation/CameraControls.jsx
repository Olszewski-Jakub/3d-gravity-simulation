'use client';

import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimulation } from './SimulationContext';

// Scale factor to make the scene more visible (same as in Scene.jsx)
const SCALE_FACTOR = 1e-9;

/**
 * Custom camera controls for focusing on selected celestial bodies
 */
const CameraControls = () => {
    const { camera, scene } = useThree();
    const { bodies, selectedBodyId } = useSimulation();

    // Reference for lerping
    const targetRef = useRef(new THREE.Vector3(0, 0, 0));
    const isFollowingRef = useRef(false);

    // Update camera on body selection changes
    useEffect(() => {
        isFollowingRef.current = !!selectedBodyId;
    }, [selectedBodyId]);

    // Handle camera updates
    useFrame(({ controls }, delta) => {
        if (!isFollowingRef.current || !selectedBodyId) return;

        // Find the selected body
        const selectedBody = bodies.find(body => body.id === selectedBodyId);
        if (!selectedBody) return;

        // Scale the position to match the scene scale
        const scaledPosition = selectedBody.position.map(pos => pos * SCALE_FACTOR);
        targetRef.current.set(scaledPosition[0], scaledPosition[1], scaledPosition[2]);

        // Update the orbital controls target (if using OrbitControls)
        if (controls) {
            // This works with the OrbitControls from drei
            controls.target.lerp(targetRef.current, 0.1);
            controls.update();
        } else {
            // Direct camera manipulation if no controls
            camera.lookAt(targetRef.current);
        }
    });

    return null; // This component doesn't render anything visually
};

export default CameraControls;