import { useEffect, useRef } from 'react';

export function useFluidRipple(canvasRef, config = {}) {
    const {
        color = [61, 220, 132],
        radius = 0.05,
        dissipation = 0.965,
    } = config;

    const densityRef = useRef(null);
    const velocityRef = useRef(null);
    const rafRef = useRef(null);
    const sizeRef = useRef({ w: 0, h: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });

        // Decrease resolution for fluid simulation performance
        const DOWNSCALE = 4;
        let w = 0; let h = 0;
        let density = [];
        let velocityX = [];
        let velocityY = [];

        const initArrays = () => {
            const size = w * h;
            density = new Float32Array(size);
            velocityX = new Float32Array(size);
            velocityY = new Float32Array(size);
        };

        const resize = () => {
            // Match canvas display size exactly
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            w = Math.ceil(rect.width / DOWNSCALE);
            h = Math.ceil(rect.height / DOWNSCALE);
            sizeRef.current = { w, h };
            initArrays();
        };

        resize();
        window.addEventListener('resize', resize);

        const IX = (x, y) => {
            x = Math.max(0, Math.min(x, w - 1));
            y = Math.max(0, Math.min(y, h - 1));
            return x + y * w;
        };

        const addDensity = (x, y, amount) => {
            const rx = Math.floor(x / DOWNSCALE);
            const ry = Math.floor(y / DOWNSCALE);
            const rad = Math.ceil(Math.min(w, h) * radius);
            for (let i = -rad; i <= rad; i++) {
                for (let j = -rad; j <= rad; j++) {
                    if (i * i + j * j <= rad * rad) {
                        const idx = IX(rx + i, ry + j);
                        density[idx] += amount;
                    }
                }
            }
        };

        const render = () => {
            if (!w || !h) return;
            const imgData = ctx.createImageData(w, h);
            const data = imgData.data;

            for (let i = 0; i < w * h; i++) {
                // Decay
                density[i] *= dissipation;

                // Color mapping
                const d = Math.min(255, density[i]);
                const px = i * 4;
                data[px] = color[0];
                data[px + 1] = color[1];
                data[px + 2] = color[2];
                data[px + 3] = d; // alpha
            }

            // Draw scaled up to canvas
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = w;
            tempCanvas.height = h;
            tempCanvas.getContext('2d').putImageData(imgData, 0, 0);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Smooth scaling
            ctx.imageSmoothingEnabled = true;
            ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);

            rafRef.current = requestAnimationFrame(render);
        };

        rafRef.current = requestAnimationFrame(render);

        // Map mouse move
        let lastPos = null;
        const onMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (lastPos) {
                const dx = x - lastPos.x;
                const dy = y - lastPos.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > 0) {
                    addDensity(x, y, dist * 2);
                }
            } else {
                addDensity(x, y, 50);
            }
            lastPos = { x, y };
        };

        canvas.parentElement.addEventListener('mousemove', onMouseMove);

        return () => {
            window.removeEventListener('resize', resize);
            canvas.parentElement.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(rafRef.current);
        };
    }, [color, radius, dissipation]);
}
