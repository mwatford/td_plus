import { shallowMount } from '@vue/test-utils';
import Component from '../../base/BaseSelect.vue';

const options = [
  { text: '1', value: 1 },
  { text: '22', value: 'asda' },
];

const factory = data => {
  const defaults = {
    propsData: { options },
  };
  if (data) {
    Object.assign(defaults, data);
  }
  return shallowMount(Component, defaults);
};

describe('Component', () => {
  test('should render a select element', () => {
    const wrapper = factory();

    const select = wrapper.find({ ref: 'select' });

    expect(select.exists()).toBeTruthy();
  });

  test('should render options correctly based on passed props', async () => {
    const wrapper = factory();

    const actual = wrapper.findAll({ ref: 'option' });

    expect(actual.length).toEqual(2);
    expect(actual.at(0).text()).toEqual('1');
  });

  test('should render default placeholder option', () => {
    const wrapper = factory();

    const actual = wrapper.find('option').text();

    expect(actual).toEqual('select');
  });

  test('should render given placeholder option', () => {
    const wrapper = factory({ propsData: { placeholder: 'test placeholder' } });

    const actual = wrapper.find('option').text();

    expect(actual).toEqual('test placeholder');
  });

  describe('handleChange method', () => {
    test('should get called on change', () => {
      const wrapper = factory();
      const handleChange = jest.fn();

      wrapper.setMethods({ handleChange });

      wrapper.findAll({ ref: 'option' }).at(1).trigger('change');

      expect(handleChange).toHaveBeenCalled();
    });

    test('should trigger change event with correct value', async () => {
      const wrapper = factory();
      const emit = jest.fn();

      wrapper.vm.$emit = emit;
      wrapper.findAll({ ref: 'option' }).at(1).element.selected = true;
      wrapper.findAll({ ref: 'select' }).trigger('change');

      await wrapper.vm.$nextTick();

      expect(emit).toHaveBeenCalledWith('change', 'asda');
    });
  });
});
