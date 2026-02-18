// API mock service - Simula llamadas a API con latencia y errores

/**
 * Simula latencia de red
 */
function simulateLatency(min = 300, max = 1200) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise(resolve => setTimeout(resolve, delay))
}

/**
 * Simula errores aleatorios
 */
function simulateError(errorRate = 0.15) {
  if (Math.random() < errorRate) {
    const errors = [
      'Error de conexión con el servidor',
      'Tiempo de espera agotado',
      'Servicio temporalmente no disponible',
      'Error interno del servidor (500)',
      'Error al procesar la solicitud'
    ]
    throw new Error(errors[Math.floor(Math.random() * errors.length)])
  }
}

/**
 * Wrapper para llamadas API simuladas
 */
export async function mockApiCall(fn, options = {}) {
  const {
    latency = true,
    errorRate = 0.15,
    minDelay = 300,
    maxDelay = 1200
  } = options

  try {
    if (latency) {
      await simulateLatency(minDelay, maxDelay)
    }

    simulateError(errorRate)

    return await fn()
  } catch (error) {
    throw error
  }
}

/**
 * Pagina un array
 */
export function paginate(items, page = 1, pageSize = 10) {
  const total = items.length
  const totalPages = Math.ceil(total / pageSize) || 1
  const currentPage = Math.max(1, Math.min(page, totalPages))
  const start = (currentPage - 1) * pageSize
  const end = start + pageSize
  
  return {
    items: items.slice(start, end),
    total,
    page: currentPage,
    pageSize,
    totalPages,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  }
}

/**
 * Filtra items por múltiples criterios
 */
export function filterItems(items, filters = {}) {
  let filtered = [...items]

  // Búsqueda de texto
  if (filters.q) {
    const query = filters.q.toLowerCase()
    filtered = filtered.filter(item =>
      item.name?.toLowerCase().includes(query) ||
      item.id?.toLowerCase().includes(query)
    )
  }

  // Filtro por estado
  if (filters.status) {
    filtered = filtered.filter(item => item.status === filters.status)
  }

  // Filtro por proceso
  if (filters.process) {
    filtered = filtered.filter(item => item.process === filters.process)
  }

  // Filtro por responsable
  if (filters.ownerId) {
    filtered = filtered.filter(item => item.owner?.id === filters.ownerId)
  }

  return filtered
}

/**
 * Ordena items por un campo
 */
export function sortItems(items, sortBy = 'createdAt', sortOrder = 'desc') {
  return [...items].sort((a, b) => {
    let aVal = a[sortBy]
    let bVal = b[sortBy]

    // Manejar propiedades anidadas (e.g., owner.name)
    if (sortBy.includes('.')) {
      const keys = sortBy.split('.')
      aVal = keys.reduce((obj, key) => obj?.[key], a)
      bVal = keys.reduce((obj, key) => obj?.[key], b)
    }

    // Manejar fechas
    if (sortBy.includes('Date') || sortBy.includes('At')) {
      aVal = new Date(aVal).getTime()
      bVal = new Date(bVal).getTime()
    }

    // Manejar strings
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
    return 0
  })
}
