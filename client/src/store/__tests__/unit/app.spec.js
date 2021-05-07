import { defaultState } from '../../app/state'
import store from '../../index'

beforeEach(done => {
  store.commit('alerts/RESET_STATE')
  done()
})

describe('app module', () => {
  describe('mutations', () => {
    describe('RESET_STATE', () => {
      test('should reset the state to default', () => {
        store.commit('app/RESET_STATE')

        expect(store.state.app).toEqual(defaultState())
      })
    })

    describe('TOGGLE_PROJECT', () => {
      test('should toggle state.project value', () => {
        store.commit('app/TOGGLE_PROJECTS')

        expect(store.state.app.projects).toEqual(true)
      })
    })
    describe('TOGGLE_TIMELINE', () => {
      test('should toggle state.project value', () => {
        store.commit('app/TOGGLE_TIMELINE')

        expect(store.state.app.timeline).toEqual(true)
      })
    })
    describe('TOGGLE_ANIMATIONS', () => {
      test('should toggle state.project value', () => {
        store.commit('app/TOGGLE_ANIMATIONS')

        expect(store.state.app.animations).toEqual(false)
      })
    })
  })
})
