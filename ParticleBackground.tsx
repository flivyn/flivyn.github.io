import React, { useRef, useEffect, useCallback } from 'react';

interface ParticleBackgroundProps {
    theme: 'light' | 'dark';
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ theme }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameId = useRef<number | null>(null);

    const matrixAnimation = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;

        const matrixChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}".split("");
        
        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);
        const drops: number[] = [];

        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        const trailColor = theme === 'dark' ? 'rgba(10, 16, 31, 0.2)' : 'rgba(241, 245, 249, 0.3)';
        const textColor = theme === 'dark' ? '#0d9488' : '#14b8a6'; // teal-600, teal-500

        const draw = () => {
            ctx.fillStyle = trailColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = textColor;
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i]++;
            }
        };
        
        let lastTime = 0;
        const fpsInterval = 1000 / 28; // approx 28 fps

        const animate = (timestamp: number) => {
            animationFrameId.current = requestAnimationFrame(animate);
            const elapsedTime = timestamp - lastTime;

            if (elapsedTime > fpsInterval) {
                lastTime = timestamp - (elapsedTime % fpsInterval);
                draw();
            }
        };

        animate(0);

    }, [theme]);

    useEffect(() => {
        const cleanup = () => {
             if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        }
        
        cleanup();
        matrixAnimation();
        
        const handleResize = () => {
            cleanup();
            matrixAnimation();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cleanup();
        };
    }, [matrixAnimation]);


    return <canvas ref={canvasRef} id="matrix-canvas" className="fixed top-0 left-0 w-full h-full -z-10" />;
};

export default React.memo(ParticleBackground);