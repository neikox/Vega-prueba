import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mockApiCall, paginate, filterItems, sortItems } from '../mockApi.js'

describe('mockApi', () => {
  describe('mockApiCall', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should add latency to API calls', async () => {
      const mockFn = vi.fn(() => 'result')
      const promise = mockApiCall(mockFn, {
        latency: true,
        minDelay: 500,
        maxDelay: 500,
        errorRate: 0,
      })

      // Avanzar el tiempo
      vi.advanceTimersByTime(499)
      await Promise.resolve() // Flush promises

      expect(mockFn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(1)
      await promise

      expect(mockFn).toHaveBeenCalled()
    })

    it('should execute function without latency when disabled', async () => {
      const mockFn = vi.fn(() => 'result')
      const result = await mockApiCall(mockFn, { latency: false, errorRate: 0 })

      expect(mockFn).toHaveBeenCalled()
      expect(result).toBe('result')
    })

    it('should throw error based on errorRate', async () => {
      const mockFn = vi.fn(() => 'result')

      // Forzar error (100% error rate)
      try {
        await mockApiCall(mockFn, { latency: false, errorRate: 1 })
        expect.fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBeTruthy()
      }
    })
  })

  describe('paginate', () => {
    it('should paginate items correctly', () => {
      const items = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }))
      const result = paginate(items, 1, 10)

      expect(result.items).toHaveLength(10)
      expect(result.items[0].id).toBe(1)
      expect(result.total).toBe(25)
      expect(result.totalPages).toBe(3)
      expect(result.page).toBe(1)
      expect(result.hasNext).toBe(true)
      expect(result.hasPrev).toBe(false)
    })

    it('should handle last page correctly', () => {
      const items = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }))
      const result = paginate(items, 3, 10)

      expect(result.items).toHaveLength(5)
      expect(result.page).toBe(3)
      expect(result.hasNext).toBe(false)
      expect(result.hasPrev).toBe(true)
    })

    it('should handle empty array', () => {
      const result = paginate([], 1, 10)

      expect(result.items).toHaveLength(0)
      expect(result.total).toBe(0)
      expect(result.totalPages).toBe(1)
    })
  })

  describe('filterItems', () => {
    const items = [
      { id: '1', name: 'Test Audit', status: 'DRAFT', process: 'Compras', owner: { id: 'u1' } },
      { id: '2', name: 'Another Test', status: 'DONE', process: 'Ventas', owner: { id: 'u2' } },
      { id: '3', name: 'Final Audit', status: 'DRAFT', process: 'Compras', owner: { id: 'u1' } },
    ]

    it('should filter by search query', () => {
      const result = filterItems(items, { q: 'another' })
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Another Test')
    })

    it('should filter by status', () => {
      const result = filterItems(items, { status: 'DRAFT' })
      expect(result).toHaveLength(2)
    })

    it('should filter by process', () => {
      const result = filterItems(items, { process: 'Compras' })
      expect(result).toHaveLength(2)
    })

    it('should filter by owner', () => {
      const result = filterItems(items, { ownerId: 'u1' })
      expect(result).toHaveLength(2)
    })

    it('should combine multiple filters', () => {
      const result = filterItems(items, { status: 'DRAFT', process: 'Compras' })
      expect(result).toHaveLength(2)
    })
  })

  describe('sortItems', () => {
    const items = [
      { id: '1', name: 'Charlie', createdAt: '2026-01-01T00:00:00Z', progress: 50 },
      { id: '2', name: 'Alice', createdAt: '2026-01-02T00:00:00Z', progress: 80 },
      { id: '3', name: 'Bob', createdAt: '2026-01-03T00:00:00Z', progress: 20 },
    ]

    it('should sort by string field ascending', () => {
      const result = sortItems(items, 'name', 'asc')
      expect(result[0].name).toBe('Alice')
      expect(result[2].name).toBe('Charlie')
    })

    it('should sort by string field descending', () => {
      const result = sortItems(items, 'name', 'desc')
      expect(result[0].name).toBe('Charlie')
      expect(result[2].name).toBe('Alice')
    })

    it('should sort by date field', () => {
      const result = sortItems(items, 'createdAt', 'desc')
      expect(result[0].id).toBe('3')
      expect(result[2].id).toBe('1')
    })

    it('should sort by number field', () => {
      const result = sortItems(items, 'progress', 'desc')
      expect(result[0].progress).toBe(80)
      expect(result[2].progress).toBe(20)
    })
  })
})
