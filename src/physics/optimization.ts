import { SimulationParams, TubePosition } from '../types';
import { calculateLongitudinalDose } from './longitudinalAnalysis';

interface OptimizationSettings {
  algorithm: string;
  populationSize: number;
  generations: number;
  mutationRate: number;
  objective: string;
}

export async function optimizeTubePositions(
  params: SimulationParams,
  settings: OptimizationSettings,
  onProgress: (progress: number, fitness: number) => void
): Promise<TubePosition[]> {
  switch (settings.algorithm) {
    case 'genetic':
      return await geneticAlgorithm(params, settings, onProgress);
    case 'pso':
      return await particleSwarmOptimization(params, settings, onProgress);
    case 'simulated':
      return await simulatedAnnealing(params, settings, onProgress);
    default:
      return await geneticAlgorithm(params, settings, onProgress);
  }
}

async function geneticAlgorithm(
  params: SimulationParams,
  settings: OptimizationSettings,
  onProgress: (progress: number, fitness: number) => void
): Promise<TubePosition[]> {
  const { populationSize, generations, mutationRate } = settings;
  
  let population = initializePopulation(populationSize, params);
  let bestIndividual = population[0];
  let bestFitness = -Infinity;

  for (let gen = 0; gen < generations; gen++) {
    const fitnessScores = await Promise.all(
      population.map(individual => evaluateFitness(individual, params, settings.objective))
    );
    
    const maxFitness = Math.max(...fitnessScores);
    const maxIndex = fitnessScores.indexOf(maxFitness);
    
    if (maxFitness > bestFitness) {
      bestFitness = maxFitness;
      bestIndividual = population[maxIndex];
    }
    
    onProgress((gen / generations) * 100, bestFitness);
    
    const parents = selection(population, fitnessScores);
    const offspring = crossover(parents, populationSize);
    population = mutate(offspring, mutationRate, params);
  }
  
  onProgress(100, bestFitness);
  return bestIndividual;
}

async function particleSwarmOptimization(
  params: SimulationParams,
  settings: OptimizationSettings,
  onProgress: (progress: number, fitness: number) => void
): Promise<TubePosition[]> {
  const swarmSize = settings.populationSize;
  const iterations = settings.generations;
  
  const particles = initializePopulation(swarmSize, params);
  const velocities = particles.map(() => 
    Array(params.numberOfTubes).fill(null).map(() => ({
      x: (Math.random() - 0.5) * 10,
      y: (Math.random() - 0.5) * 10
    }))
  );
  
  let personalBest = [...particles];
  let personalBestFitness = await Promise.all(
    particles.map(p => evaluateFitness(p, params, settings.objective))
  );
  
  let globalBestIndex = personalBestFitness.indexOf(Math.max(...personalBestFitness));
  let globalBest = personalBest[globalBestIndex];
  let globalBestFitness = personalBestFitness[globalBestIndex];
  
  const w = 0.7;
  const c1 = 1.5;
  const c2 = 1.5;
  
  for (let iter = 0; iter < iterations; iter++) {
    for (let i = 0; i < swarmSize; i++) {
      for (let j = 0; j < params.numberOfTubes; j++) {
        const r1 = Math.random();
        const r2 = Math.random();
        
        velocities[i][j].x = w * velocities[i][j].x +
          c1 * r1 * (personalBest[i][j].x - particles[i][j].x) +
          c2 * r2 * (globalBest[j].x - particles[i][j].x);
        
        velocities[i][j].y = w * velocities[i][j].y +
          c1 * r1 * (personalBest[i][j].y - particles[i][j].y) +
          c2 * r2 * (globalBest[j].y - particles[i][j].y);
        
        particles[i][j].x = Math.max(-params.ductWidth/2 + 5, 
          Math.min(params.ductWidth/2 - 5, particles[i][j].x + velocities[i][j].x));
        particles[i][j].y = Math.max(-params.ductHeight/2 + 5,
          Math.min(params.ductHeight/2 - 5, particles[i][j].y + velocities[i][j].y));
      }
      
      const fitness = await evaluateFitness(particles[i], params, settings.objective);
      
      if (fitness > personalBestFitness[i]) {
        personalBest[i] = [...particles[i]];
        personalBestFitness[i] = fitness;
        
        if (fitness > globalBestFitness) {
          globalBest = [...particles[i]];
          globalBestFitness = fitness;
        }
      }
    }
    
    onProgress((iter / iterations) * 100, globalBestFitness);
  }
  
  onProgress(100, globalBestFitness);
  return globalBest;
}

async function simulatedAnnealing(
  params: SimulationParams,
  settings: OptimizationSettings,
  onProgress: (progress: number, fitness: number) => void
): Promise<TubePosition[]> {
  let current = generateIndividual(params);
  let currentFitness = await evaluateFitness(current, params, settings.objective);
  
  let best = [...current];
  let bestFitness = currentFitness;
  
  const initialTemp = 100;
  const coolingRate = 0.995;
  let temperature = initialTemp;
  
  const maxIterations = settings.generations * settings.populationSize;
  
  for (let iter = 0; iter < maxIterations; iter++) {
    const neighbor = perturbSolution(current, temperature, params);
    const neighborFitness = await evaluateFitness(neighbor, params, settings.objective);
    
    const delta = neighborFitness - currentFitness;
    
    if (delta > 0 || Math.random() < Math.exp(delta / temperature)) {
      current = neighbor;
      currentFitness = neighborFitness;
      
      if (currentFitness > bestFitness) {
        best = [...current];
        bestFitness = currentFitness;
      }
    }
    
    temperature *= coolingRate;
    
    if (iter % 100 === 0) {
      onProgress((iter / maxIterations) * 100, bestFitness);
    }
  }
  
  onProgress(100, bestFitness);
  return best;
}

function initializePopulation(size: number, params: SimulationParams): TubePosition[][] {
  return Array(size).fill(null).map(() => generateIndividual(params));
}

function generateIndividual(params: SimulationParams): TubePosition[] {
  return Array(params.numberOfTubes).fill(null).map((_, i) => ({
    id: `tube-${i}`,
    x: (Math.random() - 0.5) * (params.ductWidth - 10),
    y: (Math.random() - 0.5) * (params.ductHeight - 10),
    z: 0
  }));
}

async function evaluateFitness(
  individual: TubePosition[],
  params: SimulationParams,
  objective: string
): Promise<number> {
  const simParams = { ...params, tubePositions: individual };
  const results = await calculateLongitudinalDose(simParams);
  
  const minSeparation = calculateMinSeparation(individual);
  if (minSeparation < 10) {
    return -1000;
  }
  
  switch (objective) {
    case 'uniformity':
      return results.statistics.uniformity * 100;
    case 'coverage':
      return results.statistics.coverage * 100;
    case 'efficiency':
      return results.efficiency;
    case 'balanced':
      return (
        results.statistics.uniformity * 30 +
        results.statistics.coverage * 40 +
        (results.statistics.minDose / params.targetDose) * 30
      );
    default:
      return results.statistics.uniformity * 100;
  }
}

function calculateMinSeparation(positions: TubePosition[]): number {
  let minDist = Infinity;
  
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const dist = Math.sqrt(
        Math.pow(positions[i].x - positions[j].x, 2) +
        Math.pow(positions[i].y - positions[j].y, 2)
      );
      minDist = Math.min(minDist, dist);
    }
  }
  
  return minDist;
}

function selection(population: TubePosition[][], fitness: number[]): TubePosition[][] {
  const selected: TubePosition[][] = [];
  const totalFitness = fitness.reduce((a, b) => a + b, 0);
  
  for (let i = 0; i < population.length / 2; i++) {
    const rand = Math.random() * totalFitness;
    let cumSum = 0;
    
    for (let j = 0; j < population.length; j++) {
      cumSum += fitness[j];
      if (cumSum >= rand) {
        selected.push(population[j]);
        break;
      }
    }
  }
  
  return selected;
}

function crossover(parents: TubePosition[][], targetSize: number): TubePosition[][] {
  const offspring: TubePosition[][] = [];
  
  while (offspring.length < targetSize) {
    const p1 = parents[Math.floor(Math.random() * parents.length)];
    const p2 = parents[Math.floor(Math.random() * parents.length)];
    
    const child: TubePosition[] = [];
    
    for (let i = 0; i < p1.length; i++) {
      if (Math.random() < 0.5) {
        child.push({ ...p1[i] });
      } else {
        child.push({ ...p2[i] });
      }
    }
    
    offspring.push(child);
  }
  
  return offspring;
}

function mutate(
  population: TubePosition[][],
  mutationRate: number,
  params: SimulationParams
): TubePosition[][] {
  return population.map(individual => {
    if (Math.random() < mutationRate) {
      const mutatedIndex = Math.floor(Math.random() * individual.length);
      individual[mutatedIndex] = {
        ...individual[mutatedIndex],
        x: (Math.random() - 0.5) * (params.ductWidth - 10),
        y: (Math.random() - 0.5) * (params.ductHeight - 10)
      };
    }
    return individual;
  });
}

function perturbSolution(
  solution: TubePosition[],
  temperature: number,
  params: SimulationParams
): TubePosition[] {
  const perturbed = [...solution];
  const index = Math.floor(Math.random() * perturbed.length);
  
  const maxDelta = temperature / 10;
  
  perturbed[index] = {
    ...perturbed[index],
    x: Math.max(-params.ductWidth/2 + 5,
      Math.min(params.ductWidth/2 - 5,
        perturbed[index].x + (Math.random() - 0.5) * maxDelta)),
    y: Math.max(-params.ductHeight/2 + 5,
      Math.min(params.ductHeight/2 - 5,
        perturbed[index].y + (Math.random() - 0.5) * maxDelta))
  };
  
  return perturbed;
}