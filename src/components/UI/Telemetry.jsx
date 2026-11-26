'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ASTRONOMICAL_UNIT } from '../../lib/physics/constants';

const decimal = new Intl.NumberFormat('en', { maximumSignificantDigits: 4 });

export default function Telemetry({ body, reference, snapshots, cursor, elapsed }) {
    const [mode, setMode] = useState('speed');
    const canvas = useRef(null);
    const track = mode === 'distance' && body.id !== reference.id;
    const values = useMemo(() => snapshots.flatMap(sample => {
        const observed = sample.bodies.find(item => item.id === body.id);
        if (!observed) return [];
        if (!track) return [[sample.elapsed, Math.hypot(...observed.velocity) / 1000]];
        const anchor = sample.bodies.find(item => item.id === reference.id);
        if (!anchor) return [];
        return [[sample.elapsed, Math.hypot(...observed.position.map((value, axis) => value - anchor.position[axis])) / ASTRONOMICAL_UNIT]];
    }).filter(([, value]) => Number.isFinite(value)), [body.id, reference.id, snapshots, track]);
    const scrubTime = cursor === null ? null : elapsed;
    const unit = track ? 'AU' : 'km/s';
    const label = track ? 'Distance to ' + reference.name : 'Orbital speed';
    const minimum = Math.min(...values.map(([, value]) => value));
    const maximum = Math.max(...values.map(([, value]) => value));

    useEffect(() => {
        const element = canvas.current;
        if (!element) return;
        const ctx = element.getContext('2d');
        if (!ctx) return;
        function paint() {
            const width = element.clientWidth;
            const height = element.clientHeight;
            if (!width || !height) return;
            const dpr = Math.min(2, window.devicePixelRatio || 1);
            element.width = Math.round(width * dpr);
            element.height = Math.round(height * dpr);
            ctx.scale(dpr, dpr);
            const start = values[0][0];
            const duration = values.at(-1)[0] - start || 1;
            const x = time => 4 + (time - start) / duration * (width - 8);
            const span = maximum - minimum;
            const y = value => span ? height - 8 - (value - minimum) / span * (height - 16) : height / 2;
            ctx.strokeStyle = '#282c42';
            for (const line of [0.25, 0.5, 0.75]) {
                ctx.beginPath();
                ctx.moveTo(0, height * line);
                ctx.lineTo(width, height * line);
                ctx.stroke();
            }
            ctx.beginPath();
            values.forEach(([time, value], index) => {
                if (index) ctx.lineTo(x(time), y(value));
                else ctx.moveTo(x(time), y(value));
            });
            ctx.strokeStyle = '#b6a1ff';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            if (scrubTime !== null && scrubTime >= start) {
                ctx.beginPath();
                ctx.moveTo(x(scrubTime), 0);
                ctx.lineTo(x(scrubTime), height);
                ctx.strokeStyle = '#f7c48d';
                ctx.stroke();
            }
        }
        const observer = new ResizeObserver(paint);
        observer.observe(element);
        paint();
        return () => observer.disconnect();
    }, [values, minimum, maximum, scrubTime]);

    return <section className="telemetry" aria-labelledby="telemetry-title">
        <div className="telemetry-heading">
            <h3 id="telemetry-title">Telemetry</h3>
            <div className="telemetry-modes" role="group" aria-label="Telemetry measurement">
                <button type="button" aria-pressed={!track} onClick={() => setMode('speed')}>Speed</button>
                <button type="button" aria-pressed={track} disabled={body.id === reference.id} onClick={() => setMode('distance')}>Distance</button>
            </div>
        </div>
        {values.length < 2 ? <p className="telemetry-empty">Play the simulation to record {track ? 'distance' : 'speed'}.</p> :
            <>
                <canvas className="telemetry-chart" ref={canvas} role="img"
                    aria-label={label + ' over recorded time, from ' + decimal.format(minimum) + ' to ' + decimal.format(maximum) + ' ' + unit}/>
                <p className="telemetry-range"><span>{label}</span><span>{decimal.format(minimum)}–{decimal.format(maximum)} {unit}</span></p>
            </>}
    </section>;
}
