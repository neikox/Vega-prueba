import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Badge from '../../ui/Badge.vue'

describe('Badge', () => {
  it('renders default variant correctly', () => {
    const wrapper = mount(Badge, {
      slots: {
        default: 'Test Badge',
      },
    })

    expect(wrapper.text()).toBe('Test Badge')
    expect(wrapper.classes()).toContain('text-gray-700')
  })

  it('renders success variant with correct classes', () => {
    const wrapper = mount(Badge, {
      props: {
        variant: 'success',
      },
      slots: {
        default: 'Success',
      },
    })

    expect(wrapper.text()).toBe('Success')
    expect(wrapper.classes()).toContain('bg-emerald-100')
    expect(wrapper.classes()).toContain('text-emerald-800')
  })

  it('renders danger variant with correct classes', () => {
    const wrapper = mount(Badge, {
      props: {
        variant: 'danger',
      },
      slots: {
        default: 'Error',
      },
    })

    expect(wrapper.classes()).toContain('bg-red-100')
    expect(wrapper.classes()).toContain('text-red-800')
  })

  it('renders warning variant with correct classes', () => {
    const wrapper = mount(Badge, {
      props: {
        variant: 'warning',
      },
      slots: {
        default: 'Warning',
      },
    })

    expect(wrapper.classes()).toContain('bg-amber-100')
    expect(wrapper.classes()).toContain('text-amber-800')
  })

  it('renders info variant with correct classes', () => {
    const wrapper = mount(Badge, {
      props: {
        variant: 'info',
      },
      slots: {
        default: 'Info',
      },
    })

    expect(wrapper.classes()).toContain('bg-blue-100')
    expect(wrapper.classes()).toContain('text-blue-800')
  })

  it('applies base classes to all variants', () => {
    const wrapper = mount(Badge, {
      slots: {
        default: 'Test',
      },
    })

    expect(wrapper.classes()).toContain('inline-flex')
    expect(wrapper.classes()).toContain('items-center')
    expect(wrapper.classes()).toContain('px-3')
    expect(wrapper.classes()).toContain('py-1')
    expect(wrapper.classes()).toContain('rounded-full')
    expect(wrapper.classes()).toContain('text-xs')
  })
})
