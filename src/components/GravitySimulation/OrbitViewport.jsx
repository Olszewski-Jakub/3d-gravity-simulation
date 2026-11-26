'use client';

import { useEffect, useRef } from 'react';

export const initialCamera = { yaw: -0.13, tilt: 0.50, zoom: 1, focus: null };
export const zoomBy = (zoom, factor) => Math.min(12, Math.max(0.38, zoom * factor));

const TAU = Math.PI * 2;
const TEXTURES = new Set(['earth', 'jupiter', 'mars', 'mercury', 'moon', 'neptune', 'saturn', 'uranus', 'venus']);
const images = new Map();
let solarTexture;

function randomGenerator(seed) {
    return () => {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        return seed / 4294967296;
    };
}

const random = randomGenerator(73);
const stars = Array.from({ length: 950 }, () => [random(), random(), random(), random()]);

function makeSolarTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const image = ctx.createImageData(128, 128);
    const random = randomGenerator(963);
    for (let y = 0; y < 128; y++) {
        for (let x = 0; x < 128; x++) {
            const offset = (y * 128 + x) * 4;
            const domain = Math.sin(x * 0.17 + 2 * Math.sin(y * 0.12)) * Math.cos(y * 0.27)
                + 0.4 * Math.sin(x * 0.5 + y * 0.3) + random() * 0.56;
            image.data.set([255, 163 + domain * 57, 73 + domain * 49, 255], offset);
        }
    }
    ctx.putImageData(image, 0, 0);
    return canvas;
}

function textureFor(file) {
    const name = typeof file === 'string' ? file.replace(/\.jpg$/, '') : '';
    if (!TEXTURES.has(name)) return null;
    if (!images.has(name)) {
        const image = new Image();
        image.src = '/textures/planets/' + name + '.jpg';
        images.set(name, image);
    }
    const image = images.get(name);
    return image.complete && image.naturalWidth ? image : null;
}

function paintBody(ctx, point, body, radius, selected, labels, width, height) {
    const [x, y] = point;
    const star = body.type === 'star';
    const hole = body.type === 'blackhole';
    const color = /^#[0-9a-f]{6}$/i.test(body.color) ? body.color : '#d6c5af';
    if (star || hole) {
        const glow = ctx.createRadialGradient(x, y, radius * 0.6, x, y, radius * 3.7);
        glow.addColorStop(0, hole ? '#e08b6766' : '#ffb346a0');
        glow.addColorStop(0.35, '#e7702f30');
        glow.addColorStop(1, '#d76b2800');
        ctx.fillStyle = glow;
        ctx.fillRect(x - radius * 4, y - radius * 4, radius * 8, radius * 8);
    }
    if (body.texture === 'saturn.jpg' || hole) {
        ctx.beginPath();
        ctx.ellipse(x, y, radius * 1.85, radius * 0.62, -0.34, 0, TAU);
        ctx.lineWidth = Math.max(1, radius * 0.19);
        ctx.strokeStyle = hole ? '#f0a075' : '#c4aa84a6';
        ctx.stroke();
    }
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TAU);
    ctx.clip();
    ctx.fillStyle = hole ? '#08080d' : color;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    const texture = star ? (solarTexture ??= makeSolarTexture()) : textureFor(body.texture);
    if (texture) ctx.drawImage(texture, x - radius, y - radius, radius * 2, radius * 2);
    if (!hole) {
        const light = ctx.createRadialGradient(x - radius * 0.42, y - radius * 0.42, 0, x, y, radius * 1.12);
        light.addColorStop(0, star ? '#fff2ba93' : '#ffffff34');
        light.addColorStop(0.55, star ? '#ffd98b20' : '#ffffff00');
        light.addColorStop(1, star ? '#a7382048' : '#08080ec9');
        ctx.fillStyle = light;
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }
    ctx.restore();

    if (selected) {
        ctx.beginPath();
        ctx.arc(x, y, radius + 6, 0, TAU);
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 4]);
        ctx.strokeStyle = '#ffd5989e';
        ctx.stroke();
        ctx.setLineDash([]);
    }
    if (labels || selected) {
        ctx.font = selected ? '600 12px system-ui' : '500 11px system-ui';
        ctx.textAlign = 'center';
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#0b0a10';
        ctx.fillStyle = selected ? '#ffe2b2' : '#d6cbd0';
        const labelX = Math.min(width - 44, Math.max(44, x));
        const labelY = Math.min(height - 12, Math.max(16, y + radius + (selected ? 23 : 15)));
        ctx.strokeText(body.name, labelX, labelY, 88);
        ctx.fillText(body.name, labelX, labelY, 88);
    }
}

function draw(ctx, width, height, view) {
    const { frame, system, presetId, camera, selected, labels, guides, trails } = view;
    ctx.clearRect(0, 0, width, height);
    for (const [x, y, brightness, size] of stars) {
        ctx.fillStyle = `rgba(238,222,215,${0.11 + brightness * brightness * 0.58})`;
        const length = size > 0.98 ? 1.7 : 0.45 + size * 0.65;
        ctx.fillRect(x * width, y * height, length, length);
    }
    if (!frame.bodies.length) return [];

    const originId = system.reduce((a, b) => a.mass >= b.mass ? a : b).id;
    const baseline = system.find(body => body.id === originId).position;
    const extent = Math.max(1, ...system.map(body => Math.hypot(...body.position.map((value, axis) => value - baseline[axis]))));
    const anchor = frame.bodies.find(body => body.id === originId) ?? frame.bodies[0];
    const span = Math.min(width * 0.43, height * 0.76);
    const center = frame.bodies.find(body => body.id === camera.focus);
    const cosine = Math.cos(camera.yaw);
    const sine = Math.sin(camera.yaw);
    const tiltSin = Math.sin(camera.tilt);
    const tiltCos = Math.cos(camera.tilt);
    const scale = span * camera.zoom;
    function map(position) {
        const relative = position.map((v, axis) => v - anchor.position[axis]);
        const r = Math.hypot(...relative);
        const compression = r ? Math.pow(r / extent, 0.38) / r : 0;
        return relative.map(v => v * compression);
    }

    const offset = center ? map(center.position) : [0, 0, 0];
    function project(position) {
        const mapped = map(position);
        const [x, y, z] = mapped.map((v, axis) => v - offset[axis]);
        const u = x * cosine - y * sine;
        const v = x * sine + y * cosine;
        return [width * 0.5 + u * scale, height * 0.48 + (v * tiltSin - z * tiltCos) * scale, v * tiltCos + z * tiltSin];
    }
    function line(points, color) {
        ctx.beginPath();
        points.forEach((point, i) => {
            const [x, y] = project(point);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    if (guides && ['solarSystem', 'earthMoonSystem'].includes(presetId)) {
        system.filter(body => body.id !== originId).forEach(body => {
            const r = Math.hypot(...body.position.map((v, axis) => v - baseline[axis]));
            const points = Array.from({ length: 121 }, (_, i) => {
                const angle = i / 120 * TAU;
                return [anchor.position[0] + r * Math.cos(angle), anchor.position[1] + r * Math.sin(angle), anchor.position[2]];
            });
            line(points, body.id === selected ? '#e7b57b65' : '#aca0b435');
        });
    }
    if (trails) {
        frame.bodies.forEach(body => {
            const path = frame.trails[body.id];
            if (path?.length > 1) line(path, body.id === selected ? '#f7bb79a0' : '#a99db470');
        });
    }

    return frame.bodies.map(body => ({
        body,
        point: project(body.position),
        radius: Math.max(3, Math.min(42, 7 * Math.pow(body.radius / 6.37e6, 0.35))) *
            Math.min(1, Math.max(0.55, width / 650)) * Math.min(1.8, Math.sqrt(camera.zoom))
    })).sort((a, b) => a.point[2] - b.point[2]).map(target => {
        const { body, point, radius } = target;
        if (point[0] > -radius && point[0] < width + radius && point[1] > -radius && point[1] < height + radius) {
            paintBody(ctx, point, body, radius, body.id === selected, labels, width, height);
        }
        return target;
    });
}

export default function OrbitViewport(props) {
    const canvasRef = useRef(null);
    const latest = useRef(props);
    const hits = useRef([]);
    const pointers = useRef(new Map());
    const gesture = useRef({ distance: 0, moved: false });
    latest.current = props;

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animation;
        let lastView;
        let lastWidth;
        let lastHeight;
        let lastDraw = -Infinity;
        function render(now) {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            // Periodic redraw also handles textures resolving while paused.
            if (width && height && (latest.current !== lastView || width !== lastWidth || height !== lastHeight || now - lastDraw > 250)) {
                const dpr = Math.min(window.devicePixelRatio || 1, 1.65);
                if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
                    canvas.width = Math.round(width * dpr);
                    canvas.height = Math.round(height * dpr);
                }
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                hits.current = draw(ctx, width, height, latest.current);
                lastView = latest.current;
                lastWidth = width;
                lastHeight = height;
                lastDraw = now;
            }
            animation = requestAnimationFrame(render);
        }
        function wheel(event) {
            event.preventDefault();
            latest.current.setCamera(current => ({ ...current, zoom: zoomBy(current.zoom, Math.exp(-event.deltaY * 0.0013)) }));
        }
        animation = requestAnimationFrame(render);
        canvas.addEventListener('wheel', wheel, { passive: false });
        return () => {
            cancelAnimationFrame(animation);
            canvas.removeEventListener('wheel', wheel);
        };
    }, []);

    function distance() {
        const [a, b] = pointers.current.values();
        return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0;
    }

    function pointerDown(event) {
        if (event.button !== 0 || pointers.current.size >= 2) return;
        const point = { x: event.clientX, y: event.clientY };
        if (!pointers.current.size) gesture.current = { start: point, distance: 0, moved: false };
        pointers.current.set(event.pointerId, point);
        event.currentTarget.setPointerCapture(event.pointerId);
        if (pointers.current.size === 2) {
            gesture.current.distance = distance();
            gesture.current.moved = true;
        }
    }

    function pointerMove(event) {
        const previous = pointers.current.get(event.pointerId);
        if (!previous) return;
        const point = { x: event.clientX, y: event.clientY };
        pointers.current.set(event.pointerId, point);
        const { start, moved } = gesture.current;
        if (pointers.current.size === 2) {
            const span = distance();
            const ratio = span / Math.max(1, gesture.current.distance);
            gesture.current.distance = span;
            props.setCamera(camera => ({ ...camera, zoom: zoomBy(camera.zoom, ratio) }));
        } else if (moved || Math.hypot(point.x - start.x, point.y - start.y) > 4) {
            gesture.current.moved = true;
            props.setCamera(camera => ({
                ...camera,
                yaw: camera.yaw + (point.x - previous.x) * 0.007,
                tilt: Math.min(1.56, Math.max(-1.56, camera.tilt + (point.y - previous.y) * 0.006))
            }));
        }
    }

    function pointerEnd(event) {
        if (!pointers.current.delete(event.pointerId) || event.type !== 'pointerup' || gesture.current.moved) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const candidates = hits.current.map(hit => ({
            ...hit, distance: Math.hypot(hit.point[0] - x, hit.point[1] - y)
        })).filter(hit => hit.distance <= Math.max(15, hit.radius + 5));
        candidates.sort((a, b) => a.distance - b.distance);
        if (candidates[0]) props.onSelect(candidates[0].body.id);
    }

    function rotateWithKeyboard(event) {
        const direction = {
            ArrowLeft: [-0.12, 0], ArrowRight: [0.12, 0],
            ArrowUp: [0, -0.12], ArrowDown: [0, 0.12]
        }[event.key];
        if (!Array.isArray(direction)) return;
        event.preventDefault();
        props.setCamera(camera => ({
            ...camera, yaw: camera.yaw + direction[0],
            tilt: Math.min(1.56, Math.max(-1.56, camera.tilt + direction[1]))
        }));
    }

    return <canvas tabIndex={0} onKeyDown={rotateWithKeyboard} className="orbital-canvas" ref={canvasRef} aria-label="Interactive 3D orbital view"
        onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerEnd}
        onPointerCancel={pointerEnd} onLostPointerCapture={pointerEnd}>
        Select a celestial body from the object list to inspect it.
    </canvas>;
}
