'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import CelestialBody from './CelestialBody';
import OrbitalPath from './OrbitalPath';
import { useSimulation } from './SimulationContext';

// Scale factor to make the scene more visible (actual astronomical distances are too large)
const SCALE_FACTOR = 1e-9;

// Extreme scaling for visualization purposes
const VISUALIZATION_SCALE_FACTOR = 1e-9; // More compact for visualization

// Scale factor for radii to make celestial bodies visually meaningful
const RADIUS_SCALE_MULTIPLIER = 60;

// Additional scale factor for stars to make them more visible
const STAR_SCALE_MULTIPLIER = 1;

const Scene = () => {
    const { camera } = useThree();
    const groupRef = useRef();

    // Get simulation data from context
    const {
        bodies,
        orbitalPaths,
        showOrbitalPaths,
        onSelectBody,
        selectedBodyId
    } = useSimulation();

    // Find bounding box for all bodies to adjust scaling dynamically
    const { sceneBounds, sceneCenter } = useMemo(() => {
        if (!bodies || bodies.length === 0) return {
            sceneBounds: { min: [-100, -100, -100], max: [100, 100, 100] },
            sceneCenter: [0, 0, 0]
        };

        const min = [Infinity, Infinity, Infinity];
        const max = [-Infinity, -Infinity, -Infinity];

        bodies.forEach(body => {
            for (let i = 0; i < 3; i++) {
                min[i] = Math.min(min[i], body.position[i]);
                max[i] = Math.max(max[i], body.position[i]);
            }
        });

        // Calculate scene center
        const center = [
            (min[0] + max[0]) / 2,
            (min[1] + max[1]) / 2,
            (min[2] + max[2]) / 2
        ];

        return {
            sceneBounds: { min, max },
            sceneCenter: center
        };
    }, [bodies]);

    // Scale positions for rendering
    const scaledBodies = useMemo(() => {
        return bodies.map(body => {
            const typeMultiplier = body.type === 'star' ? STAR_SCALE_MULTIPLIER : 1;
            const minStarSize = body.type === 'star' ? 2 : 0.5;

            const centeredPosition = [
                body.position[0] ,
                body.position[1] ,
                body.position[2]
            ];

            return {
                ...body,
                scaledPosition: centeredPosition.map(pos => pos * VISUALIZATION_SCALE_FACTOR),
                scaledRadius: Math.max(
                    body.radius * SCALE_FACTOR * RADIUS_SCALE_MULTIPLIER * typeMultiplier,
                    minStarSize + (body.mass * 1e-30) * typeMultiplier
                )
            };
        });
    }, [bodies, sceneCenter]);

    // Scale orbital paths for rendering
    const scaledPaths = useMemo(() => {
        const scaled = {};

        if (showOrbitalPaths) {
            Object.entries(orbitalPaths).forEach(([bodyId, path]) => {
                // Center and apply extreme scaling to orbital paths
                scaled[bodyId] = path.map(point => {
                    const centered = [
                        point[0] ,
                        point[1] ,
                        point[2]
                    ];
                    return centered.map(pos => pos * VISUALIZATION_SCALE_FACTOR);
                });
            });
        }

        return scaled;
    }, [orbitalPaths, showOrbitalPaths, sceneCenter]);

    // Find Sun body to place point light
    const sunBody = useMemo(() => {
        return scaledBodies.find(body => body.type === 'star' && body.name === 'Sun');
    }, [scaledBodies]);

    return (
        <group ref={groupRef}>
            {/* Render orbital paths */}
            {showOrbitalPaths && Object.entries(scaledPaths).map(([bodyId, path]) => (
                <OrbitalPath key={`path-${bodyId}`} points={path} />
            ))}

            {/* Separate rendering for stars to ensure visibility */}
            {scaledBodies
                .filter(body => body.type === 'star')
                .map(star => (
                    <group key={`star-special-${star.id}`} position={star.scaledPosition}>
                        <mesh>
                            <sphereGeometry args={[25, 32, 32]} />
                            <meshBasicMaterial
                                color={star.color || "#FFB142"}
                                emissive={star.color || "#FFB142"}
                                emissiveIntensity={3.0}
                            />
                        </mesh>
                        <pointLight
                            intensity={10}
                            distance={500}
                            color={star.color || "#FFB142"}
                        />
                    </group>
                ))
            }

            {/* Render all celestial bodies */}
            {scaledBodies.map(body => (
                <CelestialBody
                    key={body.id}
                    body={body}
                    isSelected={body.id === selectedBodyId}
                    onClick={() => onSelectBody(body.id)}
                />
            ))}

            {/* Add light sources at star positions */}
            {scaledBodies
                .filter(body => body.type === 'star')
                .map(star => (
                    <pointLight
                        key={`light-${star.id}`}
                        position={star.scaledPosition}
                        intensity={3}
                        distance={100}
                        color={star.color || "#FFB142"}
                    />
                ))
            }

            {/* Global directional light */}
            <directionalLight
                position={[10, 20, 30]}
                intensity={0.8}
                castShadow
            />
        </group>
    );
};

export default Scene;