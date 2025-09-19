import { createStore } from 'vuex'

export default createStore({
  state: {
    mid: "",
    mname : "",
    jwt: "",
    mattachdata: ""
  },
  getters: {
    getMid(state, getters, rootState, rootGetters){
      return state.mid;
    },
    getMname(state, getters, rootState, rootGetters){
      return state.mname;
    },
    getJwt(state, getters, rootState, rootGetters){
      return state.jwt;
    },
    getMattachdata(state, getters, rootState, rootGetters){
      return state.mattachdata;
    },
    getisLogin(state,getters,rootState,rootGetters){
      return !!state.jwt;
    }

  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
