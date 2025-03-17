import React, { useCallback } from 'react';
import Particles from '@tsparticles/react';
import type { Engine } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';

interface AIParticleEffectProps {
    rarity: string;
}

const AIParticleEffect: React.FC<AIParticleEffectProps> = ({ rarity }) => {
    const particleColors = {
        Legendary: ['#FFD700', '#FFA500', '#FF4500'],
        Epic: ['#9400D3', '#4B0082', '#8A2BE2'],
        Rare: ['#0000FF', '#000080', '#4169E1']
    };

    const colors = particleColors[rarity as keyof typeof particleColors] || ['#808080'];

    const particlesInit = useCallback(async (engine: Engine) => {
        await loadSlim(engine);
    }, []);

    return (
        <Particles
            id={`particles-${rarity}`}
            init={particlesInit}
            options={{
                fullScreen: { enable: false },
                fpsLimit: 120,
                particles: {
                    color: {
                        value: colors
                    },
                    links: {
                        color: colors[0],
                        distance: 150,
                        enable: true,
                        opacity: 0.5,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: "none",
                        random: false,
                        straight: false,
                        outModes: {
                            default: "bounce"
                        }
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 800
                        },
                        value: 50
                    },
                    opacity: {
                        value: 0.5
                    },
                    shape: {
                        type: "circle"
                    },
                    size: {
                        value: { min: 1, max: 5 }
                    }
                },
                detectRetina: true
            }}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none'
            }}
        />
    );
};

export default AIParticleEffect; 