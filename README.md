# 🔬 Calculador UV-C Profesional

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.160-black.svg)](https://threejs.org/)

Simulador avanzado de dosis UV-C para sistemas de desinfección de aire en ductos HVAC. Incluye visualización 3D en tiempo real, simulación de partículas y algoritmos de optimización.

## ✨ Características

### 🎯 Núcleo de Simulación
- **Modelo de fuente lineal** para cálculos precisos de irradiancia
- **Simulación de partículas** con acumulación de dosis en tiempo real
- **Factores ambientales**: temperatura, humedad, reflectividad
- **Base de datos** de lámparas UV-C comerciales (Philips, OSRAM, etc.)

### 🎨 Visualización 3D
- **Renderizado WebGL** con Three.js y React Three Fiber
- **Flujo de partículas animado** mostrando trayectorias de aire
- **Posicionamiento inteligente de tubos** con algoritmo optimizado
- **Vista expandible** a pantalla completa

### 📊 Análisis Avanzado
- **Mapa de calor de dosis** con gradientes de color
- **Estadísticas detalladas**: min, max, promedio, desviación estándar
- **Gráficos de distribución** con Chart.js
- **Cálculo de uniformidad** y eficiencia del sistema

### 🤖 Optimización
- **Algoritmo Genético** para posicionamiento óptimo
- **Particle Swarm Optimization (PSO)**
- **Simulated Annealing** para refinamiento
- **Optimización multi-objetivo**: dosis vs uniformidad

## 🚀 Inicio Rápido

### Opción 1: Versión Portable (Sin Instalación)
```bash
# Descarga el archivo HTML portable
wget https://github.com/user/repo/releases/download/v1.0/CalculadorUVC_Portable.html

# Abre con cualquier navegador
open CalculadorUVC_Portable.html
```

### Opción 2: Desarrollo Local
```bash
# Clonar repositorio
git clone https://github.com/user/calculador-uvc.git
cd calculador-uvc

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Abrir en navegador
open http://localhost:3070
```

### Opción 3: Build de Producción
```bash
# Compilar para producción
npm run build

# Crear versión standalone
node create-portable.js

# Servir archivos compilados
npm run preview
```

## 📖 Uso

### Parámetros de Entrada

#### Dimensiones del Ducto
- **Ancho**: 10-200 cm
- **Alto**: 10-200 cm  
- **Largo**: 50-500 cm

#### Configuración UV-C
- **Lámpara**: Selección de base de datos (Philips TUV T5 31.3W, etc.)
- **Número de Tubos**: 1-12 tubos
- **Reflectividad**: 0-95% (típico 50-70% para metal)

#### Condiciones Operativas
- **Velocidad del Aire**: 0.5-10 m/s
- **Temperatura**: -10 a 50°C
- **Humedad Relativa**: 0-100%

### Interpretación de Resultados

| Dosis UV-C | Efectividad | Reducción Log |
|------------|-------------|---------------|
| > 40 mJ/cm² | Excelente | 4+ log (99.99%) |
| 25-40 mJ/cm² | Buena | 3-4 log (99.9%) |
| 12-25 mJ/cm² | Moderada | 2-3 log (99%) |
| < 12 mJ/cm² | Insuficiente | < 2 log |

## 🏗️ Arquitectura

```
src/
├── components/          # Componentes React
│   ├── Viewer3D.tsx    # Visualización Three.js
│   ├── ParticleFlow.tsx # Sistema de partículas
│   └── ResultsPanel.tsx # Panel de resultados
├── physics/            # Motor de física
│   ├── uvCalculations.ts # Cálculos de irradiancia
│   ├── tubePositioning.ts # Algoritmos de posicionamiento
│   └── calculationAudit.ts # Validación de cálculos
├── optimization/       # Algoritmos de optimización
│   ├── genetic.ts     # Algoritmo genético
│   ├── pso.ts        # Particle Swarm
│   └── annealing.ts  # Simulated Annealing
├── data/              # Datos y configuración
│   └── lamps.ts      # Base de datos de lámparas
└── types/            # Definiciones TypeScript
```

## 🔧 Configuración

### Variables de Entorno
```bash
# .env
VITE_PORT=3070
VITE_API_URL=http://localhost:3000
```

### Configuración de Lámparas
```typescript
// src/data/lamps.ts
{
  id: 'TUV-T5-31.3W',
  model: 'TUV T5 31.3W UV-C',
  manufacturer: 'Philips',
  power: 75,           // Potencia total (W)
  uvcOutput: 31.3,     // Salida UV-C (W)
  efficiency: 41.7,    // Eficiencia (%)
  lifetime: 9000,      // Vida útil (horas)
  spectrum: 253.7      // Longitud de onda (nm)
}
```

## 📊 Algoritmos y Modelos

### Modelo de Irradiancia de Fuente Lineal
```typescript
// Irradiancia desde fuente lineal cilíndrica
I = (P_linear) / (2 * π * r)

donde:
- P_linear = Potencia UV-C / Longitud del tubo (W/m)
- r = Distancia radial al tubo (m)
```

### Factor de Reflexión
```typescript
// Multiplicador por reflexiones múltiples
M_reflection = 1 + (ρ * 0.5) + (ρ² * 0.25) + ...

donde:
- ρ = Reflectividad del material (0-1)
```

### Acumulación de Dosis
```typescript
// Dosis acumulada por partícula
D = ∫(I(t) * dt) desde t=0 hasta t=L/v

donde:
- I(t) = Irradiancia en posición(t)
- L = Longitud del ducto
- v = Velocidad del aire
```

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests E2E
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📈 Performance

- **FPS objetivo**: 60 FPS en visualización 3D
- **Partículas máximas**: 1000 simultáneas
- **Tiempo de cálculo**: < 100ms para configuración típica
- **Tamaño del bundle**: ~1.2 MB (producción)
- **Tamaño portable**: ~25 KB (HTML standalone)

## 🤝 Contribuir

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para detalles sobre:
- Código de conducta
- Proceso de pull requests
- Estándares de código
- Configuración del entorno de desarrollo

## 📝 Licencia

Este proyecto está licenciado bajo MIT License - ver [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- **Three.js** - Gráficos 3D WebGL
- **React Three Fiber** - React renderer para Three.js
- **Tailwind CSS** - Framework de estilos
- **Chart.js** - Visualización de datos
- **Vite** - Build tool

## 📚 Referencias

1. Kowalski, W. (2009). *Ultraviolet Germicidal Irradiation Handbook*
2. ASHRAE (2019). *Chapter 62: Ultraviolet Air and Surface Treatment*
3. Philips Lighting. *UV-C Disinfection Application Guide*
4. IUVA (2020). *UV Dose Guidelines for SARS-CoV-2*

## 📧 Contacto

- **Issues**: [GitHub Issues](https://github.com/user/calculador-uvc/issues)
- **Discussions**: [GitHub Discussions](https://github.com/user/calculador-uvc/discussions)

---

Desarrollado con ❤️ para la comunidad de ingeniería HVAC y bioseguridad