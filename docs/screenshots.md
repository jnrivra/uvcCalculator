# 📸 Capturas de Pantalla

## Vista Principal - Dashboard Completo
![Dashboard Principal](images/dashboard-main.png)

La interfaz principal muestra una vista unificada con:
- **Panel de Control** (izquierda): Configuración de parámetros
- **Visualización 3D** (centro): Vista en tiempo real del ducto y tubos UV-C
- **Métricas y Resultados** (derecha): Datos de dosis, uniformidad y gráficos

### Características destacadas:
- Dosis mínima: 2.2 mJ/cm²
- Dosis promedio: 4.3 mJ/cm²
- Uniformidad: 7.6%
- Cobertura: 0.0%

## Panel de Parámetros Detallado
![Panel de Parámetros](images/parameters-panel.png)

### Configuración disponible:
- **Dimensiones del Ducto**: 50x50x200 cm
- **Modelo de Lámpara**: TUV T5 HO 31W (11.5W UV-C)
- **Cantidad de Tubos**: 5 tubos con slider interactivo
- **Velocidad del Aire**: 2 m/s
- **Dosis Objetivo**: 100 mJ/cm²
- **Reflectividad**: 30% ajustable
- **Condiciones Ambientales**: 
  - Temperatura: 20°C
  - Humedad: 50%
- **Tiempo de exposición estimado**: 1.00 segundos

## Visualización 3D con Partículas
![Visualización 3D](images/3d-visualization.png)

### Elementos visuales:
- **Ducto transparente** con grid de referencia
- **Tubos UV-C** en color púrpura con efecto glow
- **Partículas de aire** mostrando el flujo desde ENTRADA → SALIDA
- **Sistema de coordenadas** 3D interactivo
- **Rotación y zoom** disponibles con mouse

### Distribución de tubos (5 unidades):
- 1 tubo en la parte superior
- 2 tubos en la parte inferior
- 1 tubo en cada lateral
- Separación de 6cm desde las paredes

## Notas de la Interfaz

La aplicación presenta una interfaz moderna con:
- **Tema oscuro** con gradientes púrpura-azul
- **Cards con bordes redondeados** y sombras suaves
- **Gráficos interactivos** para análisis longitudinal
- **Indicadores visuales** de estado del sistema
- **Mensaje de advertencia**: "Dosis objetivo no alcanzada. Considera aumentar tubos o reducir velocidad"

## Tecnologías Visibles

- React con componentes modulares
- Three.js para renderizado 3D WebGL
- Chart.js para gráficos de datos
- Tailwind CSS para estilos modernos
- Sistema de partículas personalizado