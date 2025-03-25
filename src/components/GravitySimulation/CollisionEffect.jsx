import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';

const CollisionEffect = ({ position, radius, duration = 1.5 }) => {
    const groupRef = useRef();
    const startTimeRef = useRef(Date.now());
    const active = useRef(true);

    // Animation effect
    useFrame(() => {
        if (!active.current || !groupRef.current) return;

        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const progress = Math.min(elapsed / duration, 1);

        // Scale the effect outward
        const scale = 1 + progress * 3;
        groupRef.current.scale.set(scale, scale, scale);

        // Fade out the effect
        if (groupRef.current.material) {
            groupRef.current.material.opacity = 1 - progress;
        }

        // Remove when done
        if (progress >= 1) {
            active.current = false;
        }
    });

    return (
        <group position={position}>
            <Sphere ref={groupRef} args={[radius, 16, 16]}>
                <meshBasicMaterial
                    color="#FFAA00"
                    transparent
                    opacity={0.8}
                />
            </Sphere>
        </group>
    );
};

export default CollisionEffect;