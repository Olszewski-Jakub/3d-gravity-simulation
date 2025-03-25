import { calculateNetForce, calculateAcceleration } from './gravitationalForce';

/**
 * Updates the positions and velocities of celestial bodies using the Euler method.
 * Simple but less accurate for long-term simulations.
 *
 * @param {Array} bodies - Array of celestial bodies
 * @param {Number} dt - Time step (seconds)
 * @param {Number} G - Gravitational constant
 * @returns {Array} - Updated array of celestial bodies
 */
export function eulerIntegrator(bodies, dt, G) {
    // Create a deep copy to prevent mutation issues
    const bodiesCopy = JSON.parse(JSON.stringify(bodies));

    return bodiesCopy.map(body => {
        try {
            // Special handling for stars - keep them fixed
            if (body.type === 'star') {
                return {
                    ...body,
                    velocity: [0, 0, 0] // Fix stars in place like in verletIntegrator
                };
            }

            // Calculate net force on this body
            const force = calculateNetForce(body, bodiesCopy, G);

            // Calculate acceleration (F = ma, so a = F/m)
            const acceleration = calculateAcceleration(force, body.mass);

            // Update velocity (v = v₀ + a·dt)
            let newVelocity = [
                body.velocity[0] + acceleration[0] * dt,
                body.velocity[1] + acceleration[1] * dt,
                body.velocity[2] + acceleration[2] * dt
            ];

            // Safety check for invalid velocity values
            newVelocity = newVelocity.map(v => {
                if (!isFinite(v)) return 0;
                if (Math.abs(v) > 1e10) return Math.sign(v) * 1e10; // Clamp extremely high velocities
                return v;
            });

            // Update position (x = x₀ + v·dt)
            let newPosition = [
                body.position[0] + body.velocity[0] * dt,
                body.position[1] + body.velocity[1] * dt,
                body.position[2] + body.velocity[2] * dt
            ];

            // Safety check for invalid position values
            newPosition = newPosition.map((p, i) => {
                if (!isFinite(p)) return body.position[i];
                if (Math.abs(p) > 1e20) return Math.sign(p) * 1e20; // Clamp extremely distant positions
                return p;
            });

            return {
                ...body,
                position: newPosition,
                velocity: newVelocity
            };
        } catch (error) {
            console.error(`Physics calculation error for ${body.name || 'unnamed body'}:`, error);
            return body; // Return unchanged body if calculation fails
        }
    });
}




/**
 * Updates positions and velocities using the Velocity Verlet method.
 * More accurate than Euler and preserves energy better for long-term simulations.
 *
 * @param {Array} bodies - Array of celestial bodies
 * @param {Number} dt - Time step (seconds)
 * @param {Number} G - Gravitational constant
 * @returns {Array} - Updated array of celestial bodies
 */
export function verletIntegrator(bodies, dt, G) {
    // Create a copy of bodies to prevent mutation of the original array

    //remove stars from bodies the array
    const sun = bodies.filter(body => body.type === 'star');
    console.log("Sun", sun);
    const bodiesCopy = JSON.parse(JSON.stringify(bodies));

    // Calculate initial accelerations
    const accelerations = bodiesCopy.map(body => {
        const force = calculateNetForce(body, bodiesCopy, G);
        return calculateAcceleration(force, body.mass);
    });

    // Update positions using current velocities and accelerations
    const halfStepBodies = bodiesCopy.map((body, index) => {
        const a = accelerations[index];

        // Update position: x(t+dt) = x(t) + v(t)·dt + 0.5·a(t)·dt²
        const newPosition = [
            body.position[0] + body.velocity[0] * dt + 0.5 * a[0] * dt * dt,
            body.position[1] + body.velocity[1] * dt + 0.5 * a[1] * dt * dt,
            body.position[2] + body.velocity[2] * dt + 0.5 * a[2] * dt * dt
        ];

        // First half of velocity update: v(t+dt/2) = v(t) + 0.5·a(t)·dt
        const halfStepVelocity = [
            body.velocity[0] + 0.5 * a[0] * dt,
            body.velocity[1] + 0.5 * a[1] * dt,
            body.velocity[2] + 0.5 * a[2] * dt
        ];
        const finalVelocity = body.type === 'star' ? [0, 0, 0] : halfStepVelocity;

        return {
            ...body,
            position: newPosition,
            velocity: finalVelocity
        };
    });

    // Calculate new accelerations at the new positions
    const newAccelerations = halfStepBodies.map(body => {
        const force = calculateNetForce(body, halfStepBodies, G);
        return calculateAcceleration(force, body.mass);
    });

    // Complete the velocity update
    return halfStepBodies.map((body, index) => {
        const a = newAccelerations[index];

        // Second half of velocity update: v(t+dt) = v(t+dt/2) + 0.5·a(t+dt)·dt
        const newVelocity = [
            body.velocity[0] + 0.5 * a[0] * dt,
            body.velocity[1] + 0.5 * a[1] * dt,
            body.velocity[2] + 0.5 * a[2] * dt
        ];

        return {
            ...body,
            velocity: newVelocity
        };
    });
}

/**
 * Updates positions and velocities using the 4th-order Runge-Kutta method.
 * Highly accurate for most simulations but more computationally expensive.
 *
 * @param {Array} bodies - Array of celestial bodies
 * @param {Number} dt - Time step (seconds)
 * @param {Number} G - Gravitational constant
 * @returns {Array} - Updated array of celestial bodies
 */
export function rungeKutta4Integrator(bodies, dt, G) {
    // Helper function to calculate derivatives (accelerations)
    const calculateDerivatives = (bodies) => {
        return bodies.map(body => {
            const force = calculateNetForce(body, bodies, G);
            const acceleration = calculateAcceleration(force, body.mass);
            return {
                velocityDerivative: acceleration, // dv/dt = a
                positionDerivative: body.velocity  // dx/dt = v
            };
        });
    };

    // Apply RK4 steps

    // Step 1: Calculate k1 (derivatives at the current state)
    const k1 = calculateDerivatives(bodies);

    // Step 2: Calculate k2 (derivatives at the state after half a step using k1)
    const halfStep1Bodies = bodies.map((body, i) => {
        const halfDt = dt / 2;
        const k1_acc = k1[i].velocityDerivative;
        const k1_vel = k1[i].positionDerivative;

        return {
            ...body,
            position: [
                body.position[0] + k1_vel[0] * halfDt,
                body.position[1] + k1_vel[1] * halfDt,
                body.position[2] + k1_vel[2] * halfDt
            ],
            velocity: [
                body.velocity[0] + k1_acc[0] * halfDt,
                body.velocity[1] + k1_acc[1] * halfDt,
                body.velocity[2] + k1_acc[2] * halfDt
            ]
        };
    });
    const k2 = calculateDerivatives(halfStep1Bodies);

    // Step 3: Calculate k3 (derivatives at the state after half a step using k2)
    const halfStep2Bodies = bodies.map((body, i) => {
        const halfDt = dt / 2;
        const k2_acc = k2[i].velocityDerivative;
        const k2_vel = k2[i].positionDerivative;

        return {
            ...body,
            position: [
                body.position[0] + k2_vel[0] * halfDt,
                body.position[1] + k2_vel[1] * halfDt,
                body.position[2] + k2_vel[2] * halfDt
            ],
            velocity: [
                body.velocity[0] + k2_acc[0] * halfDt,
                body.velocity[1] + k2_acc[1] * halfDt,
                body.velocity[2] + k2_acc[2] * halfDt
            ]
        };
    });
    const k3 = calculateDerivatives(halfStep2Bodies);

    // Step 4: Calculate k4 (derivatives at the state after a full step using k3)
    const fullStepBodies = bodies.map((body, i) => {
        const k3_acc = k3[i].velocityDerivative;
        const k3_vel = k3[i].positionDerivative;

        return {
            ...body,
            position: [
                body.position[0] + k3_vel[0] * dt,
                body.position[1] + k3_vel[1] * dt,
                body.position[2] + k3_vel[2] * dt
            ],
            velocity: [
                body.velocity[0] + k3_acc[0] * dt,
                body.velocity[1] + k3_acc[1] * dt,
                body.velocity[2] + k3_acc[2] * dt
            ]
        };
    });
    const k4 = calculateDerivatives(fullStepBodies);

    // Final step: Combine all derivatives with appropriate weights (1/6, 1/3, 1/3, 1/6)
    return bodies.map((body, i) => {
        const k1_acc = k1[i].velocityDerivative;
        const k2_acc = k2[i].velocityDerivative;
        const k3_acc = k3[i].velocityDerivative;
        const k4_acc = k4[i].velocityDerivative;

        const k1_vel = k1[i].positionDerivative;
        const k2_vel = k2[i].positionDerivative;
        const k3_vel = k3[i].positionDerivative;
        const k4_vel = k4[i].positionDerivative;

        // Calculate weighted average of derivatives
        const newVelocity = [
            body.velocity[0] + (dt / 6) * (k1_acc[0] + 2 * k2_acc[0] + 2 * k3_acc[0] + k4_acc[0]),
            body.velocity[1] + (dt / 6) * (k1_acc[1] + 2 * k2_acc[1] + 2 * k3_acc[1] + k4_acc[1]),
            body.velocity[2] + (dt / 6) * (k1_acc[2] + 2 * k2_acc[2] + 2 * k3_acc[2] + k4_acc[2])
        ];

        const newPosition = [
            body.position[0] + (dt / 6) * (k1_vel[0] + 2 * k2_vel[0] + 2 * k3_vel[0] + k4_vel[0]),
            body.position[1] + (dt / 6) * (k1_vel[1] + 2 * k2_vel[1] + 2 * k3_vel[1] + k4_vel[1]),
            body.position[2] + (dt / 6) * (k1_vel[2] + 2 * k2_vel[2] + 2 * k3_vel[2] + k4_vel[2])
        ];

        return {
            ...body,
            position: newPosition,
            velocity: newVelocity
        };
    });
}