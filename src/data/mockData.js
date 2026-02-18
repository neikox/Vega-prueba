// Generador de datos mock para el sistema de gestión de auditorías

// Procesos (4-8 elementos)
export const PROCESSES = [
  'Compras',
  'Ventas',
  'Seguridad',
  'RRHH',
  'Operaciones',
  'Finanzas',
  'TI',
  'Calidad'
]

// Responsables (6-12 elementos)
export const OWNERS = [
  { id: 'u_1', name: 'Ana López' },
  { id: 'u_2', name: 'Carlos García' },
  { id: 'u_3', name: 'María Rodríguez' },
  { id: 'u_4', name: 'Juan Martínez' },
  { id: 'u_5', name: 'Laura Sánchez' },
  { id: 'u_6', name: 'Pedro Fernández' },
  { id: 'u_7', name: 'Carmen Díaz' },
  { id: 'u_8', name: 'Miguel Torres' },
  { id: 'u_9', name: 'Isabel Ruiz' },
  { id: 'u_10', name: 'Francisco Moreno' },
  { id: 'u_11', name: 'Elena Jiménez' },
  { id: 'u_12', name: 'Antonio Álvarez' }
]

// Plantillas (5-10 elementos)
export const TEMPLATES = [
  {
    id: 'tpl_1',
    name: 'ISO 27001 Base',
    process: 'Seguridad',
    checkCount: 24,
    checksPreview: [
      { title: 'Gestión de accesos', priority: 'HIGH' },
      { title: 'Backup y recuperación', priority: 'MEDIUM' },
      { title: 'Control de cambios en producción', priority: 'HIGH' },
      { title: 'Monitoreo de seguridad', priority: 'MEDIUM' },
      { title: 'Cifrado de datos sensibles', priority: 'HIGH' }
    ]
  },
  {
    id: 'tpl_2',
    name: 'ISO 9001 Calidad',
    process: 'Calidad',
    checkCount: 18,
    checksPreview: [
      { title: 'Documentación de procesos', priority: 'HIGH' },
      { title: 'Control de no conformidades', priority: 'HIGH' },
      { title: 'Satisfacción del cliente', priority: 'MEDIUM' },
      { title: 'Auditorías internas', priority: 'MEDIUM' }
    ]
  },
  {
    id: 'tpl_3',
    name: 'Compliance Financiero',
    process: 'Finanzas',
    checkCount: 15,
    checksPreview: [
      { title: 'Segregación de funciones', priority: 'HIGH' },
      { title: 'Conciliaciones bancarias', priority: 'MEDIUM' },
      { title: 'Revisión de gastos', priority: 'LOW' },
      { title: 'Autorización de pagos', priority: 'HIGH' }
    ]
  },
  {
    id: 'tpl_4',
    name: 'GDPR Protección de Datos',
    process: 'TI',
    checkCount: 22,
    checksPreview: [
      { title: 'Consentimiento de datos', priority: 'HIGH' },
      { title: 'Derecho al olvido', priority: 'HIGH' },
      { title: 'Registro de actividades', priority: 'MEDIUM' },
      { title: 'Evaluación de impacto', priority: 'MEDIUM' }
    ]
  },
  {
    id: 'tpl_5',
    name: 'SOX Controles Internos',
    process: 'Finanzas',
    checkCount: 30,
    checksPreview: [
      { title: 'Control de activos fijos', priority: 'HIGH' },
      { title: 'Autorización de transacciones', priority: 'HIGH' },
      { title: 'Revisión de reconciliaciones', priority: 'MEDIUM' },
      { title: 'Cierre contable mensual', priority: 'HIGH' }
    ]
  },
  {
    id: 'tpl_6',
    name: 'Auditoría Compras',
    process: 'Compras',
    checkCount: 16,
    checksPreview: [
      { title: 'Verificar control de acceso a proveedores', priority: 'MEDIUM' },
      { title: 'Homologación de proveedores', priority: 'HIGH' },
      { title: 'Contratos vigentes', priority: 'LOW' },
      { title: 'Órdenes de compra autorizadas', priority: 'HIGH' }
    ]
  },
  {
    id: 'tpl_7',
    name: 'RRHH Compliance',
    process: 'RRHH',
    checkCount: 20,
    checksPreview: [
      { title: 'Contratos laborales vigentes', priority: 'HIGH' },
      { title: 'Nóminas y retenciones', priority: 'HIGH' },
      { title: 'Formación obligatoria', priority: 'MEDIUM' },
      { title: 'Evaluaciones de desempeño', priority: 'LOW' }
    ]
  },
  {
    id: 'tpl_8',
    name: 'Operaciones Logística',
    process: 'Operaciones',
    checkCount: 14,
    checksPreview: [
      { title: 'Control de inventario', priority: 'HIGH' },
      { title: 'Trazabilidad de productos', priority: 'MEDIUM' },
      { title: 'Mantenimiento de equipos', priority: 'LOW' },
      { title: 'Gestión de almacén', priority: 'MEDIUM' }
    ]
  }
]

// Plantillas de checks para generar verificaciones realistas
const CHECK_TEMPLATES = {
  'Seguridad': [
    'Verificar control de acceso físico a instalaciones críticas',
    'Revisar políticas de seguridad de la información',
    'Validar backup de datos críticos',
    'Comprobar logs de acceso a sistemas',
    'Auditar privilegios de administrador',
    'Verificar cifrado de comunicaciones',
    'Revisar gestión de vulnerabilidades',
    'Validar plan de respuesta a incidentes',
    'Comprobar actualización de parches de seguridad',
    'Auditar controles de red y firewall'
  ],
  'Calidad': [
    'Verificar calibración de equipos de medición',
    'Revisar procedimientos operativos estándar',
    'Validar registros de no conformidades',
    'Comprobar acciones correctivas implementadas',
    'Auditar satisfacción del cliente',
    'Verificar trazabilidad de productos',
    'Revisar indicadores de calidad',
    'Validar auditorías internas realizadas'
  ],
  'Finanzas': [
    'Verificar segregación de funciones financieras',
    'Revisar conciliaciones bancarias mensuales',
    'Validar autorización de transacciones',
    'Comprobar cierre contable trimestral',
    'Auditar control de activos fijos',
    'Verificar provisiones y reservas',
    'Revisar cumplimiento presupuestario',
    'Validar documentación de gastos',
    'Comprobar arqueos de caja',
    'Auditar políticas de crédito y cobranza'
  ],
  'TI': [
    'Verificar gestión de cambios en sistemas',
    'Revisar logs de acceso a datos personales',
    'Validar backup y recuperación de datos',
    'Comprobar licenciamiento de software',
    'Auditar políticas de contraseñas',
    'Verificar documentación técnica actualizada',
    'Revisar plan de continuidad de negocio',
    'Validar controles de acceso a bases de datos'
  ],
  'Compras': [
    'Verificar control de acceso a proveedores',
    'Revisar proceso de homologación',
    'Validar contratos vigentes con proveedores',
    'Comprobar órdenes de compra autorizadas',
    'Auditar precios negociados',
    'Verificar recepción de mercancías',
    'Revisar evaluación de proveedores',
    'Validar proceso de tres cotizaciones'
  ],
  'RRHH': [
    'Verificar contratos laborales firmados',
    'Revisar cálculo de nóminas',
    'Validar retenciones fiscales',
    'Comprobar expedientes de personal completos',
    'Auditar formación obligatoria completada',
    'Verificar evaluaciones de desempeño',
    'Revisar control de asistencia',
    'Validar altas y bajas en seguridad social'
  ],
  'Operaciones': [
    'Verificar control de inventario físico',
    'Revisar procedimientos de producción',
    'Validar trazabilidad de lotes',
    'Comprobar mantenimiento preventivo',
    'Auditar gestión de mermas',
    'Verificar cumplimiento de KPIs operativos',
    'Revisar gestión de almacén',
    'Validar capacidad de producción'
  ],
  'Ventas': [
    'Verificar proceso de cotización',
    'Revisar autorizaciones de descuentos',
    'Validar contratos con clientes',
    'Comprobar cumplimiento de objetivos',
    'Auditar cartera de clientes',
    'Verificar proceso de facturación',
    'Revisar gestión de crédito a clientes',
    'Validar seguimiento post-venta'
  ]
}

// Funciones de utilidad
function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function formatDateTime(date) {
  return date.toISOString()
}

// Generar checks para una auditoría basada en plantilla
function generateChecks(auditId, templateId) {
  const template = TEMPLATES.find(t => t.id === templateId)
  if (!template) return []

  const checks = []
  const checkPool = CHECK_TEMPLATES[template.process] || CHECK_TEMPLATES['Seguridad']
  const checkCount = template.checkCount

  for (let i = 0; i < checkCount; i++) {
    const baseTitle = checkPool[i % checkPool.length]
    const title = i >= checkPool.length ? `${baseTitle} (${Math.floor(i / checkPool.length) + 1})` : baseTitle
    
    checks.push({
      id: `chk_${auditId}_${String(i + 1).padStart(3, '0')}`,
      title,
      priority: randomItem(template.checksPreview).priority,
      status: 'PENDING',
      evidence: '',
      reviewed: false,
      updatedAt: formatDateTime(new Date())
    })
  }

  return checks
}

// Generar auditoría individual
function generateAudit(index) {
  const template = randomItem(TEMPLATES)
  const owner = randomItem(OWNERS)
  const status = randomItem(['DRAFT', 'IN_PROGRESS', 'DONE', 'BLOCKED'])
  
  // Generar progreso basado en el estado (regla de coherencia)
  let progress = 0
  if (status === 'DRAFT') {
    progress = 0
  } else if (status === 'DONE') {
    progress = 100
  } else if (status === 'IN_PROGRESS') {
    progress = randomInt(5, 95)
  } else if (status === 'BLOCKED') {
    progress = randomInt(15, 75)
  }
  
  const createdAt = randomDate(new Date('2025-06-01'), new Date('2026-01-31'))
  const updatedAt = randomDate(createdAt, new Date('2026-02-18'))
  const targetDate = randomDate(new Date('2026-02-20'), new Date('2026-08-31'))
  
  const processVariant = randomItem(PROCESSES)
  
  return {
    id: `aud_${String(1000 + index).padStart(4, '0')}`,
    name: `Auditoría ${template.name} - ${processVariant}`,
    process: template.process,
    status,
    progress,
    owner,
    targetDate: targetDate.toISOString().split('T')[0],
    updatedAt: formatDateTime(updatedAt),
    createdAt: formatDateTime(createdAt),
    templateId: template.id
  }
}

// Generar todas las auditorías (40-80 elementos)
export function generateAudits() {
  const audits = []
  const auditCount = 60 // Punto medio del rango 40-80
  
  for (let i = 1; i <= auditCount; i++) {
    audits.push(generateAudit(i))
  }
  
  return audits
}

// Generar checks para todas las auditorías
export function generateAuditChecks(audits) {
  const auditChecks = {}
  
  audits.forEach(audit => {
    const checks = generateChecks(audit.id, audit.templateId)
    
    // Actualizar estados de checks basados en el progreso de la auditoría
    if (audit.status !== 'DRAFT' && audit.progress > 0) {
      const completedCount = Math.floor((audit.progress / 100) * checks.length)
      
      for (let i = 0; i < completedCount; i++) {
        // 85% tasa de éxito, 15% tasa de fallo
        const isSuccess = Math.random() > 0.15
        checks[i].status = isSuccess ? 'OK' : 'KO'
        checks[i].reviewed = Math.random() > 0.3 // 70% revisados
        
        if (isSuccess) {
          checks[i].evidence = 'Verificación completada exitosamente. Todos los controles están implementados correctamente.'
        } else {
          checks[i].evidence = 'Se identificaron incidencias que requieren atención. Se debe implementar plan de acción correctiva.'
        }
        
        checks[i].updatedAt = formatDateTime(new Date(audit.updatedAt))
      }
    }
    
    auditChecks[audit.id] = checks
  })
  
  return auditChecks
}

// Generar datos iniciales
export const audits = generateAudits()
export const auditChecks = generateAuditChecks(audits)

// Exportar resumen para referencia
export const DATA_SUMMARY = {
  totalAudits: audits.length,
  totalProcesses: PROCESSES.length,
  totalOwners: OWNERS.length,
  totalTemplates: TEMPLATES.length,
  checksPerAudit: {
    min: Math.min(...TEMPLATES.map(t => t.checkCount)),
    max: Math.max(...TEMPLATES.map(t => t.checkCount)),
    avg: Math.round(TEMPLATES.reduce((sum, t) => sum + t.checkCount, 0) / TEMPLATES.length)
  }
}
