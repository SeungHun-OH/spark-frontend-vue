const member = {
  namespaced: true,

  state: {
    m_no: "",
    m_id: "",
    m_password: "",
    m_name: "",
    m_ssn: "",
    m_age: 0,
    m_email: "",
    m_gender: "",
    m_phone: "",
    m_nickname: "",
    m_region: "",
    m_bio: "",
    m_mbti: "",
    m_active: "T",
    jwt: "",
    m_attachdata: ""   // 프로필 사진 Base64
  },

  getters: {
    getMember(state) { return state; },
    getM_no: (state) => state.m_no,
    getM_id: (state) => state.m_id,
    getM_password: (state) => state.m_password,
    getM_name: (state) => state.m_name,
    getM_ssn: (state) => state.m_ssn,
    getM_age: (state) => state.m_age,
    getM_email: (state) => state.m_email,
    getM_gender: (state) => state.m_gender,
    getM_phone: (state) => state.m_phone,
    getM_nickname: (state) => state.m_nickname,
    getM_region: (state) => state.m_region,
    getM_bio: (state) => state.m_bio,
    getM_mbti: (state) => state.m_mbti,
    getM_active: (state) => state.m_active,
    getJwt: (state) => state.jwt,
    getM_attachdata: (state) => state.m_attachdata,
    getIsLogin: (state) => !!state.jwt
  },

  mutations: {
    setMember(state, payload) { Object.assign(state, payload); },

    setM_id(state, payload) {
      state.m_id = payload;
    },
    setM_no(state, payload) {
      state.m_no = payload;
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
      //Member 다정의하기
      context.commit("setMember", payload);

      Object.keys(payload).forEach((key) => {
        localStorage.setItem(key, payload[key]);
      });

      context.commit("setM_id", payload.m_id);
      context.commit("setM_no", payload.m_no);
      context.commit("setM_name", payload.m_name);
      context.commit("setJwt", payload.jwt);
      context.commit("setM_attachdata", payload.m_attachdata);

      localStorage.setItem("m_id", payload.m_id);
      localStorage.setItem("m_no", payload.m_no);
      localStorage.setItem("m_name", payload.m_name);
      localStorage.setItem("jwt", payload.jwt);
      localStorage.setItem("m_attachdata", payload.m_attachdata);
    },

    savePhoto(context, payload) {
      context.commit("setM_attachdata", payload.m_attachdata);
      localStorage.setItem("m_attachdata", payload.m_attachdata);
    },

    loadAuth(context) {

      const payload = {};
      Object.keys(localStorage).forEach((key) => {
        payload[key] = localStorage.getItem(key);
      });

      context.commit("setMember", payload);

      const m_id = localStorage.getItem("m_id") || "";
      const m_no = localStorage.getItem("m_no") || "";
      const m_name = localStorage.getItem("m_name") || "";
      const jwt = localStorage.getItem("jwt") || "";
      const m_attachdata = localStorage.getItem("m_attachdata") || "";

      context.commit("setM_id", m_id);
      context.commit("setM_no", m_no);
      context.commit("setM_name", m_name);
      context.commit("setJwt", jwt);
      context.commit("setM_attachdata", m_attachdata);
    },

    logOut(context) {
      context.commit("setMember", {
        m_no: "",
        m_id: "",
        m_password: "",
        m_name: "",
        m_ssn: "",
        m_age: 0,
        m_email: "",
        m_gender: "",
        m_phone: "",
        m_nickname: "",
        m_region: "",
        m_bio: "",
        m_mbti: "",
        m_active: "T",
        jwt: "",
        m_attachdata: ""
      });

      localStorage.clear();
    }
  }
}

export default member;

// context.commit("setM_id", "");
// context.commit("setM_no", "");
// context.commit("setM_name", "");
// context.commit("setJwt", "");
// context.commit("setM_attachdata", "");

// localStorage.removeItem("m_id");
// localStorage.removeItem("m_no");
// localStorage.removeItem("m_name");
// localStorage.removeItem("jwt");
// localStorage.removeItem("m_attachdata");
