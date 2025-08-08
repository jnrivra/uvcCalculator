import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TubePosition } from '../types';

interface ParticleFlowProps {
  ductWidth: number;
  ductHeight: number;
  ductLength: number;
  airVelocity: number;
  tubePositions: TubePosition[];
  lampPower: number;
}

export default function ParticleFlow({
  ductWidth,
  ductHeight,
  ductLength,
  airVelocity,
  tubePositions,
  lampPower
}: ParticleFlowProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 100;
  
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const doses = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      // Distribuir partículas aleatoriamente en la entrada del ducto
      positions[i * 3] = (Math.random() - 0.5) * ductWidth / 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * ductHeight / 10;
      positions[i * 3 + 2] = -ductLength / 20; // Inicio del ducto
      
      // Color inicial (azul = sin dosis)
      colors[i * 3] = 0;
      colors[i * 3 + 1] = 0;
      colors[i * 3 + 2] = 1;
      
      doses[i] = 0;
    }
    
    return { positions, colors, doses };
  }, [ductWidth, ductHeight, ductLength]);

  useFrame((state, delta) => {
    if (!particlesRef.current) return;
    
    const geometry = particlesRef.current.geometry;
    const positions = geometry.attributes.position.array as Float32Array;
    const colors = geometry.attributes.color.array as Float32Array;
    
    const velocityScale = airVelocity * delta;
    
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      
      // Mover partícula a lo largo del ducto
      positions[idx + 2] += velocityScale;
      
      // Si la partícula sale del ducto, reiniciarla
      if (positions[idx + 2] > ductLength / 20) {
        positions[idx] = (Math.random() - 0.5) * ductWidth / 10;
        positions[idx + 1] = (Math.random() - 0.5) * ductHeight / 10;
        positions[idx + 2] = -ductLength / 20;
        particles.doses[i] = 0;
        
        // Reset color
        colors[idx] = 0;
        colors[idx + 1] = 0;
        colors[idx + 2] = 1;
      } else {
        // Calcular dosis acumulada en esta posición
        let instantDose = 0;
        const particleX = positions[idx] * 10;
        const particleY = positions[idx + 1] * 10;
        
        for (const tube of tubePositions) {
          const distance = Math.sqrt(
            Math.pow(particleX - tube.x, 2) +
            Math.pow(particleY - tube.y, 2)
          );
          
          // Irradiancia instantánea
          const irradiance = (lampPower * 1000) / (4 * Math.PI * Math.pow(distance + 1, 2));
          instantDose += irradiance * delta;
        }
        
        particles.doses[i] += instantDose;
        
        // Actualizar color basado en dosis acumulada (azul -> verde -> amarillo -> rojo)
        const normalizedDose = Math.min(particles.doses[i] / 100, 1);
        
        if (normalizedDose < 0.33) {
          // Azul a verde
          const t = normalizedDose * 3;
          colors[idx] = 0;
          colors[idx + 1] = t;
          colors[idx + 2] = 1 - t;
        } else if (normalizedDose < 0.66) {
          // Verde a amarillo
          const t = (normalizedDose - 0.33) * 3;
          colors[idx] = t;
          colors[idx + 1] = 1;
          colors[idx + 2] = 0;
        } else {
          // Amarillo a rojo
          const t = (normalizedDose - 0.66) * 3;
          colors[idx] = 1;
          colors[idx + 1] = 1 - t;
          colors[idx + 2] = 0;
        }
      }
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} vertexColors />
    </points>
  );
}