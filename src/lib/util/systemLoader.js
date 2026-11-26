/**
 * Utilities for importing and exporting planetary system configurations
 */

/**
 * Exports the current system as a JSON file
 *
 * @param {Array} celestialBodies - Array of celestial body objects
 * @param {String} filename - Name for the exported file
 */
export function exportSystem(celestialBodies, filename = 'gravity-system') {
    // Create a formatted JSON string with celestial bodies
    const systemData = {
        name: filename,
        description: 'A planetary system exported from Gravity Simulator',
        timestamp: new Date().toISOString(),
        bodies: celestialBodies
    };

    const jsonString = JSON.stringify(systemData, null, 2);

    // Create a blob and trigger download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Imports a system from a JSON file
 *
 * @param {File} file - JSON file to import
 * @returns {Promise} - Promise resolving to the imported celestial bodies
 */
export function importSystem(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const systemData = JSON.parse(event.target.result);

                // Validate the imported data
                if (!systemData.bodies || !Array.isArray(systemData.bodies)) {
                    throw new Error('Invalid system file: missing bodies array');
                }

                // Validate each body has the required properties
                const requiredProps = ['id', 'name', 'type', 'mass', 'radius', 'position', 'velocity'];

                if (systemData.bodies.length === 0 || systemData.bodies.length > 60) {
                    throw new Error('A system must contain 1–60 bodies.');
                }
                systemData.bodies.forEach((body, index) => {
                    if (!body || typeof body !== 'object') throw new Error('Each body must be an object.');
                    requiredProps.forEach(prop => {
                        if (body[prop] === undefined) {
                            throw new Error(`Body at index ${index} is missing the required property: ${prop}`);
                        }
                    });

                    // Ensure position and velocity are arrays with 3 elements
                    ['position', 'velocity'].forEach(vectorProp => {
                        if (!Array.isArray(body[vectorProp]) || body[vectorProp].length !== 3) {
                            throw new Error(`Body "${body.name}" has an invalid ${vectorProp} vector`);
                        }
                    });
                });

                resolve(systemData.bodies);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => {
            reject(new Error('Failed to read the file'));
        };

        reader.readAsText(file);
    });
}

/**
 * Validates a system to ensure it's physically realistic
 *
 * @param {Array} bodies - Array of celestial body objects
 * @returns {Object} - Validation result with errors if any
 */
export function validateSystem(bodies) {
    const result = {
        valid: true,
        errors: [],
        warnings: []
    };

    const ids = new Set();
    if (!bodies.length || bodies.length > 60) result.errors.push('A system must contain 1–60 bodies.');
    for (const body of bodies) {
        const id = String(body.id);
        if (!['string', 'number'].includes(typeof body.id) || !id.trim() ||
            ['__proto__', 'constructor', 'prototype'].includes(id) || ids.has(id)) {
            result.errors.push('Every body must have a unique, usable ID.');
        }
        ids.add(id);
        if (typeof body.name !== 'string' || !body.name.trim() || typeof body.type !== 'string' || !body.type.trim()) {
            result.errors.push('Every body needs a name and type.');
        }
        for (const field of ['mass', 'radius']) {
            if (!Number.isFinite(body[field]) || body[field] <= 0) {
                result.errors.push(`${body.name} has an invalid ${field}.`);
            }
        }
        for (const field of ['position', 'velocity']) {
            if (!Array.isArray(body[field]) || body[field].length !== 3 || !body[field].every(Number.isFinite)) {
                result.errors.push(`${body.name} has an invalid ${field} vector.`);
            }
        }
    }
    if (result.errors.length) return { ...result, valid: false };

    // Check for overlapping bodies (initial collisions)
    for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
            const body1 = bodies[i];
            const body2 = bodies[j];

            const dx = body2.position[0] - body1.position[0];
            const dy = body2.position[1] - body1.position[1];
            const dz = body2.position[2] - body1.position[2];

            const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);

            if (distance < (body1.radius + body2.radius)) {
                result.warnings.push(`${body1.name} and ${body2.name} are initially overlapping`);
            }
        }
    }

    // Check for extreme velocities (approaching speed of light)
    const SPEED_OF_LIGHT = 299792458; // m/s

    bodies.forEach(body => {
        const vx = body.velocity[0];
        const vy = body.velocity[1];
        const vz = body.velocity[2];

        const speed = Math.sqrt(vx*vx + vy*vy + vz*vz);

        if (speed > SPEED_OF_LIGHT * 0.1) {
            result.warnings.push(`${body.name} has a very high velocity (${speed.toExponential(2)} m/s)`);
        }
    });

    return result;
}