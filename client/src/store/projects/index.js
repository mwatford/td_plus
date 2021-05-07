import { actions } from './actions'
import { getters } from './getters'
import { state } from './state'
import { mutations } from './mutations'
import axios from 'axios'

export default {
  state,
  mutations,
  actions: actions(axios),
  getters,
  namespaced: true,
}
