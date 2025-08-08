import { SimulationParams } from '../types';
import { FiPlay, FiInfo, FiSettings, FiDroplet, FiThermometer } from 'react-icons/fi';
import { getLampsList } from '../data/lamps';

interface ControlPanelProps {
  params: SimulationParams;
  onParamsChange: (params: SimulationParams) => void;
  onSimulate: () => void;
  isCalculating: boolean;
}

export default function ControlPanel({ 
  params, 
  onParamsChange, 
  onSimulate, 
  isCalculating 
}: ControlPanelProps) {
  const lamps = getLampsList();

  const handleChange = (field: keyof SimulationParams, value: any) => {
    onParamsChange({ ...params, [field]: value });
  };

  return (
    <div className="glass-panel p-4 space-y-4">
      <div>
        <h2 className="text-lg font-bold mb-3 text-gray-800 flex items-center gap-2">
          <FiSettings className="text-uvc-purple" />
          Parámetros
        </h2>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dimensiones del Ducto
          </label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-gray-500">Ancho (cm)</label>
              <input
                type="number"
                value={params.ductWidth}
                onChange={(e) => handleChange('ductWidth', parseFloat(e.target.value))}
                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-uvc-purple text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Alto (cm)</label>
              <input
                type="number"
                value={params.ductHeight}
                onChange={(e) => handleChange('ductHeight', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-uvc-purple"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Largo (cm)</label>
              <input
                type="number"
                value={params.ductLength}
                onChange={(e) => handleChange('ductLength', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-uvc-purple"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modelo de Lámpara UV-C
          </label>
          <select
            value={params.selectedLamp}
            onChange={(e) => handleChange('selectedLamp', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-uvc-purple"
          >
            {lamps.map(lamp => (
              <option key={lamp.id} value={lamp.id}>
                {lamp.model} - {lamp.power}W ({lamp.uvcOutput}W UV-C)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cantidad de Tubos: {params.numberOfTubes}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={params.numberOfTubes}
            onChange={(e) => handleChange('numberOfTubes', parseInt(e.target.value))}
            className="w-full accent-uvc-purple"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Velocidad del Aire (m/s)
            </label>
            <input
              type="number"
              step="0.1"
              value={params.airVelocity}
              onChange={(e) => handleChange('airVelocity', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-uvc-purple"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dosis Objetivo (mJ/cm²)
            </label>
            <input
              type="number"
              value={params.targetDose}
              onChange={(e) => handleChange('targetDose', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-uvc-purple"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reflectividad de Paredes: {(params.reflectivity * 100).toFixed(0)}%
          </label>
          <input
            type="range"
            min="0"
            max="90"
            value={params.reflectivity * 100}
            onChange={(e) => handleChange('reflectivity', parseInt(e.target.value) / 100)}
            className="w-full accent-uvc-purple"
          />
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Condiciones Ambientales
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <FiThermometer className="text-orange-500" />
              <div className="flex-1">
                <label className="text-xs text-gray-500">Temperatura (°C)</label>
                <input
                  type="number"
                  value={params.temperature}
                  onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-uvc-purple"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FiDroplet className="text-blue-500" />
              <div className="flex-1">
                <label className="text-xs text-gray-500">Humedad (%)</label>
                <input
                  type="number"
                  value={params.humidity}
                  onChange={(e) => handleChange('humidity', parseFloat(e.target.value))}
                  className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-uvc-purple"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <FiInfo className="text-blue-600 mt-0.5" />
            <div className="text-xs text-blue-800">
              <p className="font-semibold mb-1">Tiempo de exposición estimado:</p>
              <p>{(params.ductLength / (params.airVelocity * 100)).toFixed(2)} segundos</p>
            </div>
          </div>
        </div>

        <button
          onClick={onSimulate}
          disabled={isCalculating}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          {isCalculating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Calculando...
            </>
          ) : (
            <>
              <FiPlay />
              Simular
            </>
          )}
        </button>
      </div>
    </div>
  );
}