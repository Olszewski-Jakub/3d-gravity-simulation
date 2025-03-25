/**
 * Compatibility layer for Three.js API changes between versions
 */
import * as THREE from 'three';

// Geometry compatibility - in newer Three.js versions, BufferGeometry classes were merged
export const PlaneGeometry = THREE.PlaneGeometry //|| THREE.PlaneBufferGeometry;
export const SphereGeometry = THREE.SphereGeometry //|| THREE.SphereBufferGeometry;
export const BoxGeometry = THREE.BoxGeometry //|| THREE.BoxBufferGeometry;
export const CylinderGeometry = THREE.CylinderGeometry //|| THREE.CylinderBufferGeometry;

// Check if we need to use legacy renderer parameters
export const getRendererParameters = (params) => {
    // In newer versions, antialias is a property of the WebGLRenderer constructor
    // In older versions, it was part of a WebGLRendererParameters object
    const hasLegacyAPI = typeof THREE.WebGLRenderer.prototype.setPixelRatio === 'undefined';

    if (hasLegacyAPI) {
        return {
            ...params,
            parameters: {
                antialias: params.antialias,
                alpha: params.alpha,
                powerPreference: params.powerPreference
            }
        };
    }

    return params;
};

// Helper to create a material that works in all versions
export const createStandardMaterial = (params) => {
    const material = new THREE.MeshStandardMaterial(params);

    // Handle legacy properties for different versions
    if (params.roughnessMap && !material.roughnessMap) {
        material.roughness = params.roughness || 0.5;
    }

    if (params.metalnessMap && !material.metalnessMap) {
        material.metalness = params.metalness || 0.5;
    }

    return material;
};

// Helper functions for material compatibility
export const setTextureProperties = (texture) => {
    if (texture) {
        // Handle legacy texture properties
        if (typeof texture.encoding !== 'undefined') {
            texture.encoding = THREE.sRGBEncoding || THREE.LinearEncoding;
        }

        // Make sure the texture has necessary properties
        texture.needsUpdate = true;
    }

    return texture;
};