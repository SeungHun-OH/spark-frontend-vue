const member = {
  namespaced: true,

  state: {
    m_id: "",
    m_name: "",
    jwt: "",
    m_attachdata: "",
  },

  getters: {
    getM_id(state, getters, rootState, rootGetters) {
      return state.m_id;
    },
    getM_name(state, getters, rootState, rootGetters) {
      return state.m_name;
    },
    getJwt(state, getters, rootState, rootGetters) {
      return state.jwt;
    },
    getM_attachdata(state, getters, rootState, rootGetters) {
      return state.m_attachdata;
    },
    getisLogin(state, getters, rootState, rootGetters) {
      return !!state.jwt;
    }
  },

  mutations: {
    setM_id(state, payload) {
      payload.mm
      state.m_id = payload;
    },
    setM_name(state, payload) {
      state.m_name = payload;
    },
    setJwt(state, payload) {
      state.jwt = payload;
    },
    setM_attachdata(state, payload) {
      state.m_attachdata = payload;
    }
  },

  actions: {
    saveAuth(context, payload) {
      context.commit("setM_id", payload.m_id);
      context.commit("setM_name", payload.m_name);
      context.commit("setJwt", payload.jwt);
      context.commit("setM_attachdata", payload.m_attachdata);

      localStorage.setItem("setM_id", payload.m_id);
      localStorage.setItem("setM_name", payload.m_name);
      localStorage.setItem("setJwt", payload.jwt);
      localStorage.setItem("setM_attachdata", payload.m_attachdata);
    },

    loadAuth(context, payload) {
      const m_id = localStorage.getItem("m_id") || "";
      const m_name = localStorage.getItem("m_name") || "";
      const jwt = localStorage.getItem("jwt") || "";
      const m_attachdata = localStorage.getItem("m_attachdata") || "";

      context.commit("setM_id", m_id);
      context.commit("setM_name", m_name);
      context.commit("setJwt", jwt);
      context.commit("setM_attachdata", m_attachdata);
    },

    logOut(context) {
      context.commit("setM_id", "");
      context.commit("setM_name", "");
      context.commit("setJwt", "");
      context.commit("setM_attachdata", "");

      localStorage.removeItem("m_id");
      localStorage.removeItem("m_name");
      localStorage.removeItem("jwt");
      localStorage.removeItem(" m_attachdata");
    }
  }
}

export default member;