import { createStore } from 'vuex'
import feed from './feed';
import member from './member';
import memberCategory from './memberCategory';
import memberStatus from './memberStatus';
import auth from './auth';

export default createStore({
  state: {
    admin: false,
    user: "",
    jwt: ""
  },
  getters: {
    getUser: function (state, getters, rootState, rootGetters) {
      return state.user;
    },
    getJwt: function (state, getters, rootState, rootGetters) {
      return state.jwt;
    },
    getAdmin: (state) => state.admin
  },
  mutations: {
    setUser(state, payload) { state.user = payload; },
    setJwt(state, payload) { state.jwt = payload; },
    setAdmin(state, payload) { state.admin = payload; }
  },
  actions: {
  },
  modules: {
    feed : feed,
    member : member,
    memberCategory : memberCategory,
    memberStatus,
    auth
  }
})
