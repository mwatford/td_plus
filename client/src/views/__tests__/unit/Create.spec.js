import Component from '../../../views/Create.vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import _ from 'lodash'
import { manageProject } from '../../../services/LocalDbManager'
import http from '../../../services/api/index'
import BaseSelect from '../../../components/base/BaseSelect.vue'

jest.mock('../../../utils/password', () => ({
  hashPassword: jest.fn(x => 'hashed password'),
}))

jest.mock('../../../services/LocalDbManager', () => ({
  manageProject: jest.fn(),
}))

jest.mock('../../../services/api/index', () => ({
  projects: {
    create: jest.fn(),
  },
}))

jest.mock('../../../classes/ProjectFactory', () => ({
  templates: {
    val1: 1,
    val2: 2,
  },
  create: jest.fn(x => ({ name: 'mock project' })),
}))

const store = {
  dispatch: jest.fn(),
}
const boxEnterAnimation = jest.fn()
const boxExitAnimation = jest.fn(() => Promise.resolve())

const setup = (auth, options = {}, shallow = true) => {
  const defaults = {
    computed: {
      user: () => ({ email: 'test@email.com' }),
      token: () => 'test token',
      auth: () => auth,
    },
    mocks: {
      $store: store,
    },
    stubs: {
      BaseSelect: shallow || BaseSelect,
    },
    methods: {
      boxEnterAnimation,
      boxExitAnimation,
    },
  }

  if (!shallow) {
    const localVue = createLocalVue()
    localVue.component('BaseSelect', BaseSelect)
    defaults.localVue = localVue
  }
  _.defaultsDeep(defaults, options)

  return shallowMount(Component, defaults)
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Create component', () => {
  test('is defined', () => {
    expect(Component).toBeDefined()
  })

  describe('render', () => {
    test('form', () => {
      const wrapper = setup(false)

      const form = wrapper.find({ ref: 'create-form' })

      expect(form.exists()).toBeTruthy()
    })

    test('template picker', () => {
      const wrapper = setup(true)

      const select = wrapper.find({ ref: 'template-picker' })

      expect(select.exists()).toBeTruthy()
    })

    test('name input', () => {
      const wrapper = setup(false)

      const name = wrapper.find({ ref: 'name' })

      expect(name.exists()).toBeTruthy()
    })

    describe('password input only if user is logged in', () => {
      test('logged in', () => {
        const wrapper = setup(true)

        const password = wrapper.find({ ref: 'password' })

        expect(password.exists()).toBeTruthy()
        expect(password.attributes('type')).toBe('password')
      })

      test('not logged in', () => {
        const wrapper = setup(false)
        const password = wrapper.find({ ref: 'password' })

        expect(password.exists()).toBeFalsy()
      })
    })

    test('control buttons', () => {
      const wrapper = setup(false)
      const buttons = wrapper.findAll('.button')

      const actual = buttons.length

      expect(actual).toBe(2)
    })
  })

  describe('computed', () => {
    test("calculates 'options' value correctly", () => {
      const wrapper = setup(false)

      const actual = wrapper.vm.options

      expect(actual).toMatchObject([
        {
          value: 'val1',
          text: 'val1',
        },
        { value: 'val2', text: 'val2' },
      ])
    })
  })

  describe('methods', () => {
    describe('create', () => {
      const alert = jest.fn()
      const navigate = jest.fn()

      describe('if not logged in', () => {
        const wrapper = setup(false, { methods: { alert, navigate } })

        test('saves project to indexedDB', async () => {
          wrapper.setData({ type: 'basic', name: 'test' })

          await wrapper.vm.$nextTick()
          await wrapper.vm.create()

          expect(manageProject).toHaveBeenCalledWith('add', {
            name: 'mock project',
          })
        })

        describe('on success', () => {
          test('displays success message', async () => {
            await wrapper.vm.create()

            expect(alert).toHaveBeenCalledWith('success', 'Project created')
          })

          test('navigates home', async () => {
            await wrapper.vm.create()

            expect(navigate).toHaveBeenCalledWith({ name: 'home' })
          })
        })

        test('displays error message on fail', async () => {
          wrapper.setData({ name: '', type: '' })

          await wrapper.vm.$nextTick()
          await wrapper.vm.create()

          expect(alert).toHaveBeenCalledWith('error', 'Something went wrong')
        })
      })

      describe('if logged in', () => {
        const alert = jest.fn()
        const wrapper = setup(true, { methods: { alert } })

        test('makes api call to save project', async () => {
          wrapper.setData({ name: 'test name', type: 'basic' })

          await wrapper.vm.create()

          expect(http.projects.create).toHaveBeenCalledWith('test token', {
            name: 'mock project',
          })
        })

        test('makes api call to save user', async () => {
          await wrapper.vm.create()

          expect(store.dispatch).toHaveBeenCalledWith('user/fetchUser', {
            token: 'test token',
            email: 'test@email.com',
          })
        })
      })
    })
  })

  describe('user interactions:', () => {
    describe('on user input', () => {
      test('type gets set', () => {
        const wrapper = setup(false, null, false)

        wrapper.findAll('option').at(1).element.selected = true
        wrapper.find({ ref: 'template-picker' }).trigger('change')

        expect(wrapper.vm.type).toEqual('val1')
      })

      test('name gets set', () => {
        const wrapper = setup(false)

        wrapper.find({ ref: 'name' }).setValue('test')

        expect(wrapper.vm.name).toEqual('test')
      })

      test('password gets set', () => {
        const wrapper = setup(true)

        wrapper.find({ ref: 'password' }).setValue('test password')

        expect(wrapper.vm.password).toEqual('test password')
      })
    })

    test('button click triggers create', () => {
      const wrapper = setup(false)
      const create = jest.fn()

      wrapper.setMethods({ create })
      wrapper.find({ ref: 'submit' }).trigger('click')

      expect(create).toHaveBeenCalled()
    })

    test('button click triggers navigate', () => {
      const wrapper = setup(false)
      const navigate = jest.fn()

      wrapper.setMethods({ navigate })
      wrapper.findAll('.button').at(1).trigger('click')

      expect(navigate).toHaveBeenCalledWith(-1)
    })
  })

  describe('lifecycle hooks', () => {
    describe('mounted', () => {
      test('calls enter animation', () => {
        const wrapper = setup(false)

        expect(boxEnterAnimation).toHaveBeenCalled()
      })
    })

    describe('beforeRouteLeave', () => {
      test('calls leave animation', async () => {
        const wrapper = setup(false)
        const next = jest.fn()

        Component.beforeRouteLeave.call(wrapper.vm, undefined, undefined, next)
        await wrapper.vm.$nextTick()

        expect(next).toHaveBeenCalled()
      })
    })
  })
})
