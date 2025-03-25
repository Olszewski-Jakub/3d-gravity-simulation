import React, { useRef, useState, useEffect } from 'react';

/**
 * A simple 2D fallback renderer for browsers without WebGL support
 * Uses Canvas API to draw a simplified version of the simulation
 */
const FallbackRenderer = ({ bodies }) => {
    const canvasRef = useRef(null);
    const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

    // Handle canvas resizing
    useEffect(() => {
        const handleResize = () => {
            const canvas = canvasRef.current;
            if (canvas) {
                setCanvasSize({
                    width: canvas.clientWidth,
                    height: canvas.clientHeight
                });
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Draw bodies on canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !bodies.length) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.fillStyle = '#050A30';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw stars in background
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const radius = Math.random() * 1.5;
            const opacity = Math.random() * 0.8 + 0.2;

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.fill();
        }

        // Find bounding box for all bodies
        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;

        bodies.forEach(body => {
            minX = Math.min(minX, body.position[0]);
            maxX = Math.max(maxX, body.position[0]);
            minY = Math.min(minY, body.position[1]);
            maxY = Math.max(maxY, body.position[1]);
        });

        // Calculate scale to fit all bodies
        const padding = 50;
        const scaleX = (canvas.width - padding * 2) / (maxX - minX || 1);
        const scaleY = (canvas.height - padding * 2) / (maxY - minY || 1);
        const scale = Math.min(scaleX, scaleY) * 0.8;

        // Calculate center offset
        const centerX = (maxX + minX) / 2;
        const centerY = (maxY + minY) / 2;

        // Draw bodies
        bodies.forEach(body => {
            const x = (body.position[0] - centerX) * scale + canvas.width / 2;
            const y = (body.position[1] - centerY) * scale + canvas.height / 2;

            // Calculate radius based on body type and mass
            const massScale = Math.log(body.mass) / 10;
            const displayRadius = Math.max(3, Math.min(50, massScale * 3));

            // Draw body
            ctx.beginPath();
            ctx.arc(x, y, displayRadius, 0, Math.PI * 2);

            // Different styling for different body types
            if (body.type === 'star') {
                // Draw glow for stars
                const gradient = ctx.createRadialGradient(x, y, displayRadius * 0.5, x, y, displayRadius * 2);
                gradient.addColorStop(0, body.color || '#FFB142');
                gradient.addColorStop(1, 'rgba(255, 177, 66, 0)');

                ctx.fillStyle = gradient;
                ctx.fill();
            }

            ctx.fillStyle = body.color || '#FFFFFF';
            ctx.fill();

            // Label for body
            if (displayRadius > 8) {
                ctx.fillStyle = '#FFFFFF';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(body.name, x, y + displayRadius + 16);
            }
        });

    }, [bodies, canvasSize]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-space-dark">
            <div className="mb-4 text-center">
                <h2 className="text-xl font-bold">2D Gravity Simulation</h2>
                <p className="text-sm text-gray-400">Fallback renderer - WebGL not available</p>
            </div>

            <canvas
                ref={canvasRef}
                width={canvasSize.width}
                height={canvasSize.height}
                className="border border-gray-700 rounded"
            />
        </div>
    );
};

export default FallbackRenderer;