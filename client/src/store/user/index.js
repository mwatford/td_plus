import requestModule from "../../modules/mockedRequestModule";
import { actions } from "./actions";
import { getters } from "./getters";
import { state } from "./state";
import { mutations } from "./mutations";

export default {
  state,
  mutations,
  actions: actions(requestModule),
  getters,
  namespaced: true
};