import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Pagination from '../../ui/Pagination.vue'

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    total: 100,
    pageSize: 10,
  }

  it('renders pagination info correctly', () => {
    const wrapper = mount(Pagination, {
      props: defaultProps,
    })

    // Texto usa espacios, no guiones
    expect(wrapper.text()).toContain('Mostrando 1 - 10 de 100 resultados')
  })

  it('disables previous button on first page', () => {
    const wrapper = mount(Pagination, {
      props: defaultProps,
    })

    const buttons = wrapper.findAll('button')
    const prevButton = buttons[0] // Primer botón es el de previous
    expect(prevButton.attributes('disabled')).toBeDefined()
  })

  it('disables next button on last page', () => {
    const wrapper = mount(Pagination, {
      props: {
        ...defaultProps,
        currentPage: 10,
      },
    })

    const buttons = wrapper.findAll('button')
    const nextButton = buttons[buttons.length - 1] // Último botón es el de next
    expect(nextButton.attributes('disabled')).toBeDefined()
  })

  it('enables both buttons on middle page', () => {
    const wrapper = mount(Pagination, {
      props: {
        ...defaultProps,
        currentPage: 5,
      },
    })

    const buttons = wrapper.findAll('button')
    const prevButton = buttons[0]
    const nextButton = buttons[buttons.length - 1]

    expect(prevButton.attributes('disabled')).toBeUndefined()
    expect(nextButton.attributes('disabled')).toBeUndefined()
  })

  it('emits update:currentPage when clicking next', async () => {
    const wrapper = mount(Pagination, {
      props: defaultProps,
    })

    const buttons = wrapper.findAll('button')
    const nextButton = buttons[buttons.length - 1]
    await nextButton.trigger('click')

    expect(wrapper.emitted('update:currentPage')).toBeTruthy()
    expect(wrapper.emitted('update:currentPage')[0]).toEqual([2])
  })

  it('emits update:currentPage when clicking previous', async () => {
    const wrapper = mount(Pagination, {
      props: {
        ...defaultProps,
        currentPage: 5,
      },
    })

    const buttons = wrapper.findAll('button')
    const prevButton = buttons[0]
    await prevButton.trigger('click')

    expect(wrapper.emitted('update:currentPage')).toBeTruthy()
    expect(wrapper.emitted('update:currentPage')[0]).toEqual([4])
  })

  it('calculates last item correctly on last page', () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 10,
        totalPages: 10,
        total: 95,
        pageSize: 10,
      },
    })

    expect(wrapper.text()).toContain('Mostrando 91 - 95 de 95 resultados')
  })

  it('handles single page correctly', () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 1,
        totalPages: 1,
        total: 5,
        pageSize: 10,
      },
    })

    expect(wrapper.text()).toContain('Mostrando 1 - 5 de 5 resultados')

    const buttons = wrapper.findAll('button')
    const prevButton = buttons[0]
    const nextButton = buttons[buttons.length - 1]

    expect(prevButton.attributes('disabled')).toBeDefined()
    expect(nextButton.attributes('disabled')).toBeDefined()
  })

  it('displays page numbers', () => {
    const wrapper = mount(Pagination, {
      props: {
        ...defaultProps,
        currentPage: 3,
      },
    })

    // Verifica que hay botones numéricos
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBeGreaterThan(2) // Más que solo prev/next
  })
})
