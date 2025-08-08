import { useState } from 'react';
import { SimulationParams, TubePosition } from '../types';
import { optimizeTubePositions } from '../physics/optimization';
import { FiCpu, FiTarget, FiActivity, FiSettings } from 'react-icons/fi';

interface OptimizationEngineProps {
  params: SimulationParams;
  onOptimize: (positions: TubePosition[]) => void;
}

export default function OptimizationEngine({ params, onOptimize }: OptimizationEngineProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationSettings, setOptimizationSettings] = useState({
    algorithm: 'genetic',
    populationSize: 100,
    generations: 50,
    mutationRate: 0.1,
    objective: 'uniformity'
  });
  const [progress, setProgress] = useState(0);
  const [bestFitness, setBestFitness] = useState<number | null>(null);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setProgress(0);
    setBestFitness(null);

    try {
      const optimizedPositions = await optimizeTubePositions(
        params,
        optimizationSettings,
        (currentProgress, fitness) => {
          setProgress(currentProgress);
          setBestFitness(fitness);
        }
      );
      
      onOptimize(optimizedPositions);
    } catch (error) {
      console.error('Error en optimización:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="glass-panel p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FiCpu className="text-uvc-purple" />
          Motor de Optimización Automática
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Utiliza algoritmos avanzados para encontrar la configuración óptima de tubos UV-C
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Algoritmo de Optimización
            </label>
            <select
              value={optimizationSettings.algorithm}
              onChange={(e) => setOptimizationSettings({
                ...optimizationSettings,
                algorithm: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-uvc-purple"
              disabled={isOptimizing}
            >
              <option value="genetic">Algoritmo Genético</option>
              <option value="pso">Particle Swarm Optimization</option>
              <option value="simulated">Simulated Annealing</option>
              <option value="gradient">Gradient Descent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Objetivo de Optimización
            </label>
            <select
              value={optimizationSettings.objective}
              onChange={(e) => setOptimizationSettings({
                ...optimizationSettings,
                objective: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-uvc-purple"
              disabled={isOptimizing}
            >
              <option value="uniformity">Maximizar Uniformidad</option>
              <option value="coverage">Maximizar Cobertura</option>
              <option value="efficiency">Maximizar Eficiencia</option>
              <option value="balanced">Objetivo Balanceado</option>
            </select>
          </div>

          {optimizationSettings.algorithm === 'genetic' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tamaño de Población: {optimizationSettings.populationSize}
                </label>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={optimizationSettings.populationSize}
                  onChange={(e) => setOptimizationSettings({
                    ...optimizationSettings,
                    populationSize: parseInt(e.target.value)
                  })}
                  className="w-full accent-uvc-purple"
                  disabled={isOptimizing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Generaciones: {optimizationSettings.generations}
                </label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={optimizationSettings.generations}
                  onChange={(e) => setOptimizationSettings({
                    ...optimizationSettings,
                    generations: parseInt(e.target.value)
                  })}
                  className="w-full accent-uvc-purple"
                  disabled={isOptimizing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tasa de Mutación: {(optimizationSettings.mutationRate * 100).toFixed(0)}%
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={optimizationSettings.mutationRate * 100}
                  onChange={(e) => setOptimizationSettings({
                    ...optimizationSettings,
                    mutationRate: parseInt(e.target.value) / 100
                  })}
                  className="w-full accent-uvc-purple"
                  disabled={isOptimizing}
                />
              </div>
            </>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FiTarget />
              Parámetros Objetivo
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Dosis Objetivo:</span>
                <span className="font-medium">{params.targetDose} mJ/cm²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Número de Tubos:</span>
                <span className="font-medium">{params.numberOfTubes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Velocidad del Aire:</span>
                <span className="font-medium">{params.airVelocity} m/s</span>
              </div>
            </div>
          </div>

          {isOptimizing && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FiActivity className="animate-pulse" />
                Progreso de Optimización
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progreso</span>
                    <span className="font-medium">{progress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-uvc-purple to-uvc-blue h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                {bestFitness !== null && (
                  <div className="text-sm">
                    <span className="text-gray-600">Mejor Fitness:</span>
                    <span className="font-medium ml-2">{bestFitness.toFixed(4)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-purple-800 mb-2 flex items-center gap-2">
              <FiSettings />
              Restricciones
            </h3>
            <ul className="text-xs text-purple-700 space-y-1">
              <li>• Tubos no pueden superponerse</li>
              <li>• Distancia mínima a paredes: 5 cm</li>
              <li>• Espaciado mínimo entre tubos: 10 cm</li>
              <li>• Posiciones limitadas al área del ducto</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleOptimize}
          disabled={isOptimizing}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          {isOptimizing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Optimizando... ({progress.toFixed(0)}%)
            </>
          ) : (
            <>
              <FiCpu />
              Iniciar Optimización
            </>
          )}
        </button>
      </div>

      {!isOptimizing && bestFitness !== null && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <span className="font-semibold">✓ Optimización completada</span>
            <br />
            Fitness final: {bestFitness.toFixed(4)}
          </p>
        </div>
      )}
    </div>
  );
}