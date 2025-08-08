#!/bin/bash

# Script para agregar screenshots al proyecto
# Uso: ./add-screenshots.sh [ruta-a-las-imagenes]

echo "🖼️  Agregador de Screenshots para Calculador UV-C"
echo "================================================"

# Directorio de destino
DEST_DIR="docs/images"

# Crear directorio si no existe
mkdir -p $DEST_DIR

# Si se proporciona una ruta como argumento
if [ $# -eq 1 ]; then
    SOURCE_DIR="$1"
    
    echo "📁 Buscando imágenes en: $SOURCE_DIR"
    
    # Buscar y copiar archivos PNG
    find "$SOURCE_DIR" -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" | while read -r file; do
        filename=$(basename "$file")
        echo "📋 Copiando: $filename"
        cp "$file" "$DEST_DIR/"
    done
    
    echo "✅ Imágenes copiadas a $DEST_DIR"
    
else
    echo ""
    echo "📝 Instrucciones:"
    echo "1. Toma las siguientes capturas de pantalla:"
    echo "   - Dashboard completo (guardar como: dashboard-main.png)"
    echo "   - Vista 3D con partículas (guardar como: 3d-visualization.png)"
    echo "   - Panel de parámetros (guardar como: parameters-panel.png)"
    echo "   - Panel de métricas (guardar como: metrics-panel.png)"
    echo ""
    echo "2. Coloca las imágenes en $DEST_DIR/"
    echo ""
    echo "3. O ejecuta este script con la ruta a las imágenes:"
    echo "   ./add-screenshots.sh /ruta/a/las/imagenes"
    echo ""
fi

# Verificar si hay imágenes en el directorio
IMG_COUNT=$(find $DEST_DIR -name "*.png" -o -name "*.jpg" | wc -l)

if [ $IMG_COUNT -gt 0 ]; then
    echo ""
    echo "📊 Estado actual:"
    echo "   - Imágenes encontradas: $IMG_COUNT"
    ls -lh $DEST_DIR/*.{png,jpg,jpeg} 2>/dev/null
    
    echo ""
    echo "🚀 Para subir a GitHub:"
    echo "   git add $DEST_DIR/*"
    echo "   git commit -m \"docs: agregar capturas de pantalla de la aplicación\""
    echo "   git push origin main"
else
    echo ""
    echo "⚠️  No se encontraron imágenes en $DEST_DIR"
fi