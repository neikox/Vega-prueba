# 📋 Mini Módulo de Auditorías - AuditPro

Un sistema completo de gestión de auditorías con interfaz profesional, desarrollado como prueba técnica. El proyecto incluye simulación realista de APIs, gestión de estado, y una UI pulida con todos los estados necesarios (loading, error, vacío).

> **Prueba Técnica Vega** · Febrero 2026

---

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js >= 18.x
- npm >= 9.x

### Instalación y Ejecución

```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd Vega-Prueba

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Abrir en navegador
# http://localhost:5173
```

### Otros Comandos

```bash
# Build de producción
npm run build

# Preview del build
npm run preview

# Ejecutar tests unitarios
npm run test:unit

# Linting
npm run lint
```

---

## 📐 Decisiones Técnicas

### Stack Elegido

| Tecnología                  | Justificación                                                                                                                                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vue 3 (Composition API)** | Framework reactivo moderno con excelente DX, menor curva de aprendizaje que React, y perfecto para aplicaciones SPA de alcance medio. Además así me iba acostumbrando más a las tecnologías del puesto. |
| **Vite**                    | Build tool ultrarrápido con HMR instantáneo. Ideal para desarrollo ágil y pruebas técnicas con tiempos ajustados. Configuración mínima y soporte nativo para Vue.                                       |
| **Vue Router**              | Enrutamiento oficial de Vue con soporte para query params persistentes, navegación programática y guards. Esencial para el requerimiento de mantener filtros en URL.                                    |
| **TailwindCSS**             | Utility-first CSS para prototipado rápido manteniendo consistencia visual. Permite crear interfaces profesionales sin escribir CSS custom. Sistema de diseño integrado.                                 |
| **Vitest**                  | Framework de testing nativo de Vite, compatible con la sintaxis de Jest pero con mejor integración y velocidad.                                                                                         |

### Arquitectura del Proyecto

```
src/
├── components/
│   ├── audits/          # Componentes específicos del dominio
│   │   ├── AuditCard.vue
│   │   ├── AuditFilters.vue
│   │   ├── CheckList.vue
│   │   └── CheckItem.vue
│   ├── layout/          # Estructura de la aplicación
│   │   ├── MainLayout.vue
│   │   ├── Sidebar.vue
│   │   └── Topbar.vue
│   └── ui/              # Componentes reutilizables genéricos
│       ├── Badge.vue
│       ├── BaseButton.vue
│       ├── EmptyState.vue
│       ├── ErrorState.vue
│       ├── LoadingSkeleton.vue
│       └── Pagination.vue
├── data/
│   └── mockData.js      # Generación de 60 auditorías + checks
├── services/
│   ├── auditService.js  # Capa de servicios (API simulada)
│   └── mockApi.js       # Lógica de simulación (latencia, errores)
├── views/               # Páginas principales
│   ├── AuditList.vue    # Listado con filtros y paginación
│   ├── AuditWizard.vue  # Wizard de creación (2 pasos)
│   └── AuditDetail.vue  # Detalle + ejecución de checks
└── router/
    └── index.js         # Configuración de rutas
```

### Principios Aplicados

1. **Separación de Responsabilidades**:
   - Vista (componentes) ↔ Lógica de negocio (services) ↔ Datos (mockData)
   - Cada capa tiene responsabilidades claras y bien definidas

2. **Composición sobre Herencia**:
   - Componentes pequeños y reutilizables (atomic design pattern)
   - Props y eventos para comunicación clara entre componentes

3. **Single Source of Truth**:
   - Estado gestionado a nivel de servicios en memoria
   - URL como fuente de verdad para filtros (requerimiento explícito)

4. **Progressive Enhancement**:
   - Mobile-first design con sidebar colapsable
   - Responsive breakpoints bien definidos

---

## 🎯 Funcionalidades Implementadas

### ✅ Requisitos Obligatorios Completados

#### 1. Pantallas Principales

**Listado de Auditorías** (`/audits`)

- ✅ Vista en cards con diseño profesional
- ✅ Búsqueda en tiempo real por nombre/ID
- ✅ Filtros múltiples: estado, proceso, responsable
- ✅ Ordenación configurable (fecha, progreso, nombre)
- ✅ Paginación server-side (12 items por página)
- ✅ Estados de UI: loading (skeleton), error (con reintento), vacío (con CTA)
- ✅ Filtros persistentes en URL (query params)

**Wizard de Creación** (`/audits/new`)

- ✅ Paso 1: Datos básicos (nombre, proceso, responsable, fecha)
- ✅ Paso 2: Selección de plantilla con preview de checks
- ✅ Validación por pasos (no avanza sin completar)
- ✅ Feedback visual inmediato en errores
- ✅ Redirección al detalle tras crear

**Detalle de Auditoría** (`/audits/:id`)

- ✅ Resumen completo: estado, progreso, responsable, fechas
- ✅ Lista de checks con filtros por estado
- ✅ Botón "Ejecutar auditoría" (todos los checks)
- ✅ Ejecución progresiva simulada (QUEUED → RUNNING → OK/KO)
- ✅ Dos modalidades de ejecución:
  - Automática por check (simulación de proceso)
  - Manual (marcar OK/KO directamente)
- ✅ Polling cada 1s durante ejecución
- ✅ Actualización en tiempo real del progreso

#### 2. API Simulada (mockApi.js)

- ✅ **Latencia variable**: 300-1200ms configurable
- ✅ **Errores aleatorios**: 15% tasa de fallo configurable
- ✅ **Paginación real**: Solo devuelve items de la página solicitada + metadata
- ✅ **Consistencia**: Progreso siempre alineado con checks completados
- ✅ **Estados coherentes**: DRAFT (0%), IN_PROGRESS (1-99%), DONE (100%)

#### 3. Endpoints Implementados

| Método  | Ruta                                  | Descripción                                                      |
| ------- | ------------------------------------- | ---------------------------------------------------------------- |
| `GET`   | `/audits`                             | Listado paginado con filtros (q, status, process, ownerId, sort) |
| `GET`   | `/audits/:id`                         | Detalle de auditoría + checks                                    |
| `POST`  | `/audits`                             | Crear auditoría desde wizard                                     |
| `POST`  | `/audits/:id/run`                     | Ejecutar todos los checks                                        |
| `POST`  | `/audits/:id/checks/:checkId/execute` | Ejecutar check individual                                        |
| `PATCH` | `/audits/:id/checks/:checkId`         | Actualizar check manualmente                                     |
| `GET`   | `/templates`                          | Listar plantillas disponibles                                    |
| `GET`   | `/owners`                             | Listar responsables                                              |
| `GET`   | `/processes`                          | Listar procesos                                                  |

#### 4. Dataset Generado

- ✅ **60 auditorías** con datos realistas
- ✅ **8 procesos** (Compras, Ventas, Seguridad, RRHH, Operaciones, Finanzas, TI, Calidad)
- ✅ **12 responsables** con nombres completos
- ✅ **8 plantillas** (ISO 27001, ISO 9001, GDPR, SOX, etc.)
- ✅ **10-30 checks por auditoría** según plantilla
- ✅ **Coherencia de datos**: Progreso alineado con estados

#### 5. Componentes UI Reutilizables

- `Badge` - Estados visuales con variantes
- `BaseButton` - Botones con variantes y estados
- `EmptyState` - Estado vacío con slots para personalizar
- `ErrorState` - Manejo de errores con opción de reintento
- `LoadingSkeleton` - Shimmer effect para cargas
- `Pagination` - Navegación entre páginas con metadata

#### 6. Layout Profesional

- ✅ **Sidebar** con navegación y branding
- ✅ **Topbar** con breadcrumb dinámico y acciones
- ✅ **Footer** informativo
- ✅ **Responsive**: Sidebar colapsable en móvil con overlay
- ✅ **Gradientes y sombras** para jerarquía visual

---

## 🎨 Características de UX/UI

### Estados de UI Completos

1. **Loading States**
   - Skeleton loaders con animación shimmer
   - Spinners en botones de acción
   - Indicadores durante ejecución de checks

2. **Error States**
   - Mensajes descriptivos para cada tipo de error
   - Botón de reintento con loading state
   - Feedback visual en formularios

3. **Empty States**
   - Iconos ilustrativos
   - Mensajes contextuales (sin filtros vs con filtros)
   - CTAs claros para próxima acción

4. **Success States**
   - Badges de estado con colores semánticos
   - Iconos animados durante ejecución
   - Mensajes de confirmación

### Diseño Visual

- **Paleta de colores**: Indigo/Purple (primario), Emerald (éxito), Red (error)
- **Tipografía**: Sistema font stack para rendimiento
- **Espaciado**: Sistema consistente de 4/8px base
- **Sombras**: Elevación progresiva para jerarquía
- **Animaciones**: Transiciones suaves de 200-300ms

---

## 🔧 Trade-offs y Decisiones

### ✅ Decisiones Tomadas

| Decisión                           | Justificación                                                                                                             |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **No usar Pinia/Vuex**             | Para el alcance del proyecto, estado local + servicios es suficiente. Evita over-engineering y mantiene el código simple. |
| **TailwindCSS inline**             | Prioriza velocidad de desarrollo sobre organización CSS. Para un producto real, consideraría CSS modules + Tailwind.      |
| **Mock API en memoria**            | Sin persistencia para simplicidad. En producción, usaría localStorage o IndexedDB para modo offline.                      |
| **Polling en lugar de WebSockets** | Más simple de implementar para la simulación. WebSockets sería ideal para producción.                                     |
| **Tests enfocados**                | Creé tests estratégicos en servicios y componentes UI para demostrar cobertura sin ser exhaustivo.                        |

### ⚖️ Trade-offs Conscientes

1. **Simplicidad vs Escalabilidad**: Preferí código directo y fácil de entender sobre abstracciones complejas. Si esto creciera mucho, buscaría la manera de refactorizarlo.

2. **Velocidad vs Perfección**: Me enfoqué en tener todas las funcionalidades funcionando bien antes que optimizaciones prematuras. Prioricé que todo se viera y funcionara profesional.

3. **Mock vs Real API**: La simulación es bastante realista (latencias, errores, paginación real), pero obviamente no es una API de verdad. En producción usaría algo como MSW para tests más robustos.

---

## 📚 Próximos Pasos / Mejoras Pendientes

### Prioridad Alta (Next Sprint)

1. **Más Tests**
   - Ampliar cobertura de tests
   - Tests de componentes más complejos (AuditFilters, CheckList)
   - Tests de integración del flujo completo

2. **Accesibilidad Mejorada**
   - ARIA labels en todos los elementos interactivos
   - Focus trap en modales (si se agregan)
   - Navegación completa por teclado
   - Testeo con screen readers

3. **Optimizaciones de Rendimiento**
   - Virtualización de listas largas si crecen a >100 items
   - Debouncing en búsqueda (actualmente es instantáneo)
   - Lazy loading de rutas y componentes pesados

### Prioridad Media (Future Releases)

4. **Toast/Snackbar Notifications**
   - Sistema de notificaciones global
   - Feedback visual no intrusivo para acciones
   - Stack de múltiples toasts

5. **Modo Offline**
   - Caché con localStorage/IndexedDB
   - Service Worker para offline-first
   - Sincronización cuando vuelve conexión

6. **UI Optimista con Rollback**
   - Actualización inmediata en UI
   - Rollback automático si falla la operación
   - Retry queue para operaciones fallidas

7. **Exportación de Datos**
   - Export a PDF con resumen ejecutivo
   - Export a Excel para análisis
   - Impresión optimizada

### Prioridad Baja (Nice to Have)

8. **Dashboard Analítico**
   - Gráficos de progreso global
   - KPIs de auditorías completadas
   - Tendencias temporales

9. **Colaboración**
   - Comentarios en checks
   - Asignación de tareas
   - Historial de cambios (audit log)

10. **Personalización**
    - Temas (modo oscuro)
    - Customización de columnas/vistas
    - Preferencias guardadas por usuario

---

## 🧪 Testing

He implementado una suite de tests unitarios que cubre las partes clave del proyecto. No es exhaustiva, pero demuestra testing de diferentes capas.

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm run test:unit

# Modo watch para desarrollo
npm run test:unit -- --watch

# Ver coverage
npm run test:unit -- --coverage
```

### Cobertura Actual

**✅ 35 tests implementados** distribuidos en:

```
src/
├── services/
│   ├── mockApi.spec.js       # ✅ 15 tests (paginación, filtros, ordenación)
│   └── auditService.spec.js  # ✅ 3 tests (templates, owners, processes)
├── components/
│   └── ui/
│       ├── Badge.spec.js     # ✅ 6 tests (variantes, slots, CSS)
│       └── Pagination.spec.js # ✅ 9 tests (navegación, eventos, edge cases)
└── __tests__/
    └── App.spec.js           # ✅ 2 tests (renderizado, routing)
```

**Qué cubren los tests:**

- Funciones de utilidad del mock API (filtrado, paginación, ordenación)
- Servicios básicos de obtención de datos
- Componentes UI reutilizables (props, eventos, renderizado)
- Integración básica del layout

**Nota:** Los tests de servicios incluyen retry logic porque la API mock simula errores aleatorios (15% de tasa de fallo) para ser más realista. Esto es intencional y refleja condiciones del mundo real.

---

## 🏗️ Estructura de Datos

### Auditoría (Audit)

```typescript
{
  id: string // "aud_1001"
  name: string // "Auditoría ISO 27001 - Compras"
  process: string // "Compras"
  status: Status // DRAFT | IN_PROGRESS | DONE | DONE_WITH_ISSUES | BLOCKED
  progress: number // 0-100
  owner: Owner // { id, name }
  targetDate: string // "2026-03-20" (ISO date)
  updatedAt: string // ISO timestamp
  createdAt: string // ISO timestamp
  templateId: string // "tpl_10"
}
```

### Check (Verificación)

```typescript
{
  id: string // "aud_1001_chk_001"
  title: string // "Verificar control de acceso"
  priority: Priority // LOW | MEDIUM | HIGH
  status: CheckStatus // PENDING | QUEUED | RUNNING | OK | KO
  evidence: string // Texto descriptivo del resultado
  reviewed: boolean // Marcado manualmente vs automático
  updatedAt: string // ISO timestamp
}
```

### Template (Plantilla)

```typescript
{
  id: string // "tpl_10"
  name: string // "ISO 27001 Base"
  process: string // "Seguridad"
  checkCount: number // 24
  checksPreview: Array<{
    title: string
    priority: Priority
  }>
}
```

---

## 🌐 Browser Support

- Chrome/Edge >= 90
- Firefox >= 88
- Safari >= 14
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 📦 Build de Producción

```bash
# 1. Generar build optimizado
npm run build

# 2. Preview local del build
npm run preview

# Salida en: dist/
# - Assets optimizados y minificados
# - Code splitting automático
# - Source maps para debugging
```

### Optimizaciones Aplicadas (Vite)

- Tree shaking automático
- Code splitting por rutas
- Minificación con esbuild
- Compresión de assets
- Cache busting con hashes

---

## 👥 Equipo

**Desarrollador**: Kevin Antonio Suárez Sánchez
**Prueba Técnica**: Vega  
**Fecha**: Febrero 2026

---

## 💡 Notas Adicionales

### Simulación Realista

La API mock implementa comportamientos realistas:

1. **Latencia variable** para simular condiciones de red reales
2. **Errores aleatorios** para probar manejo de edge cases
3. **Ejecución progresiva** que simula procesamiento backend
4. **Consistencia de estado** mantenida en todo momento

### Patrones de Diseño Aplicados

- **Service Layer**: Abstracción de lógica de datos
- **Composition Pattern**: Componentes pequeños y componibles
- **Observer Pattern**: Reactivity de Vue para actualizaciones
- **Strategy Pattern**: Diferentes estrategias de ejecución de checks
