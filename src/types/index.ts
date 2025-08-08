export interface TubePosition {
  id: string;
  x: number;
  y: number;
  z: number;
}

export interface SimulationParams {
  ductWidth: number;
  ductHeight: number;
  ductLength: number;
  airVelocity: number;
  targetDose: number;
  numberOfTubes: number;
  tubePositions: TubePosition[];
  selectedLamp: string;
  reflectivity: number;
  temperature: number;
  humidity: number;
}

export interface SimulationResults {
  doseMap: number[][];
  statistics: {
    minDose: number;
    maxDose: number;
    avgDose: number;
    stdDev: number;
    uniformity: number;
    coverage: number;
  };
  exposureTime: number;
  energyConsumption: number;
  efficiency: number;
  deadZones: Array<{x: number, y: number}>;
}

export interface LampData {
  id: string;
  model: string;
  manufacturer: string;
  power: number;
  uvcOutput: number;
  length: number;
  diameter: number;
  lifetime: number;
  price: number;
  efficiency: number;
  spectrum: number;
  degradationRate: number;
}