import { actions } from './actions'
import { getters } from './getters'
import { state } from './state'
import { mutations } from './mutations'
import http from '../../services/api/index'

export default {
  state,
  mutations,
  actions: actions(http),
  getters,
  namespaced: true,
}
