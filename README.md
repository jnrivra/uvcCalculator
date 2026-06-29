# 🔬 Calculador UV-C Pro

> Simulador interactivo de dosis UV-C para sistemas de desinfección de aire en ductos HVAC, con visualización 3D, mapa de dosis y optimización del posicionamiento de los tubos germicidas.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.158-000000.svg?logo=three.js&logoColor=white)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

## 📖 ¿Qué hace?

El **Calculador UV-C Pro** modela la dosis germicida que reciben las partículas de aire al atravesar un ducto HVAC equipado con lámparas UV-C. Permite a un ingeniero de bioseguridad o de climatización dimensionar un sistema de desinfección **antes de instalarlo**:

- Estima la **dosis UV-C** (mJ/cm²) en cada punto de la sección del ducto a partir de la potencia de las lámparas, la geometría del ducto y la velocidad del aire.
- Identifica **zonas muertas** (dosis insuficiente) y calcula **uniformidad** y **cobertura**.
- Sugiere el **posicionamiento óptimo de los tubos** mediante algoritmos metaheurísticos.
- Estima **consumo energético**, **vida útil de las lámparas** y **costos de operación**.
- Incluye una **base de datos de lámparas comerciales** (Philips TUV, OSRAM PURITEC, Atlantic UV, Steril-Aire, entre otras).

El repositorio incluye además la **hoja de datos de la lámpara Philips TUV T5** (`datasheet TUV T5.pdf`) usada como referencia para los parámetros.

## ✨ Características

### 🎯 Motor de simulación
- **Modelo de irradiancia por ley del inverso del cuadrado** con superposición de múltiples tubos.
- **Mapa de dosis 2D** de 100×100 sobre la sección transversal del ducto.
- **Correcciones ambientales** por temperatura, humedad y reflectividad de las paredes.
- **Análisis longitudinal** de la dosis acumulada a lo largo del ducto.
- **Estadísticas completas**: dosis mínima, máxima, promedio, desviación estándar, uniformidad y cobertura.
- **Detección de zonas muertas** bajo el umbral objetivo.

### 🎨 Visualización 3D
- **Renderizado WebGL** con Three.js y React Three Fiber.
- **Flujo de partículas animado** mostrando la trayectoria del aire (ENTRADA → SALIDA).
- **Posicionamiento automático de tubos** según su cantidad (inferior, laterales, distribución por caras).
- **Vista expandible** a pantalla completa con controles de órbita (rotar, zoom, paneo).

### 📊 Análisis y métricas
- **Dashboard de resultados** con gráficos de distribución y perfil longitudinal (Chart.js).
- **Cálculo de uniformidad y eficiencia** del sistema.
- **Auditoría de cálculos** para validar la consistencia física de los resultados.
- **Estimación de costos operativos** y **cronograma de reemplazo** de lámparas.

### 🤖 Optimización del posicionamiento
Tres algoritmos metaheurísticos para distribuir los tubos buscando maximizar uniformidad, cobertura o eficiencia:
- **Algoritmo Genético** (selección, cruce, mutación).
- **Particle Swarm Optimization (PSO)**.
- **Simulated Annealing**.

## 🧱 Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Lenguaje | TypeScript 5.2 |
| UI | React 18.2 |
| Build / dev server | Vite 5 |
| 3D | Three.js 0.158 + React Three Fiber + Drei |
| Gráficos | Chart.js + react-chartjs-2 |
| Estilos | Tailwind CSS 3.3 |
| Iconos | react-icons |

## 🚀 Inicio rápido

### Requisitos
- Node.js 18+ y npm 9+

### Desarrollo local
```bash
# Clonar el repositorio
git clone https://github.com/jnrivra/uvcCalculator.git
cd uvcCalculator

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo (abre http://localhost:3070)
npm run dev
```

### Build de producción
```bash
# Compilar TypeScript y generar el bundle en dist/
npm run build

# Previsualizar el build de producción
npm run preview
```

### Versiones portables (un solo archivo HTML)
Tras ejecutar `npm run build`, puedes empaquetar la aplicación en un único archivo HTML para compartir sin servidor:

```bash
# Versión 100% autónoma (sin internet) → CalculadorUVC_Portable.html
node create-portable.js

# Versión standalone con dependencias desde CDN → CalculadorUVC.html
node create-standalone.js
```

Ambos archivos se abren directamente con doble clic en cualquier navegador moderno.

## 🎛️ Uso

### Parámetros de entrada

| Parámetro | Rango | Notas |
|-----------|-------|-------|
| Ancho del ducto | 10–200 cm | |
| Alto del ducto | 10–200 cm | |
| Largo del ducto | 50–500 cm | |
| Lámpara | Base de datos | Philips, OSRAM, Atlantic UV, etc. |
| Número de tubos | 1–12 | Posicionamiento automático |
| Velocidad del aire | 0.5–10 m/s | Define el tiempo de exposición |
| Dosis objetivo | mJ/cm² | Umbral para evaluar cobertura |
| Reflectividad | 0–95 % | Material de las paredes |
| Temperatura | -10 a 50 °C | Corrección de irradiancia |
| Humedad relativa | 0–100 % | Corrección de irradiancia |

### Interpretación de la dosis UV-C

| Dosis UV-C | Efectividad | Reducción log |
|------------|-------------|---------------|
| > 40 mJ/cm² | Excelente | 4+ log (99.99 %) |
| 25–40 mJ/cm² | Buena | 3–4 log (99.9 %) |
| 12–25 mJ/cm² | Moderada | 2–3 log (99 %) |
| < 12 mJ/cm² | Insuficiente | < 2 log |

## 🧮 Modelo de cálculo

### Irradiancia (fuente puntual, ley del inverso del cuadrado)
La irradiancia que aporta cada tubo en un punto de la sección se calcula como:

```
I = (P_UVC · 1000) / (4 · π · (r + 1)²) · f_reflexión · f_temp · f_humedad
```

donde:
- `P_UVC` = salida UV-C de la lámpara (W)
- `r` = distancia radial al tubo (cm)
- `f_reflexión = 1 + ρ · 0.3` (ρ = reflectividad, 0–1)
- `f_temp = 1 - |T - 20| · 0.002`
- `f_humedad = 1 - (HR - 50) · 0.001`

La irradiancia total en cada punto es la suma de los aportes de todos los tubos.

### Dosis acumulada
```
D = I_total · t_exposición       t_exposición = L_ducto / (v_aire · 100)
```

con `L_ducto` en cm y `v_aire` en m/s, obteniendo el tiempo de residencia de la partícula dentro del ducto.

> Nota: el modelo está pensado como herramienta de **dimensionamiento y comparación de configuraciones**, no como sustituto de una validación dosimétrica de campo.

## 🗂️ Estructura del proyecto

```
src/
├── App.tsx                       # Componente raíz y estado de la simulación
├── components/
│   ├── ControlPanel.tsx          # Panel de parámetros de entrada
│   ├── Viewer3D.tsx              # Visualización 3D (Three.js / R3F)
│   ├── ParticleFlow.tsx         # Sistema de partículas de aire
│   ├── ResultsDashboard.tsx     # Métricas y gráficos
│   └── OptimizationEngine.tsx   # UI de los algoritmos de optimización
├── physics/
│   ├── irradiance.ts            # Cálculo de irradiancia y mapa de dosis
│   ├── longitudinalAnalysis.ts  # Análisis longitudinal de la dosis
│   ├── tubePositioning.ts       # Posicionamiento automático de tubos
│   ├── optimization.ts          # Genético, PSO y simulated annealing
│   └── calculationAudit.ts      # Validación de consistencia de cálculos
├── data/
│   └── lamps.ts                 # Base de datos de lámparas y costos
└── types/
    └── index.ts                 # Definiciones TypeScript
```

Para una descripción detallada de la arquitectura, el flujo de datos y los módulos, consulta **[ARCHITECTURE.md](ARCHITECTURE.md)**. El catálogo completo de funcionalidades está en **[docs/FEATURES.md](docs/FEATURES.md)**.

## 📸 Capturas de pantalla

> Las capturas aún no están incorporadas al repositorio. Para generarlas, ejecuta la aplicación en local (`npm run dev`) y usa el script auxiliar `./add-screenshots.sh /ruta/a/tus/imagenes` para copiarlas a `docs/images/`. Los nombres esperados se describen en [docs/screenshots.md](docs/screenshots.md).

## 🤝 Contribuir

Las contribuciones son bienvenidas. Revisa **[CONTRIBUTING.md](CONTRIBUTING.md)** para conocer el flujo de trabajo, los estándares de código y la convención de commits.

## 📚 Referencias

1. Kowalski, W. (2009). *Ultraviolet Germicidal Irradiation Handbook*.
2. ASHRAE (2019). *Chapter 62: Ultraviolet Air and Surface Treatment*.
3. Philips Lighting. *UV-C Disinfection Application Guide*.
4. IUVA (2020). *UV Dose Guidelines for SARS-CoV-2*.

## 📝 Licencia

Distribuido bajo la licencia **MIT**. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

Desarrollado con ❤️ para la comunidad de ingeniería HVAC y bioseguridad.
