import { createStore } from 'vuex'
import member from './member';

export default createStore({
  // state: {
  //   mid: "",
  //   mname: "",
  //   jwt: "",
    
  //   mattachdata: ""
  // },
  // getters: {
  //   getMid(state, getters, rootState, rootGetters) {
  //     return state.mid;
  //   },
  //   getMname(state, getters, rootState, rootGetters) {
  //     return state.mname;
  //   },
  //   getJwt(state, getters, rootState, rootGetters) {
  //     return state.jwt;
  //   },
  //   getMattachdata(state, getters, rootState, rootGetters) {
  //     return state.mattachdata;
  //   },
  //   getisLogin(state, getters, rootState, rootGetters) {
  //     return !!state.jwt;
  //   }
  // },

  // mutations: {
  //   setMid(state, payload) {
  //     state.mid = payload;
  //   },
  //   setMname(state, payload) {
  //     state.mname = payload;
  //   },
  //   setJwt(state, payload) {
  //     state.jwt = payload;
  //   },
  //   setMattachdata(state, payload) {
  //     state.mattachdata = payload;
  //   }
  // },
  // actions: {
  //   saveAuth(context, payload){
  //     context.commit("setMid", payload.mid);
  //     context.commit("setMname", payload.mname);
  //     context.commit("setJwt", payload.jwt);
  //     context.commit("mattachdata", payload.mattachdata);

  //     localStorage.setItem("mid", payload.mid);
  //     localStorage.setItem("mname", payload.mname);
  //     localStorage.setItem("jwt", payload.jwt);
  //     localStorage.setItem("mattachdata", payload.mattachdata);
  //   },

  //   loadAuth(context, payload){
  //     const mid = localStorage.getItem("mid") || "";
  //     const mname = localStorage.getItem("mname") || "";
  //     const jwt = localStorage.getItem("jwt") || "";
  //     const mattachdata = localStorage.getItem("mattachdata") || "";

  //     context.commit("setMid", mid);
  //     context.commit("setMname", mname);
  //     context.commit("setJwt", jwt);
  //     context.commit("setMattachdata", mattachdata);
  //   },

  //   logout(context){
  //     context.commit("setMid", "");
  //     context.commit("setMnae","");
  //     context.commit("setJwt","");
  //     context.commit("setMattachdata","");

  //     localStorage.removeItem("mid");
  //     localStorage.removeItem("mname");
  //     localStorage.removeItem("jwt");
  //     localStorage.removeItem("mattachdata");
  //   }
  // },
  modules: {
    member
  }
})
