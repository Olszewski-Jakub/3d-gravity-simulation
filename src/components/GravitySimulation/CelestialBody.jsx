import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useTexture } from '@react-three/drei';
import { SphereGeometry } from '../../lib/util/threeCompat';

const CelestialBody = ({ body, isSelected, onClick }) => {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);

    // Extract required properties from the body
    const { id, name, type, scaledPosition, scaledRadius, color, texture } = body;
    const [x, y, z] = scaledPosition;

    // Attempt to load texture if specified, otherwise use color
    let loadedTexture;
    try {
        loadedTexture = texture ? useTexture(`/textures/${texture}`) : null;
    } catch (error) {
        console.warn(`Texture not found for ${name}:`, error);
        loadedTexture = null;
    }

    // Special glow effect for stars
    const isLuminous = type === 'star' || type === 'blackhole';

    // Rotation animation for planets
    useFrame((state, delta) => {
        if (meshRef.current && type !== 'star' && type !== 'blackhole') {
            // Rotate planets around their axis
            meshRef.current.rotation.y += delta * 0.2;
        }
    });

    // Handle pointer events
    const handlePointerOver = (e) => {
        e.stopPropagation();
        setHovered(true);
    };

    const handlePointerOut = (e) => {
        e.stopPropagation();
        setHovered(false);
    };

    const handleClick = (e) => {
        e.stopPropagation();
        onClick();
    };

    // Style based on celestial body type
    const getEmissiveColor = () => {
        switch (type) {
            case 'star':
                return color || '#FFB142';
            case 'blackhole':
                return '#000000';
            default:
                return hovered ? '#333333' : '#000000';
        }
    };

    return (
        <group position={[x, y, z]}>
            {/* The celestial body */}
            <mesh
                ref={meshRef}
                onClick={handleClick}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                castShadow={true}
                receiveShadow={type !== 'star'}
            >
                <sphereGeometry args={[scaledRadius, 32, 32]} />
                <meshStandardMaterial
                    color={color || (type === 'star' ? '#FFB142' : '#AAAAAA')}
                    map={loadedTexture}
                    emissive={getEmissiveColor()}
                    emissiveIntensity={isLuminous ? 0.8 : 0.1}
                    metalness={0.2}
                    roughness={0.7}
                />
            </mesh>

            {/* Glow effect for stars */}
            {isLuminous && (
                <mesh scale={[1.2, 1.2, 1.2]}>
                    <sphereGeometry args={[scaledRadius, 16, 16]} />
                    <meshBasicMaterial
                        color={type === 'blackhole' ? '#990099' : '#FFDDAA'}
                        transparent={true}
                        opacity={0.15}
                    />
                </mesh>
            )}

            {/* Selection indicator */}
            {isSelected && (
                <mesh scale={[1.1, 1.1, 1.1]}>
                    <sphereGeometry args={[scaledRadius, 16, 16]} />
                    <meshBasicMaterial
                        color="#FFFFFF"
                        wireframe={true}
                        transparent={true}
                        opacity={0.3}
                    />
                </mesh>
            )}

            {/* Label that shows on hover */}
            {(hovered || isSelected) && (
                <Html
                    position={[0, scaledRadius * 1.5, 0]}
                    center
                    className="pointer-events-none"
                >
                    <div className="bg-space-dark bg-opacity-80 text-white px-2 py-1 rounded-md whitespace-nowrap">
                        {name}
                    </div>
                </Html>
            )}
        </group>
    );
};

export default CelestialBody;