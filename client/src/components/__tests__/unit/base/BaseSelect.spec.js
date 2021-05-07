import { shallowMount } from '@vue/test-utils'
import Component from '../../../base/BaseSelect.vue'
import _ from 'lodash'

const options = [
  { text: '0', value: 'value at 0' },
  { text: '1', value: 'value at 1' },
]

const factory = (data = {}) => {
  const defaults = {
    propsData: { options },
  }
  const a = _.defaultsDeep(defaults, data)
  return shallowMount(Component, a)
}

describe('Component', () => {
  test('should render a select element', () => {
    const wrapper = factory()

    const select = wrapper.find({ ref: 'select' })

    expect(select.exists()).toBeTruthy()
  })

  test('should render options correctly based on passed props', async () => {
    const wrapper = factory()

    const actual = wrapper.findAll({ ref: 'option' })

    expect(actual.length).toEqual(2)
    expect(actual.at(0).text()).toEqual('0')
  })

  test('should render default placeholder option', () => {
    const wrapper = factory()

    const actual = wrapper.find('option').text()

    expect(actual).toEqual('select')
  })

  test('should render given placeholder option', () => {
    const wrapper = factory({
      propsData: { placeholder: 'test placeholder' },
    })

    const actual = wrapper.find('option').text()

    expect(actual).toEqual('test placeholder')
  })

  describe('handleChange method', () => {
    test('should get called on change', () => {
      const handleChange = jest.fn()
      const wrapper = factory({ methods: { handleChange } })

      wrapper.findAll({ ref: 'option' }).at(0).element.selected = true
      wrapper.findAll({ ref: 'select' }).at(0).trigger('change')

      expect(handleChange).toHaveBeenCalled()
    })

    test('should emit change event with correct value', async () => {
      const wrapper = factory()
      const emit = jest.fn()

      wrapper.vm.$emit = emit
      wrapper.findAll({ ref: 'option' }).at(1).element.selected = true
      wrapper.findAll({ ref: 'select' }).trigger('change')

      await wrapper.vm.$nextTick()

      expect(emit).toHaveBeenCalledWith('change', 'value at 1')
    })
  })
})
