# 📸 Imágenes del Proyecto

Este directorio debe contener las siguientes capturas de pantalla:

## 1. dashboard-main.png
**Vista principal del dashboard completo**
- Layout de 3 columnas
- Panel de parámetros a la izquierda
- Visualización 3D en el centro
- Métricas y gráficos a la derecha

## 2. 3d-visualization.png
**Vista de la simulación 3D**
- Ducto con grid de referencia
- 5 tubos UV-C en posición (1 arriba, 2 abajo, 2 laterales)
- Partículas fluyendo de ENTRADA a SALIDA
- Tubos con efecto glow púrpura

## 3. parameters-panel.png
**Panel de configuración detallado**
- Dimensiones: 50x50x200 cm
- Lámpara: TUV T5 HO 31W (11.5W UV-C)
- 5 tubos configurados
- Velocidad: 2 m/s
- Reflectividad: 30%
- Temperatura: 20°C, Humedad: 50%

## 4. metrics-panel.png
**Panel de métricas y resultados**
- Dosis Mínima: 2.2 mJ/cm²
- Dosis Promedio: 4.3 mJ/cm²
- Uniformidad: 7.6%
- Cobertura: 0.0%
- Gráfico de distribución de dosis
- Perfil longitudinal con 3 trazas

## Cómo agregar las imágenes

1. Toma capturas de pantalla de la aplicación en funcionamiento
2. Guárdalas con los nombres indicados arriba
3. Cópialas a este directorio (`docs/images/`)
4. Haz commit y push:

```bash
git add docs/images/*.png
git commit -m "docs: agregar capturas de pantalla reales"
git push origin main
```

## Especificaciones recomendadas

- **Formato**: PNG
- **Resolución**: 1920x1080 o mayor
- **Compresión**: Optimizada para web (usar TinyPNG o similar)
- **Tamaño máximo**: 500KB por imagen