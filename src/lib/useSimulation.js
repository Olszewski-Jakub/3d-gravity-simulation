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

const RECORD_EVERY = 8;
const MAX_SNAPSHOTS = 180;

function startRecording(bodies, elapsed = 0) {
    const live = { bodies, elapsed, trails: {}, error: '' };
    return { live, snapshots: [{ bodies, elapsed }], cursor: null, ticks: 0 };
}

function previewFrame(record) {
    if (record.cursor === null) return record.live;
    const current = record.snapshots[record.cursor];
    const recorded = record.snapshots.slice(0, record.cursor + 1);
    const trails = Object.fromEntries(current.bodies.map(body => [
        body.id,
        recorded.flatMap(sample => {
            const match = sample.bodies.find(item => item.id === body.id);
            return match ? [match.position] : [];
        })
    ]));
    return { ...current, trails, error: '' };
}

function advanceRecording(record, duration, settings, saveStep = false) {
    if (record.cursor === null && record.live.error) return record;
    const live = advance(previewFrame(record), duration, settings);
    let snapshots = record.cursor === null ? record.snapshots : record.snapshots.slice(0, record.cursor + 1);
    let ticks = record.cursor === null ? record.ticks + 1 : 1;
    if ((ticks >= RECORD_EVERY || saveStep) && live.elapsed > snapshots.at(-1).elapsed) {
        snapshots = [...snapshots.slice(1 - MAX_SNAPSHOTS), { bodies: live.bodies, elapsed: live.elapsed }];
        ticks = 0;
    }
    return { live, snapshots, cursor: null, ticks };
}

export function useSimulation(system, settings) {
    const [record, setRecord] = useState(() => startRecording(system));
    const { paused, pace, method, collisions, gravity } = settings;
    const frame = previewFrame(record);
    const reset = useCallback(bodies => setRecord(startRecording(bodies)), []);
    const seek = index => setRecord(current => ({
        ...current,
        cursor: index < current.snapshots.length ? Math.max(0, index) : null
    }));

    useEffect(() => {
        if (paused || frame.error) return;
        let last = performance.now();
        const timer = window.setInterval(() => {
            const now = performance.now();
            const duration = Math.min((now - last) / 1000, 0.08) * DAY * pace;
            last = now;
            if (document.hidden || duration <= 0) return;
            setRecord(current => advanceRecording(current, duration, { method, collisions, gravity }));
        }, 1000 / 30);
        return () => window.clearInterval(timer);
    }, [paused, pace, method, gravity, collisions, frame.error]);

    const step = () => setRecord(current => advanceRecording(current, 3600, settings, true));
    const edit = update => setRecord(current => {
        const source = previewFrame(current);
        return startRecording(update(source.bodies), source.elapsed);
    });

    return {
        ...frame, reset, step, edit, seek,
        snapshots: record.snapshots, cursor: record.cursor, latest: record.live
    };
}
