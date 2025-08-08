const fs = require('fs');
const path = require('path');

// Leer el archivo HTML compilado
const htmlPath = path.join(__dirname, 'dist', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Leer el archivo CSS
const cssFiles = fs.readdirSync(path.join(__dirname, 'dist', 'assets'))
  .filter(file => file.endsWith('.css'));

if (cssFiles.length > 0) {
  const cssPath = path.join(__dirname, 'dist', 'assets', cssFiles[0]);
  const css = fs.readFileSync(cssPath, 'utf8');
  
  // Reemplazar link CSS con estilo inline - usando el patrón correcto
  html = html.replace(
    /<link.*?href="\/assets\/.*?\.css".*?>/,
    `<style>${css}</style>`
  );
}

// Leer el archivo JavaScript
const jsFiles = fs.readdirSync(path.join(__dirname, 'dist', 'assets'))
  .filter(file => file.endsWith('.js') && !file.includes('.map'));

if (jsFiles.length > 0) {
  const jsPath = path.join(__dirname, 'dist', 'assets', jsFiles[0]);
  let js = fs.readFileSync(jsPath, 'utf8');
  
  // Reemplazar imports de módulos con versiones CDN
  // React, ReactDOM y Three.js desde CDN
  const cdnImports = `
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/three@0.160.0/build/three.min.js"></script>
    <script src="https://unpkg.com/@react-three/fiber@8.15.12/dist/index.js"></script>
    <script src="https://unpkg.com/@react-three/drei@9.89.0/index.js"></script>
    <script src="https://unpkg.com/chart.js@4.4.1/dist/chart.umd.js"></script>
  `;
  
  // Simplificar el código JS para que funcione como script normal
  js = js
    .replace(/import\.meta\.env\.DEV/g, 'false')
    .replace(/import\.meta\.env\.PROD/g, 'true')
    .replace(/import\.meta\.env/g, '{}');
    
  // Reemplazar script module con scripts CDN y el bundle
  html = html.replace(
    /<script type="module" crossorigin src="\/assets\/.*?\.js"><\/script>/,
    cdnImports + `\n<script defer>\ntry {\n${js}\n} catch(e) { console.error('Error:', e); }\n</script>`
  );
}

// Quitar el base tag que agregamos antes y otros elementos que no funcionan offline
html = html
  .replace(/<base.*?>/g, '')
  .replace('</head>', `
    <style>
      body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
      #root { width: 100vw; height: 100vh; }
    </style>
  </head>`);

// Guardar el archivo HTML único
const outputPath = path.join(__dirname, 'CalculadorUVC.html');
fs.writeFileSync(outputPath, html);

console.log('✅ Archivo único creado: CalculadorUVC.html');
console.log('📦 Tamaño:', (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2), 'MB');
console.log('🚀 ¡Listo para compartir! Solo haz doble click en CalculadorUVC.html');