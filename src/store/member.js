const member = {
  namespaced: true,

  state: {
    mNo: "",
    mId: "",
    mPassword: "",
    mName: "",
    mSsn: "",
    mAge: 0,
    mEmail: "",
    mGender: "",
    mPhone: "",
    mNickname: "",
    mRegion: "",
    mBio: "",
    mMbti: "",
    mActive: "T",
    jwt: "",
    mAttachdata: ""   // 프로필 사진 Base64
  },

  getters: {
    getMember(state) { return state; },
    getMNo: (state) => state.mNo,
    getMId: (state) => state.mId,
    getMPassword: (state) => state.mPassword,
    getMName: (state) => state.mName,
    getMSsn: (state) => state.mSsn,
    getMAge: (state) => state.mAge,
    getMEmail: (state) => state.mEmail,
    getMGender: (state) => state.mGender,
    getMPhone: (state) => state.mPhone,
    getMNickname: (state) => state.mNickname,
    getMRegion: (state) => state.mRegion,
    getMBio: (state) => state.mBio,
    getMMbti: (state) => state.mMbti,
    getMActive: (state) => state.mActive,
    getJwt: (state) => state.jwt,
    getMAttachdata: (state) => state.mAttachdata,
    getIsLogin: (state) => !!state.jwt
  },

  mutations: {
    setMember(state, payload) { Object.assign(state, payload); },

    setM_id(state, payload) {
      state.mId = payload;
    },
    setM_no(state, payload) {
      state.mNo = payload;
    },
    setM_name(state, payload) {
      state.mName = payload;
    },
    setJwt(state, payload) {
      state.jwt = payload;
    },
    setM_attachdata(state, payload) {
      state.mAttachdata = payload;
    }
  },

  actions: {
    saveAuth(context, payload) {
      //Member 다정의하기
      context.commit("setMember", payload);

      Object.keys(payload).forEach((key) => {
        localStorage.setItem(key, payload[key]);
      });

      context.commit("setMId", payload.mId);
      context.commit("setMNo", payload.mNo);
      context.commit("setMName", payload.mName);
      context.commit("setJwt", payload.jwt);
      context.commit("setMAttachdata", payload.mAttachdata);

      localStorage.setItem("mId", payload.mId);
      localStorage.setItem("mNo", payload.mNo);
      localStorage.setItem("mName", payload.mName);
      localStorage.setItem("jwt", payload.jwt);
      localStorage.setItem("mAttachdata", payload.mAttachdata);
    },

    savePhoto(context, payload) {
      context.commit("setMAttachdata", payload.mAttachdata);
      localStorage.setItem("mAttachdata", payload.mAttachdata);
    },

    loadAuth(context) {

      const payload = {};
      Object.keys(localStorage).forEach((key) => {
        payload[key] = localStorage.getItem(key);
      });

      context.commit("setMember", payload);

      const mId = localStorage.getItem("mId") || "";
      const mNo = localStorage.getItem("mNo") || "";
      const mName = localStorage.getItem("mName") || "";
      const jwt = localStorage.getItem("jwt") || "";
      const mAttachdata = localStorage.getItem("mAttachdata") || "";

      context.commit("setMId", mId);
      context.commit("setMNo", mNo);
      context.commit("setMName", mName);
      context.commit("setJwt", jwt);
      context.commit("setMAttachdata", mAttachdata);
    },

    logOut(context) {
      context.commit("setMember", {
        mNo: "",
        mId: "",
        mPassword: "",
        mName: "",
        mSsn: "",
        mAge: 0,
        mEmail: "",
        mGender: "",
        mPhone: "",
        mNickname: "",
        mRegion: "",
        mBio: "",
        mMbti: "",
        mActive: "T",
        jwt: "",
        mAttachdata: ""
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
