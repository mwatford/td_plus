import Component from '../../Home.vue';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import appIcon from '../../../components/app-icon.vue';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);
localVue.component('app-icon', appIcon);

jest.mock('../../../services/LocalDbManager');

const store = new Vuex.Store({
  state: {
    user: { _id: '123' },
    auth: { token: 'test token', auth: true },
    projects: { data: [1, 2, 3, 4, 5] },
  },
});

const factory = () => {
  const defaults = {
    store,
    localVue,
    stubs: {
      appIcon: true,
      ProjectTile: true,
    },
  };
  const wrapper = shallowMount(Component, defaults);
  wrapper.setMethods({ alert: jest.fn() });

  return wrapper;
};

describe('Home', () => {
  test('is defined', () => {
    expect(Component).toBeDefined();
  });

  describe('create element', () => {
    test('should get rendered', () => {
      const wrapper = factory();

      const actual = wrapper.find({ ref: 'create' });

      expect(actual.isVisible()).toBeTruthy();
    });

    test('should correctly call navigate on click', () => {
      const wrapper = factory();

      const navigate = jest.fn();
      wrapper.setMethods({ navigate });

      wrapper.find({ ref: 'create' }).trigger('click');

      expect(navigate).toHaveBeenCalledWith('create');
    });
  });

  describe('project link', () => {
    test('should get rendered for each project in store', () => {
      const wrapper = factory();

      const actual = wrapper.findAll({ ref: 'project-link' }).length;

      expect(actual).toEqual(5);
    });
  });
});
