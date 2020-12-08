import Component from '../../Project/password.vue';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import activeProject from 'activeProject';

let localVue = createLocalVue();

const alert = jest.fn();
const compare = jest.fn();

const factory = (data = {}) => {
  const options = {
    localVue,
    computed: {
      project: () => activeProject,
    },
  };

  Object.assign(options, data);
  const wrapper = shallowMount(Component, options);

  wrapper.setMethods({
    alert,
    comparePasswords: compare,
  });

  return wrapper;
};

describe('Password', () => {
  const wrapper = factory();
  test('is vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy();
  });

  describe('renders', () => {
    test('correct project name', () => {
      const actual = wrapper.find('h3');
      expect(actual.text()).toEqual('project name');
    });
  });
});

describe('methods', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe('comparePasswords', () => {
    const $emit = jest.fn();
    const options = {
      mocks: {
        $eventBus: {
          $emit,
        },
      },
    };
    const wrapper = factory(options);
    wrapper.setData({ password: 'test password' });

    test('gets called on form submit', () => {
      wrapper.find('form').trigger('submit');

      expect(compare).toHaveBeenCalled();
    });

    test('gets called with correct arguments', () => {
      expect(compare).toHaveBeenCalledWith('test password', 'project password');
    });

    test('emits event if passwords match', () => {
      compare.mockImplementationOnce(() => true);

      wrapper.find('form').trigger('submit');

      expect($emit).toHaveBeenCalledWith('correct-password');
    });
  });
});
