import { SimulationParams, SimulationResults, TubePosition } from '../types';
import { getLampData } from '../data/lamps';

export async function calculateIrradiance(params: SimulationParams): Promise<SimulationResults> {
  const lamp = getLampData(params.selectedLamp);
  const gridResolution = 100;
  const doseMap: number[][] = [];
  
  const tubePositions = params.tubePositions.length > 0 
    ? params.tubePositions 
    : generateDefaultPositions(params);

  for (let i = 0; i < gridResolution; i++) {
    doseMap[i] = [];
    for (let j = 0; j < gridResolution; j++) {
      const x = (j / gridResolution) * params.ductWidth - params.ductWidth / 2;
      const y = (i / gridResolution) * params.ductHeight - params.ductHeight / 2;
      
      let totalIrradiance = 0;
      
      for (const tube of tubePositions) {
        const distance = calculateDistance(x, y, tube.x, tube.y);
        const irradiance = calculatePointIrradiance(
          lamp.uvcOutput,
          distance,
          params.reflectivity,
          params.temperature,
          params.humidity
        );
        totalIrradiance += irradiance;
      }
      
      const exposureTime = params.ductLength / (params.airVelocity * 100);
      const dose = totalIrradiance * exposureTime;
      doseMap[i][j] = dose;
    }
  }
  
  const exposureTime = params.ductLength / (params.airVelocity * 100);
  const statistics = calculateStatistics(doseMap, params.targetDose);
  const deadZones = findDeadZones(doseMap, params.targetDose * 0.8);
  const energyConsumption = calculateEnergyConsumption(
    tubePositions.length,
    lamp.power,
    exposureTime
  );
  const efficiency = calculateEfficiency(statistics.avgDose, energyConsumption);
  
  return {
    doseMap,
    statistics,
    exposureTime,
    energyConsumption,
    efficiency,
    deadZones
  };
}

function generateDefaultPositions(params: SimulationParams): TubePosition[] {
  const positions: TubePosition[] = [];
  const wallDistance = 6; // 6cm desde las paredes
  const { ductWidth, ductHeight, numberOfTubes } = params;
  
  // Lógica de posicionamiento según número de tubos:
  // 1 tubo: abajo
  // 2 tubos: izquierda, derecha
  // 3 tubos: abajo, izquierda, derecha
  // 4 tubos: uno por cada cara (abajo, arriba, izquierda, derecha)
  // 5+: distribuir por las caras de forma ordenada
  
  if (numberOfTubes === 1) {
    // Un tubo: en la parte inferior
    positions.push({
      id: 'tube-0',
      x: 0,
      y: -ductHeight/2 + wallDistance,
      z: 0
    });
  } else if (numberOfTubes === 2) {
    // Dos tubos: izquierda y derecha
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
    // Tres tubos: abajo, izquierda, derecha
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
    // Cuatro tubos: uno por cada cara
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
    // Más de 4 tubos: distribuir equitativamente por las caras
    const tubosPerSide = Math.ceil(numberOfTubes / 4);
    let tubeIndex = 0;
    
    // Cara inferior
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
    
    // Cara izquierda
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
    
    // Cara derecha
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
    
    // Cara superior
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

function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function calculatePointIrradiance(
  lampOutput: number,
  distance: number,
  reflectivity: number,
  temperature: number,
  humidity: number
): number {
  const baseIrradiance = (lampOutput * 1000) / (4 * Math.PI * Math.pow(distance + 1, 2));
  
  const reflectionFactor = 1 + reflectivity * 0.3;
  
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