/**
 * Functions to help stabilize orbital calculations over long periods
 * by correcting numerical drift
 */

/**
 * Corrects orbital energy drift to maintain stable orbits
 *
 * @param {Array} bodies - Array of celestial bodies
 * @param {Object} centralBody - The central body (sun/star)
 * @param {Number} G - Gravitational constant
 * @returns {Array} - Corrected bodies with stabilized orbits
 */
export function stabilizeOrbits(bodies, G) {
    // If we have 2 or fewer bodies, no need for stabilization
    if (!bodies || bodies.length <= 2) return bodies;

    // Find the most massive body (likely the star/sun)
    const centralBodyIndex = bodies.findIndex(body => body.type === 'star');
    if (centralBodyIndex === -1) return bodies; // No star found

    const centralBody = bodies[centralBodyIndex];
    const centralPos = centralBody.position;

    // Create a new array with corrected orbits
    return bodies.map((body, index) => {
        // Don't modify the central body
        if (index === centralBodyIndex) return body;

        // Calculate current orbital parameters
        const relativePos = [
            body.position[0] - centralPos[0],
            body.position[1] - centralPos[1],
            body.position[2] - centralPos[2]
        ];

        const relativeVel = [
            body.velocity[0] - centralBody.velocity[0],
            body.velocity[1] - centralBody.velocity[1],
            body.velocity[2] - centralBody.velocity[2]
        ];

        // Distance from central body
        const distance = Math.sqrt(
            relativePos[0] * relativePos[0] +
            relativePos[1] * relativePos[1] +
            relativePos[2] * relativePos[2]
        );

        // Skip bodies that are too close to the central body (might be colliding)
        if (distance < (centralBody.radius + body.radius) * 2) return body;

        // Calculate orbital speed for the current distance
        const mu = G * centralBody.mass;
        const idealSpeed = Math.sqrt(mu / distance);

        // Current speed
        const currentSpeed = Math.sqrt(
            relativeVel[0] * relativeVel[0] +
            relativeVel[1] * relativeVel[1] +
            relativeVel[2] * relativeVel[2]
        );

        // Only adjust if the speed difference is significant
        if (Math.abs(currentSpeed - idealSpeed) / idealSpeed > 0.05) {
            // Calculate adjustment factor
            const factor = idealSpeed / currentSpeed;

            // Adjust velocity
            const adjustedVelocity = [
                centralBody.velocity[0] + relativeVel[0] * factor,
                centralBody.velocity[1] + relativeVel[1] * factor,
                centralBody.velocity[2] + relativeVel[2] * factor
            ];

            return {
                ...body,
                velocity: adjustedVelocity
            };
        }

        return body;
    });
}

/**
 * Prevents planets from passing through the central body by ensuring
 * minimum safe distances
 *
 * @param {Array} bodies - Array of celestial bodies
 * @returns {Array} - Bodies with safe distances enforced
 */
export function enforceSafeDistances(bodies) {
    // If we have 2 or fewer bodies, just return
    if (!bodies || bodies.length <= 2) return bodies;

    // Find the most massive body (likely the star/sun)
    const centralBodyIndex = bodies.findIndex(body => body.type === 'star');
    if (centralBodyIndex === -1) return bodies; // No star found

    const centralBody = bodies[centralBodyIndex];
    const centralPos = centralBody.position;
    const minDistance = centralBody.radius * 3; // Safe distance

    // Create a new array with enforced minimum distances
    return bodies.map((body, index) => {
        // Don't modify the central body
        if (index === centralBodyIndex) return body;

        // Calculate distance from central body
        const relativePos = [
            body.position[0] - centralPos[0],
            body.position[1] - centralPos[1],
            body.position[2] - centralPos[2]
        ];

        const distance = Math.sqrt(
            relativePos[0] * relativePos[0] +
            relativePos[1] * relativePos[1] +
            relativePos[2] * relativePos[2]
        );

        // If too close, adjust position outward
        if (distance < minDistance) {
            const factor = minDistance / distance;

            const adjustedPosition = [
                centralPos[0] + relativePos[0] * factor,
                centralPos[1] + relativePos[1] * factor,
                centralPos[2] + relativePos[2] * factor
            ];

            return {
                ...body,
                position: adjustedPosition
            };
        }

        return body;
    });
}