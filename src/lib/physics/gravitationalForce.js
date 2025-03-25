/**
 * Calculate the gravitational force between two celestial bodies
 * using Newton's Law of Universal Gravitation:
 * F = G * (m1 * m2) / r^2
 *
 * @param {Object} body1 - First celestial body
 * @param {Object} body2 - Second celestial body
 * @param {Number} G - Gravitational constant
 * @returns {Array} - Force vector [Fx, Fy, Fz]
 */
export function calculateGravitationalForce(body1, body2, G) {
    // Calculate distance vector between bodies
    const dx = body2.position[0] - body1.position[0];
    const dy = body2.position[1] - body1.position[1];
    const dz = body2.position[2] - body1.position[2];

    // Calculate squared distance (for efficiency)
    const distanceSquared = dx * dx + dy * dy + dz * dz;

    // Prevent division by zero or very small numbers
    if (distanceSquared < 1e-10) {
        return [0, 0, 0];
    }

    // Calculate distance (magnitude)
    const distance = Math.sqrt(distanceSquared);

    // Calculate force magnitude using Newton's Law of Universal Gravitation
    // Increase the force for better visual effect
    const forceMagnitude = G * (body1.mass * body2.mass) / distanceSquared;

    // Calculate normalized direction vector
    const directionX = dx / distance;
    const directionY = dy / distance;
    const directionZ = dz / distance;

    // Return force vector (magnitude * direction)
    return [
        forceMagnitude * directionX,
        forceMagnitude * directionY,
        forceMagnitude * directionZ
    ];
}

/**
 * Calculate the net gravitational force on a body from all other bodies
 *
 * @param {Object} body - The body to calculate forces for
 * @param {Array} allBodies - Array of all celestial bodies
 * @param {Number} G - Gravitational constant
 * @returns {Array} - Net force vector [Fx, Fy, Fz]
 */
export function calculateNetForce(body, allBodies, G) {
    let netForce = [0, 0, 0];

    // Sum forces from all other bodies
    for (const otherBody of allBodies) {
        // Skip self-interaction
        if (otherBody.id === body.id) continue;

        const force = calculateGravitationalForce(body, otherBody, G);

        // Add to net force (vector addition)
        netForce[0] += force[0];
        netForce[1] += force[1];
        netForce[2] += force[2];
    }

    return netForce;
}

/**
 * Calculates the acceleration of a body based on a force
 * using Newton's Second Law: a = F/m
 *
 * @param {Array} force - Force vector [Fx, Fy, Fz]
 * @param {Number} mass - Mass of the body
 * @returns {Array} - Acceleration vector [ax, ay, az]
 */
export function calculateAcceleration(force, mass) {
    return [
        force[0] / mass,
        force[1] / mass,
        force[2] / mass
    ];
}

/**
 * Calculates the orbital velocity needed for circular orbit
 *
 * @param {Number} centralMass - Mass of the central body (e.g., star)
 * @param {Number} distance - Distance from the central body
 * @param {Number} G - Gravitational constant
 * @returns {Number} - Orbital velocity magnitude
 */
export function calculateOrbitalVelocity(centralMass, distance, G) {
    return Math.sqrt((G * centralMass) / distance);
}

/**
 * Checks if two bodies are colliding
 *
 * @param {Object} body1 - First celestial body
 * @param {Object} body2 - Second celestial body
 * @returns {Boolean} - True if bodies are colliding
 */
export function areColliding(body1, body2) {
    const dx = body2.position[0] - body1.position[0];
    const dy = body2.position[1] - body1.position[1];
    const dz = body2.position[2] - body1.position[2];

    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    // If distance is less than the sum of radii, bodies are colliding
    return distance < (body1.radius + body2.radius);
}

/**
 * Handles the collision between two bodies
 * This implements a simple merging strategy
 *
 * @param {Object} body1 - First celestial body
 * @param {Object} body2 - Second celestial body
 * @returns {Object} - The resulting merged body
 */
export function handleCollision(body1, body2) {
    // Determine the more massive body
    const primaryBody = body1.mass >= body2.mass ? body1 : body2;
    const secondaryBody = body1.mass >= body2.mass ? body2 : body1;

    // Calculate total momentum (p = mv)
    const momentum1 = body1.mass * new Array(3).fill(0).map((_, i) => body1.velocity[i]);
    const momentum2 = body2.mass * new Array(3).fill(0).map((_, i) => body2.velocity[i]);

    const totalMass = body1.mass + body2.mass;

    // Calculate new velocity based on conservation of momentum
    const newVelocity = [
        (momentum1[0] + momentum2[0]) / totalMass,
        (momentum1[1] + momentum2[1]) / totalMass,
        (momentum1[2] + momentum2[2]) / totalMass
    ];

    // Calculate new radius (assuming constant density)
    const volumeRatio = Math.pow(body1.radius, 3) + Math.pow(body2.radius, 3);
    const newRadius = Math.pow(volumeRatio, 1/3);

    // Return merged body (based on the more massive one)
    return {
        ...primaryBody,
        mass: totalMass,
        radius: newRadius,
        velocity: newVelocity,
        // Keep position of the more massive body
    };
}