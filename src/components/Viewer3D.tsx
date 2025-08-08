import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Grid, Text } from '@react-three/drei';
import * as THREE from 'three';
import { SimulationParams, SimulationResults, TubePosition } from '../types';
import ParticleFlow from './ParticleFlow';
import { getLampData } from '../data/lamps';
import { generateOptimizedTubePositions } from '../physics/tubePositioning';

interface Viewer3DProps {
  params: SimulationParams;
  results: SimulationResults | null;
  onTubePositionChange: (positions: TubePosition[]) => void;
  expanded?: boolean;
}

function Duct({ width, height, length }: { width: number; height: number; length: number }) {
  const w = width / 10;
  const h = height / 10;
  const l = length / 10;

  return (
    <group>
      <Box args={[w, 0.05, l]} position={[0, -h/2, 0]}>
        <meshStandardMaterial color="#334155" opacity={0.3} transparent />
      </Box>
      <Box args={[w, 0.05, l]} position={[0, h/2, 0]}>
        <meshStandardMaterial color="#334155" opacity={0.3} transparent />
      </Box>
      <Box args={[0.05, h, l]} position={[-w/2, 0, 0]}>
        <meshStandardMaterial color="#334155" opacity={0.3} transparent />
      </Box>
      <Box args={[0.05, h, l]} position={[w/2, 0, 0]}>
        <meshStandardMaterial color="#334155" opacity={0.3} transparent />
      </Box>
    </group>
  );
}

function UVCTube({ position, onDrag }: { position: TubePosition; onDrag?: (pos: TubePosition) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);

  useFrame((state) => {
    if (meshRef.current && hovered && !dragging) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <group position={[position.x / 10, position.y / 10, position.z / 10]}>
      <Cylinder
        ref={meshRef}
        args={[0.03, 0.03, 12]}
        rotation={[Math.PI / 2, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={() => setDragging(true)}
        onPointerUp={() => setDragging(false)}
      >
        <meshStandardMaterial 
          color={hovered ? "#818cf8" : "#8b5cf6"} 
          emissive="#8b5cf6" 
          emissiveIntensity={0.5}
        />
      </Cylinder>
      
      <pointLight 
        position={[0, 0, 0]} 
        color="#8b5cf6" 
        intensity={2} 
        distance={5}
      />
    </group>
  );
}

function DoseHeatmap({ results, width, height }: { results: SimulationResults; width: number; height: number }) {
  const geometry = new THREE.PlaneGeometry(width / 10, height / 10, 50, 50);
  const material = useRef<THREE.MeshStandardMaterial>(null);

  useEffect(() => {
    if (material.current && results.doseMap) {
      const colors = new Float32Array(geometry.attributes.position.count * 3);
      
      for (let i = 0; i < geometry.attributes.position.count; i++) {
        const dose = results.doseMap[Math.floor(i / 51)][i % 51];
        const normalized = Math.min(dose / results.statistics.maxDose, 1);
        
        colors[i * 3] = normalized;
        colors[i * 3 + 1] = 1 - normalized;
        colors[i * 3 + 2] = 0.5;
      }
      
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    }
  }, [results, geometry]);

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <meshStandardMaterial 
        ref={material}
        vertexColors
        opacity={0.7}
        transparent
      />
    </mesh>
  );
}

function Scene({ params, results, onTubePositionChange }: Viewer3DProps) {
  const { camera } = useThree();
  const [tubePositions, setTubePositions] = useState<TubePosition[]>([]);
  
  useEffect(() => {
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useEffect(() => {
    // Usar la función optimizada de posicionamiento
    const newPositions = generateOptimizedTubePositions(params);
    setTubePositions(newPositions);
    onTubePositionChange(newPositions);
  }, [params.numberOfTubes, params.ductWidth, params.ductHeight]);

  const lamp = getLampData(params.selectedLamp);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      <Duct 
        width={params.ductWidth} 
        height={params.ductHeight} 
        length={params.ductLength} 
      />
      
      {tubePositions.map((pos) => (
        <UVCTube 
          key={pos.id} 
          position={pos}
          onDrag={(newPos) => {
            const updated = tubePositions.map(p => 
              p.id === newPos.id ? newPos : p
            );
            onTubePositionChange(updated);
          }}
        />
      ))}
      
      {/* Partículas fluyendo */}
      <ParticleFlow
        ductWidth={params.ductWidth}
        ductHeight={params.ductHeight}
        ductLength={params.ductLength}
        airVelocity={params.airVelocity}
        tubePositions={tubePositions}
        lampPower={lamp.uvcOutput}
      />
      
      {/* Indicadores de flujo */}
      <Text
        position={[-params.ductLength/20 - 1, params.ductHeight/20 + 1, 0]}
        fontSize={0.3}
        color="#3b82f6"
      >
        ENTRADA →
      </Text>
      
      <Text
        position={[params.ductLength/20 + 1, params.ductHeight/20 + 1, 0]}
        fontSize={0.3}
        color="#ef4444"
      >
        SALIDA →
      </Text>
      
      <Grid 
        args={[20, 20]} 
        position={[0, -params.ductHeight/20 - 0.1, 0]}
        cellColor="#6b7280"
        sectionColor="#9ca3af"
      />
      
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={30}
      />
    </>
  );
}

export default function Viewer3D(props: Viewer3DProps) {
  const height = props.expanded ? "h-full" : "h-[500px]";
  
  return (
    <div className={`w-full ${height} rounded-lg overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800`}>
      <Canvas>
        <Scene {...props} />
      </Canvas>
    </div>
  );
}