# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir al Calculador UV-C! Este documento te guiará sobre cómo puedes ayudar a mejorar el proyecto.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Mejoras](#sugerir-mejoras)
- [Pull Requests](#pull-requests)
- [Estándares de Código](#estándares-de-código)
- [Configuración del Entorno](#configuración-del-entorno)

## 📜 Código de Conducta

Este proyecto se adhiere al [Código de Conducta de Contributor Covenant](https://www.contributor-covenant.org/). Al participar, se espera que respetes este código.

## 🎯 Cómo Contribuir

### 1. Fork el Repositorio
```bash
# Fork desde GitHub y clona tu fork
git clone https://github.com/tu-usuario/uvcCalculator.git
cd uvcCalculator
git remote add upstream https://github.com/jnrivra/uvcCalculator.git
```

### 2. Crea una Rama
```bash
git checkout -b feature/nombre-descriptivo
# o
git checkout -b fix/descripcion-del-bug
```

### 3. Realiza tus Cambios
- Escribe código limpio y documentado
- Añade tests si es necesario
- Actualiza la documentación

### 4. Commit con Mensaje Descriptivo
```bash
git add .
git commit -m "feat: agregar cálculo de dosis acumulativa

- Implementar modelo de acumulación temporal
- Añadir visualización de trayectorias
- Actualizar documentación de API"
```

## 🐛 Reportar Bugs

### Antes de Reportar
1. Verifica que el bug no haya sido reportado previamente
2. Actualiza a la última versión
3. Intenta reproducir el bug en la versión portable

### Cómo Reportar
Crea un [Issue](https://github.com/jnrivra/uvcCalculator/issues) con:
- **Título claro**: Descripción breve del problema
- **Descripción**: Comportamiento esperado vs actual
- **Pasos para reproducir**
- **Screenshots** si aplica
- **Entorno**: Navegador, OS, versión

### Plantilla de Bug Report
```markdown
## Descripción
Breve descripción del bug

## Pasos para Reproducir
1. Ir a '...'
2. Click en '...'
3. Configurar '...'
4. Ver error

## Comportamiento Esperado
Qué debería suceder

## Comportamiento Actual
Qué está sucediendo

## Screenshots
Si aplica

## Entorno
- OS: [e.g. macOS 14.0]
- Navegador: [e.g. Chrome 120]
- Versión: [e.g. 1.0.0]
```

## 💡 Sugerir Mejoras

### Feature Requests
Abre un [Issue](https://github.com/jnrivra/uvcCalculator/issues) con etiqueta `enhancement`:

```markdown
## Feature Request

### Problema
Descripción del problema que resuelve

### Solución Propuesta
Cómo debería funcionar

### Alternativas Consideradas
Otras opciones que consideraste

### Contexto Adicional
Screenshots, mockups, referencias
```

## 🔄 Pull Requests

### Proceso
1. **Fork y clona** el repositorio
2. **Configura** tu entorno de desarrollo
3. **Crea una rama** desde `main`
4. **Desarrolla** tu feature/fix
5. **Añade tests** si es necesario
6. **Actualiza docs** si cambiaste la API
7. **Push** a tu fork
8. **Abre un PR** con descripción detallada

### Checklist para PR
- [ ] Mi código sigue los estándares del proyecto
- [ ] He realizado self-review de mi código
- [ ] He comentado código complejo
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan warnings
- [ ] He añadido tests que prueban mi fix/feature
- [ ] Tests nuevos y existentes pasan localmente
- [ ] He verificado en múltiples navegadores

### Plantilla de PR
```markdown
## Descripción
Resumen de los cambios y motivación

## Tipo de Cambio
- [ ] Bug fix
- [ ] Nueva feature
- [ ] Breaking change
- [ ] Documentación

## Testing
- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] Tests manuales

## Checklist
- [ ] Mi código sigue las guías de estilo
- [ ] He realizado self-review
- [ ] He actualizado la documentación
- [ ] No hay warnings nuevos

## Screenshots
Si aplica
```

## 📐 Estándares de Código

### TypeScript/JavaScript
```typescript
// ✅ Bueno
export function calculateDose(
  irradiance: number,
  exposureTime: number
): number {
  return irradiance * exposureTime * 1000;
}

// ❌ Evitar
export function calc(i, t) {
  return i * t * 1000
}
```

### React Components
```tsx
// ✅ Bueno
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className="btn-primary"
    >
      {label}
    </button>
  );
}

// ❌ Evitar
export function Button(props) {
  return <button onClick={props.onClick}>{props.label}</button>
}
```

### Commits
Seguimos [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` Nueva característica
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Formato (no afecta lógica)
- `refactor:` Refactorización
- `perf:` Mejoras de performance
- `test:` Añadir/corregir tests
- `chore:` Mantenimiento

## 🛠️ Configuración del Entorno

### Requisitos
- Node.js 18+
- npm 9+
- Git

### Setup
```bash
# Clonar repo
git clone https://github.com/jnrivra/uvcCalculator.git
cd uvcCalculator

# Instalar dependencias
npm install

# Configurar pre-commit hooks
npm run prepare

# Iniciar desarrollo
npm run dev
```

### Scripts Disponibles
```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run preview    # Preview del build
npm run test       # Ejecutar tests
npm run lint       # Linting
npm run format     # Formatear código
```

### Estructura de Branches
- `main`: Rama principal, siempre estable
- `develop`: Desarrollo activo
- `feature/*`: Nuevas características
- `fix/*`: Correcciones
- `docs/*`: Documentación

## 🧪 Testing

### Tests Unitarios
```bash
npm run test
npm run test:watch  # Modo watch
npm run test:coverage  # Con coverage
```

### Escribir Tests
```typescript
import { describe, it, expect } from 'vitest';
import { calculateDose } from '../src/physics/uvCalculations';

describe('UV Calculations', () => {
  it('should calculate dose correctly', () => {
    const dose = calculateDose(10, 5);
    expect(dose).toBe(50000);
  });
});
```

## 📚 Recursos

- [Documentación de React](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Three.js Docs](https://threejs.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)

## ❓ Preguntas

Si tienes preguntas:
1. Revisa la [documentación](README.md)
2. Busca en [Issues cerrados](https://github.com/jnrivra/uvcCalculator/issues?q=is%3Aclosed)
3. Abre una [Discussion](https://github.com/jnrivra/uvcCalculator/discussions)

## 🎉 Reconocimiento

Todos los contribuidores serán añadidos al README. ¡Gracias por hacer este proyecto mejor!

---

¿Listo para contribuir? ¡Esperamos tu PR! 🚀