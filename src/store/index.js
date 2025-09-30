import { createStore } from 'vuex'
import feed from './feed';
import member from './member';
import memberCategory from './memberCategory';

export default createStore({
  state: {
    user: "",
    jwt: ""
  },
  getters: {
    getUser: function (state, getters, rootState, rootGetters) {
      return state.user;
    },
    getJwt: function (state, getters, rootState, rootGetters) {
      return state.jwt;
    }
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setJwt(state, payload) {
      state.jwt = payload;
    }
  },
  actions: {
  },
  modules: {
    feed: feed,
    member: member,
    memberCategory: memberCategory
  }
})
