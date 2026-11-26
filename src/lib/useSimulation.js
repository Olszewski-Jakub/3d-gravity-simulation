import { useCallback, useEffect, useState } from 'react';
import { eulerIntegrator, verletIntegrator, rungeKutta4Integrator } from './physics/integrators';
import { areColliding, handleCollision } from './physics/gravitationalForce';

export const DAY = 86400;
const methods = { euler: eulerIntegrator, verlet: verletIntegrator, rk4: rungeKutta4Integrator };

function mergeOverlaps(bodies) {
    const next = [...bodies];
    for (let i = 0; i < next.length; i++) {
        for (let j = i + 1; j < next.length; j++) {
            if (!areColliding(next[i], next[j])) continue;
            next[i] = handleCollision(next[i], next[j]);
            next.splice(j, 1);
            i = -1;
            break;
        }
    }
    return next;
}

function stepLimit(bodies, gravity) {
    let limit = 3600;
    for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
            const a = bodies[i];
            const b = bodies[j];
            const distance = Math.max(a.radius + b.radius, Math.hypot(...a.position.map((v, axis) => v - b.position[axis])));
            const speed = Math.hypot(...a.velocity.map((v, axis) => v - b.velocity[axis]));
            limit = Math.min(limit, 0.025 * Math.sqrt(distance ** 3 / (gravity * (a.mass + b.mass))),
                0.25 * distance / speed);
        }
    }
    return Math.max(0.001, limit);
}

function advance(frame, duration, settings) {
    let { bodies, elapsed } = frame;
    const { method, gravity, collisions } = settings;
    if (collisions) bodies = mergeOverlaps(bodies);

    // Bound work per frame during close encounters. The clock reports time actually simulated.
    for (let i = 0; i < 32 && duration > 0; i++) {
        const dt = Math.min(duration, stepLimit(bodies, gravity));
        bodies = methods[method](bodies, dt, gravity);
        if (collisions) bodies = mergeOverlaps(bodies);
        if (bodies.some(body => [...body.position, ...body.velocity, body.mass, body.radius].some(value => !Number.isFinite(value)))) {
            return { ...frame, error: 'The simulation reached a numerical limit. Reset or switch systems to continue.' };
        }
        duration -= dt;
        elapsed += dt;
    }

    const trails = Object.fromEntries(bodies.map(body => {
        const trail = frame.trails[body.id] ?? [];
        return [body.id, [...trail.slice(-179), body.position]];
    }));

    return { bodies, elapsed, trails, error: '' };
}

export function useSimulation(system, settings) {
    const [frame, setFrame] = useState(() => ({ bodies: system, elapsed: 0, trails: {}, error: '' }));
    const reset = useCallback(bodies => setFrame({ bodies, elapsed: 0, trails: {}, error: '' }), []);
    const { paused, pace, method, collisions, gravity } = settings;

    useEffect(() => {
        if (paused || frame.error) return;
        let last = performance.now();
        const timer = window.setInterval(() => {
            const now = performance.now();
            const duration = Math.min((now - last) / 1000, 0.08) * DAY * pace;
            last = now;
            if (document.hidden) return;
            setFrame(current => current.error ? current : advance(current, duration, { method, collisions, gravity }));
        }, 1000 / 30);
        return () => window.clearInterval(timer);
    }, [paused, pace, method, gravity, collisions, frame.error]);

    const step = () => setFrame(current => current.error ? current : advance(current, 3600, settings));
    const edit = (update, id) => setFrame(current => {
        const trails = { ...current.trails };
        delete trails[id];
        return { ...current, bodies: update(current.bodies), trails };
    });
    return { ...frame, reset, step, edit };
}
