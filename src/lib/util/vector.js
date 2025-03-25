/**
 * Vector math operations for 3D physics calculations
 * All vectors are represented as arrays [x, y, z]
 */

/**
 * Adds two or more vectors
 *
 * @param  {...Array} vectors - Vectors to add [x, y, z]
 * @returns {Array} - Resulting vector
 */
export function add(...vectors) {
    const result = [0, 0, 0];

    vectors.forEach(v => {
        result[0] += v[0];
        result[1] += v[1];
        result[2] += v[2];
    });

    return result;
}

/**
 * Subtracts the second vector from the first
 *
 * @param {Array} v1 - First vector [x, y, z]
 * @param {Array} v2 - Second vector [x, y, z]
 * @returns {Array} - Resulting vector
 */
export function subtract(v1, v2) {
    return [
        v1[0] - v2[0],
        v1[1] - v2[1],
        v1[2] - v2[2]
    ];
}

/**
 * Multiplies a vector by a scalar
 *
 * @param {Array} vector - Vector [x, y, z]
 * @param {Number} scalar - Scalar value
 * @returns {Array} - Resulting vector
 */
export function multiply(vector, scalar) {
    return [
        vector[0] * scalar,
        vector[1] * scalar,
        vector[2] * scalar
    ];
}

/**
 * Divides a vector by a scalar
 *
 * @param {Array} vector - Vector [x, y, z]
 * @param {Number} scalar - Scalar value
 * @returns {Array} - Resulting vector
 */
export function divide(vector, scalar) {
    if (scalar === 0) {
        throw new Error('Cannot divide by zero');
    }

    return [
        vector[0] / scalar,
        vector[1] / scalar,
        vector[2] / scalar
    ];
}

/**
 * Calculates the magnitude (length) of a vector
 *
 * @param {Array} vector - Vector [x, y, z]
 * @returns {Number} - Magnitude
 */
export function magnitude(vector) {
    return Math.sqrt(
        vector[0] * vector[0] +
        vector[1] * vector[1] +
        vector[2] * vector[2]
    );
}

/**
 * Calculates the squared magnitude of a vector
 * Faster than magnitude() since it avoids the square root
 *
 * @param {Array} vector - Vector [x, y, z]
 * @returns {Number} - Squared magnitude
 */
export function magnitudeSquared(vector) {
    return (
        vector[0] * vector[0] +
        vector[1] * vector[1] +
        vector[2] * vector[2]
    );
}

/**
 * Normalizes a vector (makes its magnitude 1)
 *
 * @param {Array} vector - Vector [x, y, z]
 * @returns {Array} - Normalized vector
 */
export function normalize(vector) {
    const length = magnitude(vector);

    if (length === 0) {
        return [0, 0, 0];
    }

    return divide(vector, length);
}

/**
 * Calculates the dot product of two vectors
 *
 * @param {Array} v1 - First vector [x, y, z]
 * @param {Array} v2 - Second vector [x, y, z]
 * @returns {Number} - Dot product
 */
export function dot(v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}

/**
 * Calculates the cross product of two vectors
 *
 * @param {Array} v1 - First vector [x, y, z]
 * @param {Array} v2 - Second vector [x, y, z]
 * @returns {Array} - Cross product vector
 */
export function cross(v1, v2) {
    return [
        v1[1] * v2[2] - v1[2] * v2[1],
        v1[2] * v2[0] - v1[0] * v2[2],
        v1[0] * v2[1] - v1[1] * v2[0]
    ];
}

/**
 * Calculates the distance between two points
 *
 * @param {Array} p1 - First point [x, y, z]
 * @param {Array} p2 - Second point [x, y, z]
 * @returns {Number} - Distance
 */
export function distance(p1, p2) {
    return magnitude(subtract(p2, p1));
}

/**
 * Calculates the squared distance between two points
 * Faster than distance() since it avoids the square root
 *
 * @param {Array} p1 - First point [x, y, z]
 * @param {Array} p2 - Second point [x, y, z]
 * @returns {Number} - Squared distance
 */
export function distanceSquared(p1, p2) {
    return magnitudeSquared(subtract(p2, p1));
}

/**
 * Linear interpolation between two vectors
 *
 * @param {Array} v1 - Start vector [x, y, z]
 * @param {Array} v2 - End vector [x, y, z]
 * @param {Number} t - Interpolation factor (0-1)
 * @returns {Array} - Interpolated vector
 */
export function lerp(v1, v2, t) {
    return [
        v1[0] + (v2[0] - v1[0]) * t,
        v1[1] + (v2[1] - v1[1]) * t,
        v1[2] + (v2[2] - v1[2]) * t
    ];
}

/**
 * Calculates the angle between two vectors in radians
 *
 * @param {Array} v1 - First vector [x, y, z]
 * @param {Array} v2 - Second vector [x, y, z]
 * @returns {Number} - Angle in radians
 */
export function angle(v1, v2) {
    const dotProduct = dot(v1, v2);
    const magProduct = magnitude(v1) * magnitude(v2);

    if (magProduct === 0) {
        return 0;
    }

    // Clamp to avoid floating-point errors
    const cosAngle = Math.max(-1, Math.min(1, dotProduct / magProduct));
    return Math.acos(cosAngle);
}