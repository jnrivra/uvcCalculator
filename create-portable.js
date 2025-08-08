const fs = require('fs');
const path = require('path');

console.log('🔨 Creando versión portable del Calculador UV-C...');

// Template HTML con toda la aplicación embebida
const htmlTemplate = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calculador UV-C Pro | Simulación Avanzada</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 1400px;
            width: 100%;
            padding: 30px;
        }
        
        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 2.5rem;
            text-align: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
            font-size: 1.1rem;
        }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 12px;
            border: 1px solid #e0e0e0;
        }
        
        .section h2 {
            color: #444;
            margin-bottom: 15px;
            font-size: 1.3rem;
            border-bottom: 2px solid #667eea;
            padding-bottom: 8px;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        label {
            display: block;
            color: #555;
            margin-bottom: 5px;
            font-weight: 500;
        }
        
        input, select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s;
        }
        
        input:focus, select:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 30px;
            font-size: 1.1rem;
            border-radius: 8px;
            cursor: pointer;
            transition: transform 0.2s;
            width: 100%;
            margin-top: 20px;
            font-weight: 600;
        }
        
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        .results {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 25px;
            border-radius: 12px;
            margin-top: 30px;
        }
        
        .results h2 {
            color: #333;
            margin-bottom: 20px;
            text-align: center;
            font-size: 1.8rem;
        }
        
        .result-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        
        .result-card {
            background: white;
            padding: 15px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .result-label {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 5px;
        }
        
        .result-value {
            color: #333;
            font-size: 1.8rem;
            font-weight: bold;
            color: #667eea;
        }
        
        .result-unit {
            color: #888;
            font-size: 0.9rem;
        }
        
        .warning {
            background: #fff3cd;
            border: 1px solid #ffc107;
            color: #856404;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
        }
        
        .success {
            background: #d4edda;
            border: 1px solid #28a745;
            color: #155724;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
        }
        
        .error {
            background: #f8d7da;
            border: 1px solid #dc3545;
            color: #721c24;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
        }
        
        .info {
            background: #d1ecf1;
            border: 1px solid #17a2b8;
            color: #0c5460;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
        }
        
        .visualization {
            background: #2c3e50;
            padding: 30px;
            border-radius: 12px;
            margin-top: 30px;
            min-height: 400px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }
        
        .tube {
            position: absolute;
            width: 8px;
            height: 80%;
            background: linear-gradient(180deg, #8b5cf6, #a78bfa);
            border-radius: 4px;
            box-shadow: 0 0 20px #8b5cf6, 0 0 40px #8b5cf6;
            animation: glow 2s ease-in-out infinite;
        }
        
        @keyframes glow {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; }
        }
        
        .duct-outline {
            position: absolute;
            border: 2px solid #4a5568;
            border-radius: 8px;
            width: 90%;
            height: 90%;
        }
        
        .flow-indicator {
            position: absolute;
            color: #3b82f6;
            font-size: 14px;
            font-weight: bold;
        }
        
        .flow-left {
            left: -60px;
            top: 50%;
            transform: translateY(-50%);
        }
        
        .flow-right {
            right: -60px;
            top: 50%;
            transform: translateY(-50%);
        }
        
        .lamp-selector {
            background: #f0f4f8;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
        }
        
        .lamp-info {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-top: 10px;
            font-size: 0.9rem;
        }
        
        .lamp-stat {
            background: white;
            padding: 8px;
            border-radius: 6px;
            text-align: center;
        }
        
        .lamp-stat-label {
            color: #666;
            font-size: 0.8rem;
        }
        
        .lamp-stat-value {
            color: #333;
            font-weight: bold;
        }
        
        @media (max-width: 768px) {
            .grid {
                grid-template-columns: 1fr;
            }
            
            h1 {
                font-size: 2rem;
            }
            
            .container {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔬 Calculador UV-C Profesional</h1>
        <p class="subtitle">Simulación avanzada de dosis UV-C para desinfección de aire</p>
        
        <div class="grid">
            <div class="section">
                <h2>📐 Dimensiones del Ducto</h2>
                <div class="form-group">
                    <label for="width">Ancho (cm):</label>
                    <input type="number" id="width" value="60" min="10" max="200">
                </div>
                <div class="form-group">
                    <label for="height">Alto (cm):</label>
                    <input type="number" id="height" value="40" min="10" max="200">
                </div>
                <div class="form-group">
                    <label for="length">Largo (cm):</label>
                    <input type="number" id="length" value="120" min="50" max="500">
                </div>
            </div>
            
            <div class="section">
                <h2>💡 Configuración UV-C</h2>
                <div class="lamp-selector">
                    <label for="lamp">Lámpara UV-C:</label>
                    <select id="lamp">
                        <option value="philips-tuv-t5-31.3w">Philips TUV T5 31.3W UV-C</option>
                        <option value="philips-tuv-55w">Philips TUV T8 55W HO</option>
                        <option value="philips-tuv-75w">Philips TUV T8 75W HO</option>
                        <option value="osram-24w">OSRAM PURITEC HNS 24W</option>
                        <option value="osram-36w">OSRAM PURITEC HNS 36W</option>
                        <option value="osram-95w">OSRAM PURITEC HNS XPT 95W</option>
                        <option value="atlantic-287w">Atlantic UV GHO64T5L/4P 287W</option>
                        <option value="steril-aire-36">Steril-Aire UVC Emitter 36"</option>
                    </select>
                    <div class="lamp-info" id="lampInfo">
                        <div class="lamp-stat">
                            <div class="lamp-stat-label">Potencia UV-C</div>
                            <div class="lamp-stat-value" id="lampPower">31.3W</div>
                        </div>
                        <div class="lamp-stat">
                            <div class="lamp-stat-label">Eficiencia</div>
                            <div class="lamp-stat-value" id="lampEfficiency">41.7%</div>
                        </div>
                        <div class="lamp-stat">
                            <div class="lamp-stat-label">Vida Útil</div>
                            <div class="lamp-stat-value" id="lampLifetime">9000h</div>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="tubes">Número de Tubos:</label>
                    <input type="number" id="tubes" value="4" min="1" max="12">
                </div>
                <div class="form-group">
                    <label for="reflectivity">Reflectividad (%):</label>
                    <input type="number" id="reflectivity" value="70" min="0" max="95">
                </div>
            </div>
            
            <div class="section">
                <h2>🌬️ Condiciones de Operación</h2>
                <div class="form-group">
                    <label for="velocity">Velocidad del Aire (m/s):</label>
                    <input type="number" id="velocity" value="2.5" min="0.5" max="10" step="0.1">
                </div>
                <div class="form-group">
                    <label for="temperature">Temperatura (°C):</label>
                    <input type="number" id="temperature" value="22" min="-10" max="50">
                </div>
                <div class="form-group">
                    <label for="humidity">Humedad Relativa (%):</label>
                    <input type="number" id="humidity" value="50" min="0" max="100">
                </div>
            </div>
        </div>
        
        <button class="button" onclick="calculate()">🚀 Calcular Dosis UV-C</button>
        
        <div class="visualization" id="visualization">
            <div class="duct-outline"></div>
            <div class="flow-indicator flow-left">ENTRADA →</div>
            <div class="flow-indicator flow-right">→ SALIDA</div>
            <div id="tubesContainer"></div>
        </div>
        
        <div class="results" id="results" style="display: none;">
            <h2>📊 Resultados de la Simulación</h2>
            <div class="result-grid">
                <div class="result-card">
                    <div class="result-label">Dosis Promedio</div>
                    <div class="result-value" id="avgDose">0</div>
                    <div class="result-unit">mJ/cm²</div>
                </div>
                <div class="result-card">
                    <div class="result-label">Dosis Mínima</div>
                    <div class="result-value" id="minDose">0</div>
                    <div class="result-unit">mJ/cm²</div>
                </div>
                <div class="result-card">
                    <div class="result-label">Dosis Máxima</div>
                    <div class="result-value" id="maxDose">0</div>
                    <div class="result-unit">mJ/cm²</div>
                </div>
                <div class="result-card">
                    <div class="result-label">Uniformidad</div>
                    <div class="result-value" id="uniformity">0</div>
                    <div class="result-unit">%</div>
                </div>
                <div class="result-card">
                    <div class="result-label">Tiempo Exposición</div>
                    <div class="result-value" id="exposureTime">0</div>
                    <div class="result-unit">segundos</div>
                </div>
                <div class="result-card">
                    <div class="result-label">Eficiencia Sistema</div>
                    <div class="result-value" id="efficiency">0</div>
                    <div class="result-unit">%</div>
                </div>
            </div>
            
            <div id="messageBox"></div>
        </div>
    </div>
    
    <script>
        // Base de datos de lámparas
        const lamps = {
            'philips-tuv-t5-31.3w': {
                name: 'Philips TUV T5 31.3W UV-C',
                power: 75,
                uvcOutput: 31.3,
                efficiency: 41.7,
                lifetime: 9000,
                length: 120,
                price: 85
            },
            'philips-tuv-55w': {
                name: 'Philips TUV T8 55W HO',
                power: 55,
                uvcOutput: 18,
                efficiency: 32.7,
                lifetime: 9000,
                length: 90,
                price: 65
            },
            'philips-tuv-75w': {
                name: 'Philips TUV T8 75W HO',
                power: 75,
                uvcOutput: 25.5,
                efficiency: 34,
                lifetime: 9000,
                length: 120,
                price: 85
            },
            'osram-24w': {
                name: 'OSRAM PURITEC HNS 24W',
                power: 24,
                uvcOutput: 7.7,
                efficiency: 32.1,
                lifetime: 8000,
                length: 32,
                price: 38
            },
            'osram-36w': {
                name: 'OSRAM PURITEC HNS 36W',
                power: 36,
                uvcOutput: 13.5,
                efficiency: 37.5,
                lifetime: 8000,
                length: 120,
                price: 52
            },
            'osram-95w': {
                name: 'OSRAM PURITEC HNS XPT 95W',
                power: 95,
                uvcOutput: 32,
                efficiency: 33.7,
                lifetime: 12000,
                length: 150,
                price: 125
            },
            'atlantic-287w': {
                name: 'Atlantic UV GHO64T5L/4P',
                power: 287,
                uvcOutput: 95,
                efficiency: 33.1,
                lifetime: 10000,
                length: 150,
                price: 285
            },
            'steril-aire-36': {
                name: 'Steril-Aire UVC Emitter 36"',
                power: 105,
                uvcOutput: 36,
                efficiency: 34.3,
                lifetime: 9000,
                length: 91.4,
                price: 195
            }
        };
        
        // Actualizar información de lámpara
        document.getElementById('lamp').addEventListener('change', function() {
            const lamp = lamps[this.value];
            document.getElementById('lampPower').textContent = lamp.uvcOutput + 'W';
            document.getElementById('lampEfficiency').textContent = lamp.efficiency.toFixed(1) + '%';
            document.getElementById('lampLifetime').textContent = lamp.lifetime + 'h';
            updateVisualization();
        });
        
        // Actualizar visualización cuando cambian los tubos
        document.getElementById('tubes').addEventListener('input', updateVisualization);
        
        function updateVisualization() {
            const numTubes = parseInt(document.getElementById('tubes').value);
            const container = document.getElementById('tubesContainer');
            container.innerHTML = '';
            
            const positions = calculateTubePositions(numTubes);
            positions.forEach(pos => {
                const tube = document.createElement('div');
                tube.className = 'tube';
                tube.style.left = (50 + pos.x * 40) + '%';
                tube.style.top = (50 - pos.y * 40) + '%';
                tube.style.transform = 'translate(-50%, -50%)';
                container.appendChild(tube);
            });
        }
        
        function calculateTubePositions(n) {
            const positions = [];
            const wallDistance = 0.15; // 15% desde las paredes (6cm en un ducto de 40cm)
            
            if (n === 1) {
                positions.push({ x: 0, y: -0.5 + wallDistance });
            } else if (n === 2) {
                positions.push({ x: -0.5 + wallDistance, y: 0 });
                positions.push({ x: 0.5 - wallDistance, y: 0 });
            } else if (n === 3) {
                positions.push({ x: 0, y: -0.5 + wallDistance });
                positions.push({ x: -0.5 + wallDistance, y: 0 });
                positions.push({ x: 0.5 - wallDistance, y: 0 });
            } else if (n === 4) {
                positions.push({ x: 0, y: -0.5 + wallDistance });
                positions.push({ x: 0, y: 0.5 - wallDistance });
                positions.push({ x: -0.5 + wallDistance, y: 0 });
                positions.push({ x: 0.5 - wallDistance, y: 0 });
            } else if (n === 5) {
                positions.push({ x: 0, y: 0.5 - wallDistance });
                positions.push({ x: -0.3, y: -0.5 + wallDistance });
                positions.push({ x: 0.3, y: -0.5 + wallDistance });
                positions.push({ x: -0.5 + wallDistance, y: 0 });
                positions.push({ x: 0.5 - wallDistance, y: 0 });
            } else if (n === 6) {
                positions.push({ x: -0.25, y: 0.5 - wallDistance });
                positions.push({ x: 0.25, y: 0.5 - wallDistance });
                positions.push({ x: -0.25, y: -0.5 + wallDistance });
                positions.push({ x: 0.25, y: -0.5 + wallDistance });
                positions.push({ x: -0.5 + wallDistance, y: 0 });
                positions.push({ x: 0.5 - wallDistance, y: 0 });
            } else {
                // Para más de 6 tubos, distribución uniforme con al menos 20% arriba
                const topTubes = Math.ceil(n * 0.2);
                const bottomTubes = Math.ceil(n * 0.3);
                const sideTubes = n - topTubes - bottomTubes;
                const leftTubes = Math.floor(sideTubes / 2);
                const rightTubes = sideTubes - leftTubes;
                
                // Tubos superiores
                for (let i = 0; i < topTubes; i++) {
                    const x = (i - (topTubes - 1) / 2) * (0.8 / Math.max(topTubes - 1, 1));
                    positions.push({ x, y: 0.5 - wallDistance });
                }
                
                // Tubos inferiores
                for (let i = 0; i < bottomTubes; i++) {
                    const x = (i - (bottomTubes - 1) / 2) * (0.8 / Math.max(bottomTubes - 1, 1));
                    positions.push({ x, y: -0.5 + wallDistance });
                }
                
                // Tubos laterales
                for (let i = 0; i < leftTubes; i++) {
                    const y = (i - (leftTubes - 1) / 2) * (0.6 / Math.max(leftTubes - 1, 1));
                    positions.push({ x: -0.5 + wallDistance, y });
                }
                
                for (let i = 0; i < rightTubes; i++) {
                    const y = (i - (rightTubes - 1) / 2) * (0.6 / Math.max(rightTubes - 1, 1));
                    positions.push({ x: 0.5 - wallDistance, y });
                }
            }
            
            return positions;
        }
        
        function calculate() {
            // Obtener parámetros
            const width = parseFloat(document.getElementById('width').value);
            const height = parseFloat(document.getElementById('height').value);
            const length = parseFloat(document.getElementById('length').value);
            const velocity = parseFloat(document.getElementById('velocity').value);
            const numTubes = parseInt(document.getElementById('tubes').value);
            const reflectivity = parseFloat(document.getElementById('reflectivity').value) / 100;
            const temperature = parseFloat(document.getElementById('temperature').value);
            const humidity = parseFloat(document.getElementById('humidity').value);
            
            const selectedLamp = lamps[document.getElementById('lamp').value];
            
            // Cálculo de tiempo de exposición
            const exposureTime = (length / 100) / velocity;
            
            // Área de sección transversal
            const crossSectionArea = (width * height) / 10000; // m²
            
            // Factor de temperatura y humedad
            const tempFactor = 1 - ((temperature - 20) * 0.002);
            const humidityFactor = 1 - ((humidity - 50) * 0.003);
            
            // Potencia UV-C efectiva por tubo con factores ambientales
            const effectivePower = selectedLamp.uvcOutput * tempFactor * humidityFactor;
            
            // Irradiancia promedio considerando reflexiones
            const reflectionMultiplier = 1 + (reflectivity * 0.5);
            const avgIrradiance = (effectivePower * numTubes * reflectionMultiplier) / (crossSectionArea * 10000);
            
            // Factor de uniformidad basado en distribución de tubos
            const uniformityFactor = calculateUniformityFactor(numTubes);
            
            // Cálculo de dosis
            const avgDose = avgIrradiance * exposureTime * 1000;
            const minDose = avgDose * uniformityFactor * 0.7;
            const maxDose = avgDose * (2 - uniformityFactor * 0.7);
            
            // Eficiencia del sistema
            const systemEfficiency = (avgDose / (selectedLamp.power * numTubes * exposureTime)) * 100;
            
            // Mostrar resultados
            document.getElementById('avgDose').textContent = avgDose.toFixed(1);
            document.getElementById('minDose').textContent = minDose.toFixed(1);
            document.getElementById('maxDose').textContent = maxDose.toFixed(1);
            document.getElementById('uniformity').textContent = (uniformityFactor * 100).toFixed(0);
            document.getElementById('exposureTime').textContent = exposureTime.toFixed(2);
            document.getElementById('efficiency').textContent = systemEfficiency.toFixed(1);
            
            // Mensaje de evaluación
            const messageBox = document.getElementById('messageBox');
            if (avgDose >= 40) {
                messageBox.className = 'success';
                messageBox.innerHTML = '✅ <strong>Excelente:</strong> Dosis superior a 40 mJ/cm² - Reducción log 4+ para la mayoría de patógenos';
            } else if (avgDose >= 25) {
                messageBox.className = 'info';
                messageBox.innerHTML = '✓ <strong>Bueno:</strong> Dosis entre 25-40 mJ/cm² - Efectivo para bacterias y muchos virus';
            } else if (avgDose >= 12) {
                messageBox.className = 'warning';
                messageBox.innerHTML = '⚠️ <strong>Moderado:</strong> Dosis entre 12-25 mJ/cm² - Efectivo para algunas bacterias, limitado para virus';
            } else {
                messageBox.className = 'error';
                messageBox.innerHTML = '❌ <strong>Insuficiente:</strong> Dosis menor a 12 mJ/cm² - Se recomienda aumentar tubos o reducir velocidad';
            }
            
            document.getElementById('results').style.display = 'block';
            
            // Scroll suave a resultados
            document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
        }
        
        function calculateUniformityFactor(numTubes) {
            // Factor de uniformidad basado en número y distribución de tubos
            if (numTubes === 1) return 0.4;
            if (numTubes === 2) return 0.55;
            if (numTubes === 3) return 0.65;
            if (numTubes === 4) return 0.75;
            if (numTubes === 5) return 0.80;
            if (numTubes === 6) return 0.85;
            return Math.min(0.9 + (numTubes - 6) * 0.01, 0.95);
        }
        
        // Inicialización
        updateVisualization();
    </script>
</body>
</html>`;

// Guardar el archivo
const outputPath = path.join(__dirname, 'CalculadorUVC_Portable.html');
fs.writeFileSync(outputPath, htmlTemplate);

console.log('✅ Archivo portable creado: CalculadorUVC_Portable.html');
console.log('📦 Tamaño:', (fs.statSync(outputPath).size / 1024).toFixed(2), 'KB');
console.log('🚀 ¡100% autónomo! No requiere internet ni instalación.');
console.log('📌 Simplemente abre el archivo con cualquier navegador web.');