import Component from '../../Project/Dashboard.vue'
import { createLocalVue, mount, shallowMount } from '@vue/test-utils'
import activeProject from 'activeProject'
import user from 'user'

let localVue = createLocalVue()

describe('Dashboard', () => {
  const wrapper = shallowMount(Component, {
    localVue,
    computed: {
      project: () => undefined,
    },
  })

  describe('does not render', () => {
    test('component if mapState returns nothing', () => {
      const actual = wrapper.find({ ref: 'component' }).exists()

      expect(actual).toBeFalsy()
    })
  })

  describe('renders', () => {
    const wrapper = shallowMount(Component, {
      computed: {
        project: () => activeProject,
        user: () => user,
      },
      localVue,
    })

    test('correct number of projects lists if mapState returns value', () => {
      expect(wrapper.findAll({ ref: 'list' }).length).toEqual(2)
    })

    test('lists with correct names', () => {
      const actual = wrapper.findAll({ ref: 'list' })

      expect(actual.length).toEqual(2)
      expect(actual.at(0).find('h3').text()).toEqual('To Do')
      expect(actual.at(1).find('h3').text()).toEqual('Done')
    })

    test('filtered user tasks correctly', () => {
      const actual = wrapper.find({ ref: 'list' }).findAll('li')

      expect(actual.length).toEqual(1)
      expect(actual.at(0).text()).toEqual('test task name')
    })
  })
})
