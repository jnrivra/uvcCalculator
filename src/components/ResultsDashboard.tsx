import { SimulationParams, SimulationResults } from '../types';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { FiCheckCircle, FiAlertTriangle, FiTrendingUp, FiZap } from 'react-icons/fi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface ResultsDashboardProps {
  results: SimulationResults;
  params: SimulationParams;
  compact?: boolean;
}

export default function ResultsDashboard({ results, params, compact = false }: ResultsDashboardProps) {
  const isTargetMet = results.statistics.minDose >= params.targetDose * 0.9;
  
  const distributionData = {
    labels: ['< 50%', '50-75%', '75-90%', '90-110%', '> 110%'],
    datasets: [{
      label: 'Distribución de Dosis',
      data: calculateDistribution(results.doseMap, params.targetDose),
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)'
      ]
    }]
  };

  const efficiencyData = {
    labels: ['Eficiencia UV-C'],
    datasets: [{
      data: [results.efficiency, 100 - results.efficiency],
      backgroundColor: ['#8b5cf6', '#e5e7eb'],
      borderWidth: 0
    }]
  };

  const crossSectionData = generateCrossSectionData(results.doseMap);

  if (compact) {
    // Vista compacta para panel lateral
    return (
      <div className="space-y-3">
        <div className="glass-panel p-4">
          <h3 className="text-sm font-bold mb-3 text-gray-800">Distribución de Dosis</h3>
          <div className="h-48">
            <Bar data={distributionData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Área (%)',
                    font: { size: 10 }
                  }
                }
              }
            }} />
          </div>
        </div>

        <div className="glass-panel p-4">
          <h3 className="text-sm font-bold mb-3 text-gray-800">Perfil Longitudinal</h3>
          <div className="h-48">
            <Line data={generateLongitudinalProfile(results, params)} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { 
                  display: true,
                  position: 'bottom',
                  labels: { font: { size: 9 } }
                }
              },
              scales: {
                x: {
                  title: {
                    display: false
                  }
                },
                y: {
                  title: {
                    display: true,
                    text: 'Dosis (mJ/cm²)',
                    font: { size: 10 }
                  }
                }
              }
            }} />
          </div>
        </div>

        <div className="glass-panel p-4">
          <h3 className="text-sm font-bold mb-2 text-gray-800">Detalles</h3>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Tiempo exposición:</span>
              <span className="font-semibold">{results.exposureTime.toFixed(2)}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Consumo energético:</span>
              <span className="font-semibold">{results.energyConsumption.toFixed(3)} kWh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Zonas muertas:</span>
              <span className="font-semibold">{results.deadZones.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Eficiencia UV-C:</span>
              <span className="font-semibold">{results.efficiency.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {!isTargetMet && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              ⚠️ Dosis objetivo no alcanzada. Considera aumentar tubos o reducir velocidad.
            </p>
          </div>
        )}
      </div>
    );
  }

  // Vista completa original
  return (
    <div className="space-y-6">
      <div className="glass-panel p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Resultados de la Simulación
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Dosis Mínima"
            value={`${results.statistics.minDose.toFixed(1)} mJ/cm²`}
            icon={<FiAlertTriangle className={results.statistics.minDose < params.targetDose ? 'text-red-500' : 'text-green-500'} />}
            status={results.statistics.minDose >= params.targetDose ? 'success' : 'warning'}
          />
          <StatCard
            title="Dosis Promedio"
            value={`${results.statistics.avgDose.toFixed(1)} mJ/cm²`}
            icon={<FiTrendingUp className="text-blue-500" />}
            status="info"
          />
          <StatCard
            title="Uniformidad"
            value={`${(results.statistics.uniformity * 100).toFixed(1)}%`}
            icon={<FiCheckCircle className={results.statistics.uniformity > 0.7 ? 'text-green-500' : 'text-yellow-500'} />}
            status={results.statistics.uniformity > 0.7 ? 'success' : 'warning'}
          />
          <StatCard
            title="Cobertura"
            value={`${(results.statistics.coverage * 100).toFixed(1)}%`}
            icon={<FiZap className="text-purple-500" />}
            status={results.statistics.coverage > 0.9 ? 'success' : 'warning'}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Distribución de Dosis
            </h3>
            <Bar data={distributionData} options={{
              responsive: true,
              plugins: {
                legend: { display: false }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Área (%)'
                  }
                }
              }
            }} />
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Eficiencia Energética
            </h3>
            <div className="flex items-center justify-center">
              <div className="w-48">
                <Doughnut data={efficiencyData} options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.parsed.toFixed(1)}%`
                      }
                    }
                  }
                }} />
              </div>
            </div>
            <div className="text-center mt-4">
              <p className="text-2xl font-bold text-uvc-purple">
                {results.efficiency.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">
                Eficiencia UV-C
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Perfil de Dosis - Análisis Longitudinal
            </h3>
            <Line data={generateLongitudinalProfile(results, params)} options={{
              responsive: true,
              plugins: {
                legend: { display: true }
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Distancia recorrida (cm)'
                  }
                },
                y: {
                  title: {
                    display: true,
                    text: 'Dosis acumulada (mJ/cm²)'
                  }
                }
              }
            }} />
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Análisis Detallado
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Tiempo de Exposición:</span>
              <p className="font-semibold">{results.exposureTime.toFixed(2)} s</p>
            </div>
            <div>
              <span className="text-gray-500">Consumo Energético:</span>
              <p className="font-semibold">{results.energyConsumption.toFixed(3)} kWh</p>
            </div>
            <div>
              <span className="text-gray-500">Zonas Muertas:</span>
              <p className="font-semibold">{results.deadZones.length} puntos</p>
            </div>
            <div>
              <span className="text-gray-500">Desviación Estándar:</span>
              <p className="font-semibold">{results.statistics.stdDev.toFixed(1)} mJ/cm²</p>
            </div>
            <div>
              <span className="text-gray-500">Dosis Máxima:</span>
              <p className="font-semibold">{results.statistics.maxDose.toFixed(1)} mJ/cm²</p>
            </div>
            <div>
              <span className="text-gray-500">CV (%):</span>
              <p className="font-semibold">
                {((results.statistics.stdDev / results.statistics.avgDose) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {!isTargetMet && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <FiAlertTriangle className="text-yellow-600 mt-1" />
              <div>
                <p className="font-semibold text-yellow-800">
                  Dosis objetivo no alcanzada
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Considera aumentar el número de tubos, reducir la velocidad del aire o 
                  usar la función de optimización automática.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon, 
  status 
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  status: 'success' | 'warning' | 'info' 
}) {
  const bgColors = {
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  };

  return (
    <div className={`p-4 rounded-lg border ${bgColors[status]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-600">{title}</p>
          <p className="text-lg font-bold mt-1">{value}</p>
        </div>
        {icon}
      </div>
    </div>
  );
}

function calculateDistribution(doseMap: number[][], targetDose: number): number[] {
  const flatData = doseMap.flat();
  const total = flatData.length;
  
  const ranges = [
    flatData.filter(d => d < targetDose * 0.5).length,
    flatData.filter(d => d >= targetDose * 0.5 && d < targetDose * 0.75).length,
    flatData.filter(d => d >= targetDose * 0.75 && d < targetDose * 0.9).length,
    flatData.filter(d => d >= targetDose * 0.9 && d < targetDose * 1.1).length,
    flatData.filter(d => d >= targetDose * 1.1).length
  ];
  
  return ranges.map(r => (r / total) * 100);
}

function generateCrossSectionData(doseMap: number[][]) {
  const midRow = Math.floor(doseMap.length / 2);
  const positions = doseMap[midRow].map((_, i) => i);
  
  return {
    labels: positions,
    datasets: [
      {
        label: 'Perfil Horizontal',
        data: doseMap[midRow],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4
      },
      {
        label: 'Perfil Vertical',
        data: doseMap.map(row => row[Math.floor(row.length / 2)]),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }
    ]
  };
}

function generateLongitudinalProfile(results: SimulationResults, params: SimulationParams) {
  // Simular el recorrido de partículas representativas
  const steps = 50;
  const positions = Array.from({ length: steps }, (_, i) => (i / steps) * params.ductLength);
  
  // Calcular dosis acumulada para diferentes trayectorias
  const centerParticle = positions.map((pos, i) => {
    const progress = i / steps;
    return results.statistics.avgDose * progress;
  });
  
  const edgeParticle = positions.map((pos, i) => {
    const progress = i / steps;
    return results.statistics.minDose * progress;
  });
  
  const optimalParticle = positions.map((pos, i) => {
    const progress = i / steps;
    return results.statistics.maxDose * progress;
  });
  
  return {
    labels: positions.map(p => p.toFixed(0)),
    datasets: [
      {
        label: 'Partícula Central',
        data: centerParticle,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4
      },
      {
        label: 'Partícula Borde',
        data: edgeParticle,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4
      },
      {
        label: 'Partícula Óptima',
        data: optimalParticle,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4
      }
    ]
  };
}