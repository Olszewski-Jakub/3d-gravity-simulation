'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * A special visualization component just for the sun
 * This ensures the sun is always visible regardless of scaling issues
 */
const SunVisualization = ({ color = '#FFB142', size = 20 }) => {
    const sunRef = useRef();
    const glowRef = useRef();

    // Animate the sun with a subtle pulsing effect
    useFrame((state, delta) => {
        if (sunRef.current) {
            // Subtle rotation
            sunRef.current.rotation.y += delta * 0.1;
        }

        if (glowRef.current) {
            // Pulsing glow effect
            const time = state.clock.getElapsedTime();
            const scale = 1.5 + Math.sin(time * 0.5) * 0.1;
            glowRef.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <group position={[0, 0, 0]}>
            {/* Base Sun Mesh */}
            <mesh ref={sunRef}>
                <sphereGeometry args={[size, 32, 32]} />
                <meshBasicMaterial color={color} />
            </mesh>

            {/* Glowing effect */}
            <mesh ref={glowRef} scale={[1.5, 1.5, 1.5]}>
                <sphereGeometry args={[size, 32, 32]} />
                <meshBasicMaterial
                    color={color}
                    transparent={true}
                    opacity={0.4}
                />
            </mesh>

            {/* Intense light source */}
            <pointLight
                intensity={15}
                distance={1000}
                color={color}
                decay={1}
            />

            {/* Corona effect */}
            <sprite scale={[size * 4, size * 4, size * 4]}>
                <spriteMaterial
                    transparent={true}
                    blending={THREE.AdditiveBlending}
                    color={color}
                />
            </sprite>
        </group>
    );
};

export default SunVisualization;