// Audit Service - Capa de servicios para operaciones con auditorías

import { audits, auditChecks, TEMPLATES, OWNERS, PROCESSES } from '../data/mockData.js'
import { mockApiCall, paginate, filterItems, sortItems } from './mockApi.js'

// Almacenamiento en memoria para modificaciones en tiempo de ejecución
let runtimeAudits = [...audits]
let runtimeChecks = JSON.parse(JSON.stringify(auditChecks))
let nextAuditId = 1061
let runningExecutions = new Map()

/**
 * GET /audits - Obtener listado de auditorías con paginación y filtros
 */
export async function getAudits(params = {}) {
  return mockApiCall(() => {
    const {
      page = 1,
      pageSize = 12,
      q = '',
      status = '',
      process = '',
      ownerId = '',
      sort = 'updatedAt:desc',
    } = params

    // Parsear parámetro de ordenación
    const [sortBy, sortOrder] = sort.split(':')

    // Filtrar auditorías
    let filtered = filterItems(runtimeAudits, { q, status, process, ownerId })

    // Ordenar auditorías
    filtered = sortItems(filtered, sortBy, sortOrder)

    // Paginar resultados
    return paginate(filtered, parseInt(page), parseInt(pageSize))
  })
}

/**
 * GET /audits/:id - Obtener detalle de auditoría con checks
 */
export async function getAuditById(id) {
  return mockApiCall(() => {
    const audit = runtimeAudits.find((a) => a.id === id)

    if (!audit) {
      throw new Error('Auditoría no encontrada')
    }

    const checks = runtimeChecks[id] || []

    return {
      audit,
      checks,
    }
  })
}

/**
 * GET /templates - Obtener listado de plantillas
 */
export async function getTemplates() {
  return mockApiCall(() => {
    return TEMPLATES
  })
}

/**
 * GET /owners - Obtener listado de responsables
 */
export async function getOwners() {
  return mockApiCall(() => {
    return OWNERS
  })
}

/**
 * GET /processes - Obtener listado de procesos
 */
export async function getProcesses() {
  return mockApiCall(() => {
    return PROCESSES
  })
}

/**
 * POST /audits - Crear nueva auditoría desde wizard
 */
export async function createAudit(data) {
  return mockApiCall(
    () => {
      const { name, process, ownerId, targetDate, templateId } = data

      // Validar campos requeridos
      if (!name || !process || !ownerId || !templateId) {
        throw new Error('Faltan campos requeridos')
      }

      const owner = OWNERS.find((o) => o.id === ownerId)
      if (!owner) {
        throw new Error('Responsable no encontrado')
      }

      const template = TEMPLATES.find((t) => t.id === templateId)
      if (!template) {
        throw new Error('Plantilla no encontrada')
      }

      // Generar ID de auditoría
      const auditId = `aud_${String(nextAuditId++).padStart(4, '0')}`

      // Crear auditoría
      const now = new Date().toISOString()
      const newAudit = {
        id: auditId,
        name,
        process,
        status: 'DRAFT',
        progress: 0,
        owner,
        targetDate:
          targetDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        updatedAt: now,
        createdAt: now,
        templateId,
      }

      // Generar checks desde la plantilla
      const checks = []
      for (let i = 0; i < template.checkCount; i++) {
        const previewCheck = template.checksPreview[i % template.checksPreview.length]
        checks.push({
          id: `${auditId}_chk_${String(i + 1).padStart(3, '0')}`,
          title:
            previewCheck.title +
            (i >= template.checksPreview.length
              ? ` (${Math.floor(i / template.checksPreview.length) + 1})`
              : ''),
          priority: previewCheck.priority,
          status: 'PENDING',
          evidence: '',
          reviewed: false,
          updatedAt: now,
        })
      }

      // Guardar en almacenamiento runtime
      runtimeAudits.unshift(newAudit)
      runtimeChecks[auditId] = checks

      return {
        audit: newAudit,
        checks,
      }
    },
    { errorRate: 0.05 },
  ) // Menor tasa de error para creación
}

/**
 * POST /audits/:id/run - Iniciar ejecución de auditoría
 */
export async function runAudit(id) {
  return mockApiCall(
    async () => {
      const audit = runtimeAudits.find((a) => a.id === id)

      if (!audit) {
        throw new Error('Auditoría no encontrada')
      }

      if (audit.status === 'DONE') {
        throw new Error('La auditoría ya está completada')
      }

      // Actualizar estado de auditoría
      audit.status = 'IN_PROGRESS'
      audit.updatedAt = new Date().toISOString()

      // Iniciar ejecución progresiva
      const runId = `run_${Date.now()}`
      startProgressiveExecution(id, runId)

      return {
        runId,
        message: 'Ejecución iniciada correctamente',
      }
    },
    { errorRate: 0.05 },
  )
}

/**
 * Ejecución progresiva de checks (simulada)
 */
function startProgressiveExecution(auditId, runId) {
  const audit = runtimeAudits.find((a) => a.id === auditId)
  const checks = runtimeChecks[auditId] || []

  if (!audit || checks.length === 0) return

  // Filtrar solo checks pendientes
  const pendingChecks = checks.filter((c) => c.status === 'PENDING')

  if (pendingChecks.length === 0) {
    updateAuditProgress(auditId)
    return
  }

  let currentIndex = 0

  const executeNextCheck = () => {
    if (currentIndex >= pendingChecks.length) {
      // Ejecución completada
      updateAuditProgress(auditId)
      runningExecutions.delete(auditId)
      return
    }

    const check = pendingChecks[currentIndex]

    // QUEUED
    check.status = 'QUEUED'
    check.updatedAt = new Date().toISOString()

    setTimeout(
      () => {
        // RUNNING
        check.status = 'RUNNING'
        check.updatedAt = new Date().toISOString()

        setTimeout(
          () => {
            // OK o KO (15% tasa de fallo)
            check.status = Math.random() > 0.15 ? 'OK' : 'KO'
            check.evidence =
              check.status === 'OK'
                ? 'Verificación automática completada exitosamente. Todos los controles están implementados correctamente.'
                : 'Se detectaron problemas que requieren revisión. Se debe implementar plan de acción correctiva.'
            check.reviewed = false
            check.updatedAt = new Date().toISOString()

            // Actualizar auditoría
            audit.updatedAt = new Date().toISOString()

            currentIndex++
            executeNextCheck()
          },
          Math.random() * 1000 + 500,
        ) // Tiempo de ejecución: 500-1500ms
      },
      Math.random() * 500 + 200,
    ) // Tiempo en cola: 200-700ms
  }

  runningExecutions.set(auditId, runId)
  executeNextCheck()
}

/**
 * Actualizar progreso de auditoría basado en checks
 */
function updateAuditProgress(auditId) {
  const audit = runtimeAudits.find((a) => a.id === auditId)
  const checks = runtimeChecks[auditId] || []

  if (!audit || checks.length === 0) return

  const completedChecks = checks.filter((c) => c.status === 'OK' || c.status === 'KO')
  const progress = Math.round((completedChecks.length / checks.length) * 100)

  audit.progress = progress
  audit.updatedAt = new Date().toISOString()

  // Actualizar estado cuando se completan todos los checks
  if (progress === 100) {
    const hasKO = checks.some((c) => c.status === 'KO')
    // Si todos están OK -> DONE
    // Si hay algún KO -> DONE_WITH_ISSUES (completada pero con incidencias que requieren atención)
    audit.status = hasKO ? 'DONE_WITH_ISSUES' : 'DONE'
  }
}

/**
 * POST /audits/:id/checks/:checkId/execute - Ejecutar un check individual automáticamente
 */
export async function executeCheck(auditId, checkId) {
  return mockApiCall(
    async () => {
      const audit = runtimeAudits.find((a) => a.id === auditId)
      const checks = runtimeChecks[auditId]

      if (!audit || !checks) {
        throw new Error('Auditoría no encontrada')
      }

      const check = checks.find((c) => c.id === checkId)

      if (!check) {
        throw new Error('Check no encontrado')
      }

      if (check.status !== 'PENDING') {
        throw new Error('El check ya ha sido ejecutado')
      }

      // Actualizar estado de auditoría a IN_PROGRESS si es DRAFT
      if (audit.status === 'DRAFT') {
        audit.status = 'IN_PROGRESS'
        audit.updatedAt = new Date().toISOString()
      }

      // Simular ejecución progresiva
      check.status = 'QUEUED'
      check.updatedAt = new Date().toISOString()

      // Simular ejecución asíncrona
      setTimeout(
        () => {
          check.status = 'RUNNING'
          check.updatedAt = new Date().toISOString()

          setTimeout(
            () => {
              // 15% de probabilidad de KO
              const isOk = Math.random() > 0.15
              check.status = isOk ? 'OK' : 'KO'
              check.evidence = isOk
                ? 'Verificación automática completada exitosamente. Todos los controles están implementados correctamente.'
                : 'Se detectaron problemas que requieren revisión. Se debe implementar plan de acción correctiva.'
              check.reviewed = false
              check.updatedAt = new Date().toISOString()

              audit.updatedAt = new Date().toISOString()
              updateAuditProgress(auditId)
            },
            Math.random() * 1000 + 500,
          )
        },
        Math.random() * 500 + 200,
      )

      return { message: 'Ejecución iniciada' }
    },
    { errorRate: 0.05 },
  )
}

/**
 * PATCH /audits/:id/checks/:checkId - Actualizar un check manualmente
 */
export async function updateCheckManual(auditId, checkId, status, evidence = '') {
  return mockApiCall(
    () => {
      const audit = runtimeAudits.find((a) => a.id === auditId)
      const checks = runtimeChecks[auditId]

      if (!audit || !checks) {
        throw new Error('Auditoría no encontrada')
      }

      const check = checks.find((c) => c.id === checkId)

      if (!check) {
        throw new Error('Check no encontrado')
      }

      if (!['OK', 'KO'].includes(status)) {
        throw new Error('Estado inválido. Debe ser OK o KO')
      }

      // Actualizar estado de auditoría a IN_PROGRESS si es DRAFT
      if (audit.status === 'DRAFT') {
        audit.status = 'IN_PROGRESS'
        audit.updatedAt = new Date().toISOString()
      }

      // Actualizar check
      check.status = status
      check.evidence =
        evidence ||
        (status === 'OK'
          ? 'Verificación manual completada exitosamente.'
          : 'Marcado como fallido manualmente.')
      check.reviewed = true
      check.updatedAt = new Date().toISOString()

      // Actualizar progreso de la auditoría
      updateAuditProgress(auditId)

      // Actualizar timestamp de la auditoría
      audit.updatedAt = new Date().toISOString()

      return check
    },
    { errorRate: 0.05 },
  )
}

/**
 * PATCH /audits/:id/checks/:checkId - Actualizar un check (genérico)
 */
export async function updateCheck(auditId, checkId, data) {
  return mockApiCall(
    () => {
      const checks = runtimeChecks[auditId]

      if (!checks) {
        throw new Error('Auditoría no encontrada')
      }

      const check = checks.find((c) => c.id === checkId)

      if (!check) {
        throw new Error('Check no encontrado')
      }

      // Actualizar campos del check
      Object.assign(check, data, {
        updatedAt: new Date().toISOString(),
      })

      // Actualizar progreso de la auditoría
      updateAuditProgress(auditId)

      // Actualizar timestamp de la auditoría
      const audit = runtimeAudits.find((a) => a.id === auditId)
      if (audit) {
        audit.updatedAt = new Date().toISOString()
      }

      return check
    },
    { errorRate: 0.05 },
  )
}

/**
 * Resetear datos (para testing)
 */
export function resetData() {
  runtimeAudits = [...audits]
  runtimeChecks = JSON.parse(JSON.stringify(auditChecks))
  nextAuditId = 1061
  runningExecutions.clear()
}
