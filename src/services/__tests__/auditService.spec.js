import { describe, it, expect } from 'vitest'
import { getTemplates, getOwners, getProcesses } from '../auditService.js'

// Nota: Estos tests pueden fallar ocasionalmente debido al 15% de errorRate simulado
// Esto demuestra el comportamiento realista de la API mock

describe('auditService', () => {
  describe('getTemplates', () => {
    it('should return array of templates', async () => {
      // Retry logic para manejar error rate
      let result
      for (let i = 0; i < 5; i++) {
        try {
          result = await getTemplates()
          break
        } catch (e) {
          if (i === 4) throw e
        }
      }

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      expect(result[0]).toHaveProperty('id')
      expect(result[0]).toHaveProperty('name')
      expect(result[0]).toHaveProperty('checkCount')
    })
  })

  describe('getOwners', () => {
    it('should return array of owners', async () => {
      let result
      for (let i = 0; i < 5; i++) {
        try {
          result = await getOwners()
          break
        } catch (e) {
          if (i === 4) throw e
        }
      }

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      expect(result[0]).toHaveProperty('id')
      expect(result[0]).toHaveProperty('name')
    })
  })

  describe('getProcesses', () => {
    it('should return array of processes', async () => {
      let result
      for (let i = 0; i < 5; i++) {
        try {
          result = await getProcesses()
          break
        } catch (e) {
          if (i === 4) throw e
        }
      }

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      expect(typeof result[0]).toBe('string')
    })
  })
})

describe('auditService', () => {
  beforeEach(() => {
    resetData()
  })

  describe('getAudits', () => {
    it('should return paginated audits', async () => {
      const result = await getAudits({ page: 1, pageSize: 10 })

      expect(result).toHaveProperty('items')
      expect(result).toHaveProperty('total')
      expect(result).toHaveProperty('page')
      expect(result).toHaveProperty('totalPages')
      expect(Array.isArray(result.items)).toBe(true)
      expect(result.items.length).toBeLessThanOrEqual(10)
    })

    it('should filter audits by status', async () => {
      const result = await getAudits({ status: 'DRAFT', pageSize: 100 })

      expect(result.items.every((audit) => audit.status === 'DRAFT')).toBe(true)
    })

    it('should filter audits by search query', async () => {
      const result = await getAudits({ q: 'ISO', pageSize: 100 })

      expect(
        result.items.every(
          (audit) =>
            audit.name.toLowerCase().includes('iso') || audit.id.toLowerCase().includes('iso'),
        ),
      ).toBe(true)
    })

    it('should sort audits', async () => {
      const result = await getAudits({ sort: 'progress:desc', pageSize: 100 })

      for (let i = 0; i < result.items.length - 1; i++) {
        expect(result.items[i].progress).toBeGreaterThanOrEqual(result.items[i + 1].progress)
      }
    })
  })

  describe('getAuditById', () => {
    it('should return audit with checks', async () => {
      const audits = await getAudits({ pageSize: 1 })
      const auditId = audits.items[0].id

      const result = await getAuditById(auditId)

      expect(result).toHaveProperty('audit')
      expect(result).toHaveProperty('checks')
      expect(result.audit.id).toBe(auditId)
      expect(Array.isArray(result.checks)).toBe(true)
    })

    it('should throw error for non-existent audit', async () => {
      try {
        await getAuditById('non-existent-id')
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.message).toContain('no encontrada')
      }
    })
  })

  describe('getTemplates', () => {
    it('should return array of templates', async () => {
      const result = await getTemplates()

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      expect(result[0]).toHaveProperty('id')
      expect(result[0]).toHaveProperty('name')
      expect(result[0]).toHaveProperty('checkCount')
      expect(result[0]).toHaveProperty('checksPreview')
    })
  })

  describe('getOwners', () => {
    it('should return array of owners', async () => {
      const result = await getOwners()

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      expect(result[0]).toHaveProperty('id')
      expect(result[0]).toHaveProperty('name')
    })
  })

  describe('getProcesses', () => {
    it('should return array of processes', async () => {
      const result = await getProcesses()

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      expect(typeof result[0]).toBe('string')
    })
  })

  describe('createAudit', () => {
    it('should create new audit with checks', async () => {
      const templates = await getTemplates()
      const owners = await getOwners()

      const newAuditData = {
        name: 'Test Audit',
        process: 'Compras',
        ownerId: owners[0].id,
        targetDate: '2026-12-31',
        templateId: templates[0].id,
      }

      const result = await createAudit(newAuditData)

      expect(result).toHaveProperty('audit')
      expect(result).toHaveProperty('checks')
      expect(result.audit.name).toBe('Test Audit')
      expect(result.audit.status).toBe('DRAFT')
      expect(result.audit.progress).toBe(0)
      expect(result.checks.length).toBe(templates[0].checkCount)
      expect(result.checks.every((check) => check.status === 'PENDING')).toBe(true)
    })

    it('should throw error when missing required fields', async () => {
      try {
        await createAudit({ name: 'Test' })
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error.message).toContain('campos requeridos')
      }
    })

    it('should add new audit to the list', async () => {
      const templates = await getTemplates()
      const owners = await getOwners()

      const initialAudits = await getAudits({ pageSize: 100 })
      const initialCount = initialAudits.total

      await createAudit({
        name: 'New Test Audit',
        process: 'TI',
        ownerId: owners[0].id,
        targetDate: '2026-12-31',
        templateId: templates[0].id,
      })

      const updatedAudits = await getAudits({ pageSize: 100 })
      expect(updatedAudits.total).toBe(initialCount + 1)
    })
  })
})
