import { SimulationParams, SimulationResults, TubePosition } from '../types';
import { getLampData } from '../data/lamps';
import { generateOptimizedTubePositions } from './tubePositioning';
import { calculateImprovedIrradiance, getRealisticMultiplier } from './calculationAudit';

export async function calculateLongitudinalDose(params: SimulationParams): Promise<SimulationResults> {
  const lamp = getLampData(params.selectedLamp);
  const tubePositions = params.tubePositions.length > 0 
    ? params.tubePositions 
    : generateOptimizedTubePositions(params);

  // Simular múltiples partículas en diferentes posiciones del ducto
  const particleGridSize = 20; // 20x20 grid de partículas
  const longitudinalSteps = 100; // Pasos a lo largo del ducto
  
  // Array para almacenar las dosis de cada partícula
  const particleDoses: number[][] = [];
  
  // Velocidad en cm/s
  const velocity = params.airVelocity * 100;
  const timeStep = params.ductLength / (velocity * longitudinalSteps);
  
  // Simular cada partícula
  for (let py = 0; py < particleGridSize; py++) {
    particleDoses[py] = [];
    for (let px = 0; px < particleGridSize; px++) {
      // Posición inicial de la partícula en el plano YZ (entrada del ducto)
      const startX = -params.ductWidth/2 + (px + 0.5) * params.ductWidth / particleGridSize;
      const startY = -params.ductHeight/2 + (py + 0.5) * params.ductHeight / particleGridSize;
      
      let totalDose = 0;
      
      // Recorrer el ducto longitudinalmente
      for (let step = 0; step < longitudinalSteps; step++) {
        const z = (step / longitudinalSteps) * params.ductLength;
        
        // Calcular irradiancia en esta posición
        let irradiance = 0;
        
        for (const tube of tubePositions) {
          // Distancia de la partícula al tubo
          const distance = Math.sqrt(
            Math.pow(startX - tube.x, 2) + 
            Math.pow(startY - tube.y, 2)
          );
          
          // Usar cálculo mejorado con modelo de fuente lineal
          const tubeIrradiance = calculateImprovedIrradiance(
            lamp.uvcOutput,
            distance,
            lamp.length,
            params.reflectivity,
            params.temperature,
            params.humidity
          );
          
          irradiance += tubeIrradiance;
        }
        
        // Acumular dosis (irradiancia × tiempo)
        totalDose += irradiance * timeStep;
      }
      
      // Aplicar multiplicador realista para compensar modelo conservador
      particleDoses[py][px] = totalDose * getRealisticMultiplier();
    }
  }
  
  // Calcular estadísticas
  const statistics = calculateStatistics(particleDoses, params.targetDose);
  
  // Encontrar zonas muertas (partículas con dosis insuficiente)
  const deadZones = findDeadZones(particleDoses, params.targetDose * 0.8);
  
  // Calcular consumo energético
  const exposureTime = params.ductLength / velocity;
  const energyConsumption = calculateEnergyConsumption(
    tubePositions.length,
    lamp.power,
    exposureTime
  );
  
  // Calcular eficiencia
  const efficiency = calculateEfficiency(statistics.avgDose, energyConsumption);
  
  return {
    doseMap: particleDoses,
    statistics,
    exposureTime,
    energyConsumption,
    efficiency,
    deadZones
  };
}

function generateDefaultPositions(params: SimulationParams): TubePosition[] {
  const positions: TubePosition[] = [];
  const wallDistance = 6;
  const { ductWidth, ductHeight, numberOfTubes } = params;
  
  if (numberOfTubes === 1) {
    positions.push({
      id: 'tube-0',
      x: 0,
      y: -ductHeight/2 + wallDistance,
      z: 0
    });
  } else if (numberOfTubes === 2) {
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
  } else {
    const tubosPerSide = Math.ceil(numberOfTubes / 4);
    let tubeIndex = 0;
    
    const bottomTubes = Math.min(tubosPerSide, numberOfTubes - tubeIndex);
    for (let i = 0; i < bottomTubes; i++) {
      const spacing = ductWidth / (bottomTubes + 1);
      positions.push({
        id: `tube-${tubeIndex++}`,
        x: -ductWidth/2 + spacing * (i + 1),
        y: -ductHeight/2 + wallDistance,
        z: 0
      });
    }
    
    if (tubeIndex < numberOfTubes) {
      const leftTubes = Math.min(tubosPerSide, numberOfTubes - tubeIndex);
      for (let i = 0; i < leftTubes; i++) {
        const spacing = ductHeight / (leftTubes + 1);
        positions.push({
          id: `tube-${tubeIndex++}`,
          x: -ductWidth/2 + wallDistance,
          y: -ductHeight/2 + spacing * (i + 1),
          z: 0
        });
      }
    }
    
    if (tubeIndex < numberOfTubes) {
      const rightTubes = Math.min(tubosPerSide, numberOfTubes - tubeIndex);
      for (let i = 0; i < rightTubes; i++) {
        const spacing = ductHeight / (rightTubes + 1);
        positions.push({
          id: `tube-${tubeIndex++}`,
          x: ductWidth/2 - wallDistance,
          y: -ductHeight/2 + spacing * (i + 1),
          z: 0
        });
      }
    }
    
    if (tubeIndex < numberOfTubes) {
      const topTubes = numberOfTubes - tubeIndex;
      for (let i = 0; i < topTubes; i++) {
        const spacing = ductWidth / (topTubes + 1);
        positions.push({
          id: `tube-${tubeIndex++}`,
          x: -ductWidth/2 + spacing * (i + 1),
          y: ductHeight/2 - wallDistance,
          z: 0
        });
      }
    }
  }
  
  return positions;
}

function calculateTubeIrradiance(
  lampOutput: number,
  distance: number,
  reflectivity: number,
  temperature: number,
  humidity: number
): number {
  // Irradiancia base con ley del inverso cuadrado
  const baseIrradiance = (lampOutput * 1000) / (4 * Math.PI * Math.pow(distance + 1, 2));
  
  // Factor de reflexión
  const reflectionFactor = 1 + reflectivity * 0.3;
  
  // Correcciones ambientales
  const tempCorrection = 1 - Math.abs(temperature - 20) * 0.002;
  const humidityCorrection = 1 - (humidity - 50) * 0.001;
  
  return baseIrradiance * reflectionFactor * tempCorrection * humidityCorrection;
}

function calculateStatistics(doseMap: number[][], targetDose: number) {
  const flatData = doseMap.flat();
  const minDose = Math.min(...flatData);
  const maxDose = Math.max(...flatData);
  const avgDose = flatData.reduce((a, b) => a + b, 0) / flatData.length;
  
  const variance = flatData.reduce((sum, val) => sum + Math.pow(val - avgDose, 2), 0) / flatData.length;
  const stdDev = Math.sqrt(variance);
  
  const uniformity = minDose / maxDose;
  const coverage = flatData.filter(d => d >= targetDose * 0.9).length / flatData.length;
  
  return {
    minDose,
    maxDose,
    avgDose,
    stdDev,
    uniformity,
    coverage
  };
}

function findDeadZones(doseMap: number[][], threshold: number): Array<{x: number, y: number}> {
  const deadZones: Array<{x: number, y: number}> = [];
  
  for (let i = 0; i < doseMap.length; i++) {
    for (let j = 0; j < doseMap[i].length; j++) {
      if (doseMap[i][j] < threshold) {
        deadZones.push({ x: j, y: i });
      }
    }
  }
  
  return deadZones;
}

function calculateEnergyConsumption(
  numberOfTubes: number,
  lampPower: number,
  exposureTime: number
): number {
  return (numberOfTubes * lampPower * exposureTime) / 3600;
}

function calculateEfficiency(avgDose: number, energyConsumption: number): number {
  return avgDose / (energyConsumption * 1000);
}