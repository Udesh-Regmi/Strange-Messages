import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Sparkles } from 'lucide-react';

interface Particle {
  id: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  speed: number;
  direction: number;
  type: 'balloon' | 'confetti' | 'spark';
  color: string;
  opacity: number;
  emoji?: string;
}

interface CrackerParticle extends Particle {
  life: number;
  maxLife: number;
  velocityY: number;
  gravity: number;
}

interface FloatingDecorationsProps {
  density?: number; // Number of particles per 1000px²
  speed?: number; // Base animation speed multiplier
  disableConfetti?: boolean;
  disableBalloons?: boolean;
  disableCrackers?: boolean;
  emojis?: string[]; // Added this to pass emojis from parent
}

const CONFETTI_COLORS = [
    '#FF69B4', '#FFD700', '#87CEEB', '#98FB98', '#DDA0DD', '#F0E68C', 
    '#FF4500', '#32CD32', '#8A2BE2', '#00FFFF', '#DC143C', '#20B2AA',
    '#FF6347', '#4169E1', '#FF8C00', '#00FA9A', '#BA55D3', '#FF1493',
    '#ADFF2F', '#00CED1', '#9932CC', '#40E0D0', '#FF00FF', '#7B68EE',
    '#F4A460', '#4682B4', '#FFB6C1', '#FFDAB9', '#EE82EE', '#CD5C5C',
    '#FA8072', '#B0E0E6', '#DA70D6', '#1E90FF', '#6A5ACD', '#FFE4B5',
    '#48D1CC', '#FAEBD7'
];

const generateId = (): string => Math.random().toString(36).substr(2, 9);

const useAnimationFrame = (callback: () => void) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      callback();
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [callback]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);
};

const FloatingDecorations: React.FC<FloatingDecorationsProps> = ({
  density = 1,
  speed = 1,
  disableConfetti = false,
  disableBalloons = false,
  disableCrackers = false,
  emojis = ['🎈', '🎊', '🎉', '🎂','🥳', '🎀'], // Default emojis if none are passed
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [crackerParticles, setCrackerParticles] = useState<CrackerParticle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);

  // Initialize particles based on screen size and emojis passed via props
  const initializeParticles = useCallback(() => {
    if (!containerRef.current) return;
    
    const { width, height } = containerRef.current.getBoundingClientRect();
    const area = width * height;
    const particleCount = Math.floor((area / 1000000) * density * 200);
    
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      if (!disableBalloons && Math.random() < 0.3) {
        newParticles.push({
          id: generateId(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          scale: 0.5 + Math.random() * 0.5,
          rotation: Math.random() * 360,
          speed: (0.2 + Math.random() * 0.3) * speed,
          direction: Math.random() * 360,
          type: 'balloon',
          color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          opacity: 0.8 + Math.random() * 0.2,
          emoji: emojis[Math.floor(Math.random() * emojis.length)] // Use passed emojis here
        });
      }
      
      if (!disableConfetti) {
        newParticles.push({
          id: generateId(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          scale: 0.2 + Math.random() * 0.3,
          rotation: Math.random() * 360,
          speed: (0.3 + Math.random() * 0.4) * speed,
          direction: Math.random() * 360,
          type: 'confetti',
          color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          opacity: 0.7 + Math.random() * 0.3
        });
      }
    }
    
    setParticles(newParticles);
  }, [density, speed, disableBalloons, disableConfetti, emojis]);

  // Create cracker explosion
  const createCrackerExplosion = useCallback(() => {
    if (disableCrackers) return;
    
    const explosionX = 20 + Math.random() * 60;
    const explosionY = 50 + Math.random() * 30;
    
    const newParticles: CrackerParticle[] = [];
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 2 + Math.random() * 2;
      
      newParticles.push({
        id: generateId(),
        x: explosionX,
        y: explosionY,
        scale: 0.2 + Math.random() * 0.3,
        rotation: Math.random() * 360,
        speed: speed * speed,
        direction: angle * (180 / Math.PI),
        type: 'spark',
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        opacity: 1,
        life: 100,
        maxLife: 100,
        velocityY: -5 - Math.random() * 5,
        gravity: 0.1 + Math.random() * 0.1
      });
    }
    
    setCrackerParticles(prev => [...prev, ...newParticles]);
  }, [disableCrackers]);

  // Update particle positions
  const updateParticles = useCallback(() => {
    setParticles(prev => prev.map(particle => {
      let newX = particle.x + Math.cos(particle.direction * Math.PI / 180) * particle.speed;
      let newY = particle.y + Math.sin(particle.direction * Math.PI / 180) * particle.speed;
      
      if (newX > 100) newX = 0;
      if (newX < 0) newX = 100;
      if (newY > 100) newY = 0;
      if (newY < 0) newY = 100;
      
      return {
        ...particle,
        x: newX,
        y: newY,
        rotation: particle.rotation + particle.speed
      };
    }));

    setCrackerParticles(prev => prev
      .map(particle => ({
        ...particle,
        x: particle.x + Math.cos(particle.direction * Math.PI / 180) * particle.speed,
        y: particle.y + Math.sin(particle.direction * Math.PI / 180) * particle.speed + particle.velocityY,
        velocityY: particle.velocityY + particle.gravity,
        life: particle.life - 1,
        opacity: particle.life / particle.maxLife
      }))
      .filter(particle => particle.life > 0)
    );
  }, []);

  useEffect(() => {
    if (!isInitializedRef.current) {
      initializeParticles();
      isInitializedRef.current = true;
    }
  }, [initializeParticles]);

  useEffect(() => {
    if (disableCrackers) return;
    const interval = setInterval(() => {
      createCrackerExplosion();
    }, 3000);
    return () => clearInterval(interval);
  }, [createCrackerExplosion, disableCrackers]);

  useAnimationFrame(updateParticles);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Regular particles (balloons and confetti) */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute transition-transform duration-100 ease-linear"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`,
            opacity: particle.opacity,
            color: particle.color,
          }}
        >
          {particle.type === 'balloon' ? (
            <span className="text-2xl">{particle.emoji}</span>
          ) : (
            <div
              className="w-2 h-2 rounded-sm"
              style={{ backgroundColor: particle.color }}
            />
          )}
        </div>
      ))}

      {/* Cracker particles */}
      {crackerParticles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            transform: `scale(${particle.scale})`,
          }}
        />
      ))}
      <Sparkles className='absolute w-1 h-1 text-blue-800 text-6xl' />
      <Sparkles className='absolute w-1 h-1 text-red-800 text-6xl' />
      <Sparkles className='absolute w-1 h-1 text-indigo-800 text-6xl' />
      <Sparkles className='absolute w-1 h-1 text-green-800 text-6xl' />
      <Sparkles className='absolute w-1 h-1 text-zinc-800 text-6xl' />
      <Sparkles className='absolute w-1 h-1 text-gray-800 text-6xl' />
    </div>
  );
};

export default FloatingDecorations;
