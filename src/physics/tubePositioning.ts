import { TubePosition, SimulationParams } from '../types';

/**
 * Genera posiciones optimizadas de tubos UV-C según el número de tubos
 * Principios de diseño:
 * - 1 tubo: inferior (máxima exposición por gravedad de partículas)
 * - 2 tubos: laterales (cobertura uniforme)
 * - 3 tubos: inferior + laterales
 * - 4 tubos: uno por cara (máxima uniformidad)
 * - 5+ tubos: distribución balanceada con al menos 1 arriba siempre
 */
export function generateOptimizedTubePositions(params: SimulationParams): TubePosition[] {
  const positions: TubePosition[] = [];
  const wallDistance = 6; // 6cm desde las paredes según especificación
  const { ductWidth, ductHeight, numberOfTubes } = params;
  
  if (numberOfTubes === 1) {
    // Un tubo: en la parte inferior (máxima eficiencia)
    positions.push({
      id: 'tube-0',
      x: 0,
      y: -ductHeight/2 + wallDistance,
      z: 0
    });
  } else if (numberOfTubes === 2) {
    // Dos tubos: laterales para cobertura uniforme
    positions.push({
      id: 'tube-0',
      x: -ductWidth/2 + wallDistance,
      y: 0,
      z: 0
    });
    positions.push({
      id: 'tube-1',
      x: ductWidth/2 - wallDistance,
      y: 0,
      z: 0
    });
  } else if (numberOfTubes === 3) {
    // Tres tubos: triángulo (abajo + laterales)
    positions.push({
      id: 'tube-0',
      x: 0,
      y: -ductHeight/2 + wallDistance,
      z: 0
    });
    positions.push({
      id: 'tube-1',
      x: -ductWidth/2 + wallDistance,
      y: 0,
      z: 0
    });
    positions.push({
      id: 'tube-2',
      x: ductWidth/2 - wallDistance,
      y: 0,
      z: 0
    });
  } else if (numberOfTubes === 4) {
    // Cuatro tubos: diamante perfecto (uno por cara)
    positions.push({
      id: 'tube-0',
      x: 0,
      y: -ductHeight/2 + wallDistance,
      z: 0
    });
    positions.push({
      id: 'tube-1',
      x: 0,
      y: ductHeight/2 - wallDistance,
      z: 0
    });
    positions.push({
      id: 'tube-2',
      x: -ductWidth/2 + wallDistance,
      y: 0,
      z: 0
    });
    positions.push({
      id: 'tube-3',
      x: ductWidth/2 - wallDistance,
      y: 0,
      z: 0
    });
  } else if (numberOfTubes === 5) {
    // 5 tubos: 2 abajo, 1 arriba, 2 laterales
    positions.push({
      id: 'tube-0',
      x: -ductWidth/4,
      y: -ductHeight/2 + wallDistance,
      z: 0
    });
    positions.push({
      id: 'tube-1',
      x: ductWidth/4,
      y: -ductHeight/2 + wallDistance,
      z: 0
    });
    positions.push({
      id: 'tube-2',
      x: 0,
      y: ductHeight/2 - wallDistance,
      z: 0
    });
    positions.push({
      id: 'tube-3',
      x: -ductWidth/2 + wallDistance,
      y: 0,
      z: 0
    });
    positions.push({
      id: 'tube-4',
      x: ductWidth/2 - wallDistance,
      y: 0,
      z: 0
    });
  } else if (numberOfTubes === 6) {
    // 6 tubos: 2 por arriba, 2 por abajo, 1 por cada lado
    positions.push({
      id: 'tube-0',
      x: -ductWidth/4,
      y: -ductHeight/2 + wallDistance,
      z: 0
    });
    positions.push({
      id: 'tube-1',
      x: ductWidth/4,
      y: -ductHeight/2 + wallDistance,
      z: 0
    });
    positions.push({
      id: 'tube-2',
      x: -ductWidth/4,
      y: ductHeight/2 - wallDistance,
      z: 0
    });
    positions.push({
      id: 'tube-3',
      x: ductWidth/4,
      y: ductHeight/2 - wallDistance,
      z: 0
    });
    positions.push({
      id: 'tube-4',
      x: -ductWidth/2 + wallDistance,
      y: 0,
      z: 0
    });
    positions.push({
      id: 'tube-5',
      x: ductWidth/2 - wallDistance,
      y: 0,
      z: 0
    });
  } else if (numberOfTubes === 7) {
    // 7 tubos: 2 arriba, 2 abajo, 2 laterales, 1 centro
    positions.push({
      id: 'tube-0',
      x: -ductWidth/4,
      y: -ductHeight/2 + wallDistance,
      z: 0
    });
    positions.push({
      id: 'tube-1',
      x: ductWidth/4,
      y: -ductHeight/2 + wallDistance,
      z: 0
    });
    positions.push({
      id: 'tube-2',
      x: -ductWidth/4,
      y: ductHeight/2 - wallDistance,
      z: 0
    });
    positions.push({
      id: 'tube-3',
      x: ductWidth/4,
      y: ductHeight/2 - wallDistance,
      z: 0
    });
    positions.push({
      id: 'tube-4',
      x: -ductWidth/2 + wallDistance,
      y: 0,
      z: 0
    });
    positions.push({
      id: 'tube-5',
      x: ductWidth/2 - wallDistance,
      y: 0,
      z: 0
    });
    positions.push({
      id: 'tube-6',
      x: 0,
      y: 0,
      z: 0
    });
  } else if (numberOfTubes === 8) {
    // 8 tubos: 2 por cara
    const sides = ['bottom', 'top', 'left', 'right'];
    let tubeIndex = 0;
    
    // 2 abajo
    for (let i = 0; i < 2; i++) {
      positions.push({
        id: `tube-${tubeIndex++}`,
        x: -ductWidth/4 + (i * ductWidth/2),
        y: -ductHeight/2 + wallDistance,
        z: 0
      });
    }
    
    // 2 arriba
    for (let i = 0; i < 2; i++) {
      positions.push({
        id: `tube-${tubeIndex++}`,
        x: -ductWidth/4 + (i * ductWidth/2),
        y: ductHeight/2 - wallDistance,
        z: 0
      });
    }
    
    // 2 izquierda
    for (let i = 0; i < 2; i++) {
      positions.push({
        id: `tube-${tubeIndex++}`,
        x: -ductWidth/2 + wallDistance,
        y: -ductHeight/4 + (i * ductHeight/2),
        z: 0
      });
    }
    
    // 2 derecha
    for (let i = 0; i < 2; i++) {
      positions.push({
        id: `tube-${tubeIndex++}`,
        x: ductWidth/2 - wallDistance,
        y: -ductHeight/4 + (i * ductHeight/2),
        z: 0
      });
    }
  } else {
    // Más de 8 tubos: distribución uniforme con garantía de cobertura superior
    let tubeIndex = 0;
    
    // Calcular distribución balanceada
    const minTopTubes = Math.max(2, Math.floor(numberOfTubes / 5)); // Al menos 20% arriba
    const remainingTubes = numberOfTubes - minTopTubes;
    
    // Distribuir el resto
    const bottomCount = Math.ceil(remainingTubes * 0.4); // 40% abajo
    const leftCount = Math.floor(remainingTubes * 0.3); // 30% izquierda
    const rightCount = remainingTubes - bottomCount - leftCount; // resto a la derecha
    
    // Tubos inferiores
    for (let i = 0; i < bottomCount; i++) {
      const spacing = ductWidth / (bottomCount + 1);
      positions.push({
        id: `tube-${tubeIndex++}`,
        x: -ductWidth/2 + spacing * (i + 1),
        y: -ductHeight/2 + wallDistance,
        z: 0
      });
    }
    
    // Tubos superiores (garantizados)
    for (let i = 0; i < minTopTubes; i++) {
      const spacing = ductWidth / (minTopTubes + 1);
      positions.push({
        id: `tube-${tubeIndex++}`,
        x: -ductWidth/2 + spacing * (i + 1),
        y: ductHeight/2 - wallDistance,
        z: 0
      });
    }
    
    // Tubos izquierdos
    for (let i = 0; i < leftCount; i++) {
      const spacing = ductHeight / (leftCount + 1);
      positions.push({
        id: `tube-${tubeIndex++}`,
        x: -ductWidth/2 + wallDistance,
        y: -ductHeight/2 + spacing * (i + 1),
        z: 0
      });
    }
    
    // Tubos derechos
    for (let i = 0; i < rightCount; i++) {
      const spacing = ductHeight / (rightCount + 1);
      positions.push({
        id: `tube-${tubeIndex++}`,
        x: ductWidth/2 - wallDistance,
        y: -ductHeight/2 + spacing * (i + 1),
        z: 0
      });
    }
  }
  
  return positions;
}