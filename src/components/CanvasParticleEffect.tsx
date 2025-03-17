import React, { useEffect, useRef } from 'react';

interface Particle {
    x: number;
    y: number;
    dx: number;
    dy: number;
    radius: number;
    color: string;
}

interface CanvasParticleEffectProps {
    rarity: string;
}

const CanvasParticleEffect: React.FC<CanvasParticleEffectProps> = ({ rarity }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<Particle[]>([]);

    const getColors = (rarity: string) => {
        switch (rarity) {
            case 'Legendary':
                return ['#FFD700', '#FFA500', '#FF4500'];
            case 'Epic':
                return ['#9400D3', '#4B0082', '#8A2BE2'];
            case 'Rare':
                return ['#0000FF', '#000080', '#4169E1'];
            default:
                return ['#808080'];
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const colors = getColors(rarity);
        const particleCount = rarity === 'Legendary' ? 50 : rarity === 'Epic' ? 30 : 20;

        // Initialize particles
        particles.current = Array.from({ length: particleCount }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            dx: (Math.random() - 0.5) * 2,
            dy: (Math.random() - 0.5) * 2,
            radius: Math.random() * 3 + 1,
            color: colors[Math.floor(Math.random() * colors.length)]
        }));

        let animationFrameId: number;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.current.forEach(particle => {
                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();

                // Update position
                particle.x += particle.dx;
                particle.y += particle.dy;

                // Bounce off walls
                if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -1;
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [rarity]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none'
            }}
            width={300}
            height={300}
        />
    );
};

export default CanvasParticleEffect; 