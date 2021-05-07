import { state } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'
import axios from 'axios'

export default {
  state,
  mutations,
  actions: actions(axios),
  getters,
  namespaced: true,
}
