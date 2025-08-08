import { useState } from 'react';
import ControlPanel from './components/ControlPanel';
import Viewer3D from './components/Viewer3D';
import ResultsDashboard from './components/ResultsDashboard';
import OptimizationEngine from './components/OptimizationEngine';
import { SimulationParams, SimulationResults, TubePosition } from './types';
import { calculateLongitudinalDose } from './physics/longitudinalAnalysis';
import { generateOptimizedTubePositions } from './physics/tubePositioning';
import { FiSettings, FiBarChart2, FiCpu, FiDownload, FiMaximize2, FiMinimize2 } from 'react-icons/fi';

function App() {
  const [activeTab, setActiveTab] = useState<'simulation' | 'results' | 'optimization'>('simulation');
  const [expandedView, setExpandedView] = useState(false);
  const [params, setParams] = useState<SimulationParams>({
    ductWidth: 50,
    ductHeight: 50,
    ductLength: 200,
    airVelocity: 2.0,
    targetDose: 100,
    numberOfTubes: 2,
    tubePositions: [],
    selectedLamp: 'TUV-31W',
    reflectivity: 0.3,
    temperature: 20,
    humidity: 50
  });

  const [results, setResults] = useState<SimulationResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleSimulate = async () => {
    setIsCalculating(true);
    try {
      // Asegurar que hay posiciones de tubos antes de simular
      const paramsWithPositions = params.tubePositions.length > 0 
        ? params 
        : {
            ...params,
            tubePositions: generateDefaultTubePositions(params)
          };
      
      const simulationResults = await calculateLongitudinalDose(paramsWithPositions);
      setResults(simulationResults);
      // No cambiar de pestaña, mantener en simulación
    } catch (error) {
      console.error('Error en simulación:', error);
      alert('Error al ejecutar la simulación. Ver consola para detalles.');
    } finally {
      setIsCalculating(false);
    }
  };

  const generateDefaultTubePositions = (params: SimulationParams): TubePosition[] => {
    return generateOptimizedTubePositions(params);
    /*
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
    */
  };

  const handleOptimize = async (optimizedPositions: TubePosition[]) => {
    setParams(prev => ({ ...prev, tubePositions: optimizedPositions }));
    await handleSimulate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Calculador UV-C Pro
              </h1>
              <p className="text-gray-300 text-sm mt-1">
                Simulación avanzada de desinfección UV-C
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab('simulation')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  activeTab === 'simulation' 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <FiSettings /> Simulación
              </button>
              <button 
                onClick={() => setActiveTab('results')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  activeTab === 'results' 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                disabled={!results}
              >
                <FiBarChart2 /> Resultados
              </button>
              <button 
                onClick={() => setActiveTab('optimization')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  activeTab === 'optimization' 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <FiCpu /> Optimización
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-fluid mx-auto px-4 py-4">
        {activeTab === 'simulation' && (
          <>
            {/* Vista expandida */}
            {expandedView ? (
              <div className="fixed inset-0 z-50 bg-black/90 p-8">
                <div className="h-full flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">
                      Visualización 3D del Ducto - Vista Expandida
                    </h2>
                    <button
                      onClick={() => setExpandedView(false)}
                      className="text-white hover:text-gray-300 transition-colors"
                    >
                      <FiMinimize2 size={24} />
                    </button>
                  </div>
                  <div className="flex-1">
                    <Viewer3D 
                      params={params} 
                      results={results}
                      onTubePositionChange={(positions) => 
                        setParams(prev => ({ ...prev, tubePositions: positions }))
                      }
                      expanded={true}
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {/* Vista normal */}
            <div className="grid grid-cols-12 gap-4">
              {/* Panel de Control - Izquierda */}
              <div className="col-span-3">
                <ControlPanel 
                  params={params} 
                  onParamsChange={setParams}
                  onSimulate={handleSimulate}
                  isCalculating={isCalculating}
                />
              </div>

              {/* Visualización 3D - Centro */}
              <div className="col-span-5">
                <div className="glass-panel p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-bold text-gray-800">
                      Visualización 3D del Ducto
                    </h2>
                    <button
                      onClick={() => setExpandedView(true)}
                      className="text-gray-600 hover:text-gray-800 transition-colors"
                      title="Expandir vista"
                    >
                      <FiMaximize2 size={20} />
                    </button>
                  </div>
                  <Viewer3D 
                    params={params} 
                    results={results}
                    onTubePositionChange={(positions) => 
                      setParams(prev => ({ ...prev, tubePositions: positions }))
                    }
                  />
                </div>
              </div>

              {/* Resultados - Derecha */}
              <div className="col-span-4">
              {results ? (
                <div className="space-y-4">
                  {/* Métricas principales */}
                  <div className="glass-panel p-4">
                    <h3 className="text-lg font-bold mb-3 text-gray-800">Métricas Principales</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Dosis Mínima</p>
                        <p className="text-xl font-bold text-red-600">{results.statistics.minDose.toFixed(1)} mJ/cm²</p>
                      </div>
                      <div className="bg-white/50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Dosis Promedio</p>
                        <p className="text-xl font-bold text-blue-600">{results.statistics.avgDose.toFixed(1)} mJ/cm²</p>
                      </div>
                      <div className="bg-white/50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Uniformidad</p>
                        <p className="text-xl font-bold text-purple-600">{(results.statistics.uniformity * 100).toFixed(1)}%</p>
                      </div>
                      <div className="bg-white/50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Cobertura</p>
                        <p className="text-xl font-bold text-green-600">{(results.statistics.coverage * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Mini Dashboard */}
                  <ResultsDashboard results={results} params={params} compact={true} />
                </div>
              ) : (
                <div className="glass-panel p-8 text-center">
                  <div className="text-gray-500">
                    <p className="text-lg mb-2">Sin resultados aún</p>
                    <p className="text-sm">Haz clic en "Simular" para ver los resultados</p>
                  </div>
                </div>
              )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'results' && results && (
          <div className="max-w-7xl mx-auto">
            <ResultsDashboard results={results} params={params} compact={false} />
          </div>
        )}

        {activeTab === 'optimization' && (
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ControlPanel 
                  params={params} 
                  onParamsChange={setParams}
                  onSimulate={handleSimulate}
                  isCalculating={isCalculating}
                />
              </div>
              <div className="lg:col-span-2">
                <OptimizationEngine 
                  params={params} 
                  onOptimize={handleOptimize}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {results && (
        <div className="fixed bottom-6 right-6">
          <button className="btn-primary flex items-center gap-2 shadow-2xl">
            <FiDownload /> Exportar Reporte
          </button>
        </div>
      )}
    </div>
  );
}

export default App;