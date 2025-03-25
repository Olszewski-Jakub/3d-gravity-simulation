'use client';

import React, { useRef, useState, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';
import ClientWrapper from './ClientWrapper';
import IntegratorErrorHandler from '../UI/IntegratorErrorHandler';
import { eulerIntegrator, verletIntegrator, rungeKutta4Integrator } from '../../lib/physics/integrators';
import { areColliding, handleCollision } from '../../lib/physics/gravitationalForce';
import { stabilizeOrbits, enforceSafeDistances } from '../../lib/physics/orbitStabilizer';

/**
 * Calculate the distance between two 3D points
 */
const distanceBetweenPoints = (p1, p2) => {
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    const dz = p2[2] - p1[2];
    return Math.sqrt(dx*dx + dy*dy + dz*dz);
};

const GravitySimulation = ({
                               celestialBodies,
                               simulationState,
                               onSelectBody,
                               enableDebug = true // Enable debugging by default
                           }) => {
    // State to hold the current simulation data
    const [bodies, setBodies] = useState(celestialBodies || []);
    const [orbitalPaths, setOrbitalPaths] = useState({});

    // Refs for animation frame handling
    const animationFrameRef = useRef(null);
    const lastUpdateTimeRef = useRef(null);

    // Extract simulation parameters from state
    const {
        timeScale = 1,
        paused = false,
        integrationMethod = 'verlet',
        gravitationalConstant = 6.67430e-11,
        showOrbitalPaths = true,
        enableCollisions = true,
        selectedBody = null
    } = simulationState || {};

    // Find sun ID for initial selection if no body is selected
    useEffect(() => {
        if (!selectedBody && bodies.length > 0 && onSelectBody) {
            const sun = bodies.find(body => body.type === 'star' && body.name === 'Sun');
            if (sun) {
                onSelectBody(sun.id);
            }
        }
    }, [bodies, selectedBody, onSelectBody]);

    // Initialize lastUpdateTimeRef if needed
    useEffect(() => {
        if (lastUpdateTimeRef.current === null) {
            lastUpdateTimeRef.current = Date.now();
        }
    }, []);

    // Update local bodies state when celestialBodies prop changes
    useEffect(() => {
        if (celestialBodies && celestialBodies.length > 0) {
            setBodies(celestialBodies);
            // Reset orbital paths when bodies change
            setOrbitalPaths({});
        }
    }, [celestialBodies]);

    // Main simulation loop
    useEffect(() => {
        // Skip if no bodies
        if (!bodies || bodies.length === 0) return;

        // Check if the simulation is paused
        if (paused) {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            return;
        }

        // Make sure lastUpdateTimeRef is initialized
        if (lastUpdateTimeRef.current === null) {
            lastUpdateTimeRef.current = Date.now();
        }

        // Frame counter for orbit stabilization
        const frameCount = { count: 0 };

        // Animation loop function
        const animate = () => {
            // Calculate time step - use a fixed time step for more stable physics
            const fixedDeltaTime = 0.016 * timeScale; // 60fps equivalent * timeScale

            // Store current time for next frame
            lastUpdateTimeRef.current = Date.now();

            // Use a reasonable time step for physics calculations
            let updatedBodies;
            switch (integrationMethod) {
                case 'euler':
                    updatedBodies = eulerIntegrator(bodies, fixedDeltaTime, gravitationalConstant);
                    break;
                case 'verlet':
                    updatedBodies = verletIntegrator(bodies, fixedDeltaTime, gravitationalConstant);
                    break;
                case 'rk4':
                    updatedBodies = rungeKutta4Integrator(bodies, fixedDeltaTime, gravitationalConstant);
                    break;
                default:
                    updatedBodies = verletIntegrator(bodies, fixedDeltaTime, gravitationalConstant);
            }

            // Handle collisions if enabled
            if (enableCollisions) {
                const collisions = [];

                // Check for collisions between all bodies
                for (let i = 0; i < updatedBodies.length; i++) {
                    for (let j = i + 1; j < updatedBodies.length; j++) {
                        if (areColliding(updatedBodies[i], updatedBodies[j])) {
                            collisions.push([i, j]);
                        }
                    }
                }

                // Process collisions (starting from the end to avoid index shifting issues)
                if (collisions.length > 0) {
                    // Sort collisions by highest indexes first
                    collisions.sort((a, b) => Math.max(b[0], b[1]) - Math.max(a[0], a[1]));

                    // Create a new array to hold updated bodies
                    let processedBodies = [...updatedBodies];

                    // Process each collision
                    for (const [idx1, idx2] of collisions) {
                        const body1 = processedBodies[idx1];
                        const body2 = processedBodies[idx2];

                        // Create merged body
                        const mergedBody = handleCollision(body1, body2);

                        // Remove the two colliding bodies and add the merged one
                        processedBodies = [
                            ...processedBodies.slice(0, Math.min(idx1, idx2)),
                            mergedBody,
                            ...processedBodies.slice(Math.min(idx1, idx2) + 1, Math.max(idx1, idx2)),
                            ...processedBodies.slice(Math.max(idx1, idx2) + 1)
                        ];
                    }

                    updatedBodies = processedBodies;
                }
            }

            // Update orbital paths if enabled
            if (showOrbitalPaths) {
                const newOrbitalPaths = { ...orbitalPaths };

                updatedBodies.forEach(body => {
                    // Initialize path array if it doesn't exist
                    if (!newOrbitalPaths[body.id]) {
                        newOrbitalPaths[body.id] = [];
                    }

                    // Only add positions at certain intervals to avoid too many points
                    // This creates visible path segments even with slow movement
                    if (newOrbitalPaths[body.id].length === 0 ||
                        newOrbitalPaths[body.id].length % 10 === 0 ||
                        distanceBetweenPoints(
                            body.position,
                            newOrbitalPaths[body.id][newOrbitalPaths[body.id].length - 1] || body.position
                        ) > 1e9) {
                        newOrbitalPaths[body.id].push([...body.position]);
                    }

                    // Limit path length to prevent performance issues
                    if (newOrbitalPaths[body.id].length > 500) {
                        newOrbitalPaths[body.id] = newOrbitalPaths[body.id].slice(-500);
                    }
                });

                setOrbitalPaths(newOrbitalPaths);
            }

            // Update bodies state
            setBodies(updatedBodies);

            // Start animation loop
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        // Start animation loop
        if (!animationFrameRef.current) {
            animationFrameRef.current = requestAnimationFrame(animate);
        }

        // Ensure initial motion is visible
        if (bodies.length > 0 && bodies.every(body =>
            body.velocity[0] === 0 && body.velocity[1] === 0 && body.velocity[2] === 0
        )) {
            // Give a small initial velocity to the first non-star body if all velocities are zero
            const nonStarBody = bodies.find(body => body.type !== 'star');
            if (nonStarBody) {
                const updatedBodies = [...bodies];
                const index = updatedBodies.findIndex(body => body.id === nonStarBody.id);
                updatedBodies[index] = {
                    ...nonStarBody,
                    velocity: [0, 1000, 0] // Give a small initial velocity
                };
                setBodies(updatedBodies);
            }
        }

        // Cleanup function
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        };
    }, [bodies, paused, timeScale, integrationMethod, gravitationalConstant, showOrbitalPaths, enableCollisions]);

    // Rendering the 3D scene with error boundary
    return (
        <div className="w-full h-screen bg-black">
            <ErrorBoundary>
                <ClientWrapper
                    bodies={bodies}
                    orbitalPaths={orbitalPaths}
                    showOrbitalPaths={showOrbitalPaths}
                    onSelectBody={onSelectBody}
                    selectedBodyId={selectedBody}
                    enableDebug={enableDebug}
                />
            </ErrorBoundary>
            <IntegratorErrorHandler />
        </div>
    );
};

export default GravitySimulation;