# 🎯 Características Detalladas

## Interfaz de Usuario

### Dashboard Principal
- **Layout de 3 columnas** optimizado para pantallas grandes
- **Panel de control izquierdo** con todos los parámetros
- **Visualización 3D central** con controles de cámara
- **Panel de resultados derecho** con métricas y gráficos

### Visualización 3D
- **Renderizado en tiempo real** con Three.js/WebGL
- **Sistema de partículas** mostrando flujo de aire
- **Tubos UV-C animados** con efecto glow púrpura
- **Grid de referencia** para escala visual
- **Controles de órbita** para rotar, zoom y pan
- **Indicadores de flujo** ENTRADA → SALIDA

### Métricas en Tiempo Real
- **Dosis Mínima**: Punto más bajo de exposición UV-C
- **Dosis Promedio**: Media calculada sobre todas las partículas
- **Uniformidad**: Distribución de la dosis en el ducto
- **Cobertura**: Porcentaje del área efectivamente tratada
- **Tiempo de Exposición**: Calculado según velocidad del aire
- **Eficiencia UV-C**: Ratio de conversión energética

## Parámetros Configurables

### Dimensiones del Ducto
- **Ancho**: 10-200 cm
- **Alto**: 10-200 cm
- **Largo**: 50-500 cm
- Validación automática de proporciones

### Configuración UV-C
- **Base de datos de lámparas** comerciales:
  - Philips TUV T5 31.3W UV-C (Primera opción)
  - Philips TUV T8 55W/75W HO
  - OSRAM PURITEC HNS series
  - Atlantic UV GHO series
  - Steril-Aire UVC Emitters
- **Número de tubos**: 1-12 con slider visual
- **Posicionamiento automático**:
  - 1 tubo: inferior
  - 2 tubos: laterales
  - 3 tubos: inferior + laterales
  - 4 tubos: configuración diamante
  - 5+ tubos: distribución optimizada con mínimo 20% superior

### Condiciones Operativas
- **Velocidad del aire**: 0.5-10 m/s
- **Dosis objetivo**: Configurable en mJ/cm²
- **Reflectividad de paredes**: 0-95%
- **Temperatura ambiente**: -10 a 50°C
- **Humedad relativa**: 0-100%

## Algoritmos de Cálculo

### Modelo de Irradiancia
- **Fuente lineal cilíndrica** (no puntual)
- **Factor de reflexión múltiple**
- **Atenuación por temperatura y humedad**
- **Turbulencia del aire considerada**

### Distribución de Tubos
- **Separación de 6cm** desde las paredes
- **Algoritmo de balance** para uniformidad
- **Prioridad a cobertura superior** (≥20% para 5+ tubos)
- **Optimización de simetría**

### Análisis de Dosis
- **Cálculo longitudinal** a lo largo del ducto
- **Acumulación temporal** por partícula
- **Estadísticas completas**: min, max, promedio, σ
- **Mapa de calor 2D** de distribución

## Gráficos y Visualizaciones

### Distribución de Dosis
- **Histograma** mostrando frecuencia de dosis
- **Rangos categorizados**:
  - < 50%: Insuficiente
  - 50-75%: Moderado
  - 75-90%: Bueno
  - 90-110%: Óptimo
  - > 110%: Exceso

### Perfil Longitudinal
- **Gráfico de líneas** mostrando evolución de dosis
- **Múltiples trazas**:
  - Partícula central
  - Partícula superior
  - Partícula inferior
  - Partícula óptima
- **Eje X**: Posición en el ducto (cm)
- **Eje Y**: Dosis acumulada (mJ/cm²)

## Optimización

### Algoritmos Disponibles
1. **Algoritmo Genético**
   - Población: 100 individuos
   - Generaciones: 50
   - Mutación: 5%
   - Cruce: 80%

2. **Particle Swarm Optimization (PSO)**
   - Partículas: 50
   - Iteraciones: 100
   - Factor inercial: 0.7
   - Factor cognitivo: 1.5
   - Factor social: 1.5

3. **Simulated Annealing**
   - Temperatura inicial: 100
   - Enfriamiento: 0.95
   - Iteraciones: 1000
   - Perturbación: ±10%

### Objetivos de Optimización
- **Maximizar dosis mínima**
- **Maximizar uniformidad**
- **Minimizar número de tubos**
- **Minimizar consumo energético**

## Estados del Sistema

### Indicadores de Estado
- **🟢 Óptimo**: Dosis ≥ objetivo, uniformidad > 80%
- **🟡 Aceptable**: Dosis 70-100% objetivo
- **🔴 Insuficiente**: Dosis < 70% objetivo

### Mensajes de Retroalimentación
- Recomendaciones automáticas para mejorar rendimiento
- Alertas sobre configuraciones subóptimas
- Sugerencias de número de tubos ideal
- Advertencias sobre velocidad excesiva

## Exportación y Reportes

### Formatos Disponibles
- **PDF**: Reporte completo con gráficos
- **Excel**: Datos tabulados para análisis
- **JSON**: Configuración y resultados
- **PNG**: Capturas de visualización 3D

### Contenido del Reporte
- Parámetros de configuración
- Resultados de simulación
- Gráficos de distribución
- Recomendaciones de mejora
- Análisis de costos operativos

## Performance

### Optimizaciones Implementadas
- **Web Workers** para cálculos intensivos
- **Memoización** de resultados frecuentes
- **LOD (Level of Detail)** en visualización 3D
- **Instanced rendering** para múltiples tubos
- **Lazy loading** de componentes pesados

### Métricas de Rendimiento
- **FPS**: 60 fps objetivo en visualización
- **Tiempo de cálculo**: < 100ms típico
- **Memoria**: < 200MB uso típico
- **Tiempo de carga**: < 2s inicial