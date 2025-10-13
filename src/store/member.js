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
    mAttachData: "",   // 프로필 사진 Base64
    
    jwt: "",
    token: "",

    isSigned: false, //회원 가입 여부
  },

  getters: {
    getMember: (state) => state,
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
    getMAttachData: (state) => state.mAttachData,

    getIsLogin: (state) => !!state.jwt,

    getJwt: (state) => state.jwt,
    getToken: (state) => state.token,

    getIsSigned: (state) => state.isSigned,
  },

  mutations: {
 
    //Update 전용
    setMember(state, payload) {
    const clean = {
      mNo: payload.mNo,
      mId: payload.mId,
      mPassword: payload.mPassword,
      mName: payload.mName,
      mSsn: payload.mSsn,
      mAge: payload.mAge,
      mEmail: payload.mEmail,
      mGender: payload.mGender,
      mPhone: payload.mPhone,
      mNickname: payload.mNickname,
      mRegion: payload.mRegion,
      mBio: payload.mBio,
      mMbti: payload.mMbti,
      mActive: payload.mActive,
      mAttachData: payload.mAttachData,

      jwt: payload.jwt,
      token: payload.token
    };
    Object.assign(state, clean);
    },

     //Update 전용
    setMemberOnly(state, payload) {
    const clean = {
      mNo: payload.mNo,
      mId: payload.mId,
      mPassword: payload.mPassword,
      mName: payload.mName,
      mSsn: payload.mSsn,
      mAge: payload.mAge,
      mEmail: payload.mEmail,
      mGender: payload.mGender,
      mPhone: payload.mPhone,
      mNickname: payload.mNickname,
      mRegion: payload.mRegion,
      mBio: payload.mBio,
      mMbti: payload.mMbti,
      mActive: payload.mActive,
      mAttachData: payload.mAttachData,
    };
    Object.assign(state, clean);
    },

    setMNo(state, payload) { state.mNo = payload; },
    setMId(state, payload) { state.mId = payload; },
    setMPassword(state, payload) { state.mPassword = payload; },
    setMName(state, payload) { state.mName = payload; },
    setMSsn(state, payload) { state.mSsn = payload; },
    setMAge(state, payload) { state.mAge = payload; },
    setMEmail(state, payload) { state.mEmail = payload; },
    setMGender(state, payload) { state.mGender = payload; },
    setMPhone(state, payload) { state.mPhone = payload; },
    setMNickname(state, payload) { state.mNickname = payload; },
    setMRegion(state, payload) { state.mRegion = payload; },
    setMBio(state, payload) { state.mBio = payload; },
    setMMbti(state, payload) { state.mMbti = payload; },
    setMActive(state, payload) { state.mActive = payload; },
    
    setMAttachData(state, payload) { state.mAttachData = payload; },
    setJwt(state, payload) { state.jwt = payload; },
    setToken(state, payload) { state.token = payload; },

    setIsSigned(state, value) { state.isSigned = value; },
  },

  actions: {
    saveAuth(context, payload) {
      // 전체 멤버 한번에 저장
      context.commit("setMember", payload);

      // 로컬스토리지에 저장
      Object.keys(payload).forEach((key) => {
        localStorage.setItem(key, payload[key]);
      });

      // 개별 필드도 commit
      context.commit("setMId", payload.mId);
      context.commit("setMNo", payload.mNo);
      context.commit("setMName", payload.mName);
      context.commit("setJwt", payload.jwt);
      context.commit("setMAttachData", payload.mAttachData);
      context.commit("setToken", payload.token);

      // 로컬스토리지 개별 필드 저장
      localStorage.setItem("mId", payload.mId);
      localStorage.setItem("mNo", payload.mNo);
      localStorage.setItem("mName", payload.mName);
      
      localStorage.setItem("mAttachData", payload.mAttachData);
      localStorage.setItem("jwt", payload.jwt);
      localStorage.setItem("token", payload.token);
    },

    savePhoto(context, payload) {
      context.commit("setMAttachData", payload.mAttachData);
      localStorage.setItem("mAttachData", payload.mAttachData);
    },

    loadAuth(context) {
      const payload = {};
      Object.keys(localStorage).forEach((key) => {
        payload[key] = localStorage.getItem(key);
      });

      context.commit("setMember", payload);

      context.commit("setMId", localStorage.getItem("mId") || "");
      context.commit("setMNo", localStorage.getItem("mNo") || "");
      context.commit("setMName", localStorage.getItem("mName") || "");
      context.commit("setJwt", localStorage.getItem("jwt") || "");
      context.commit("setToken", localStorage.getItem("token") || "");
      context.commit("setMAttachData", localStorage.getItem("mAttachData") || "");
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
        mAttachData: "",
        token: ""
      });

      localStorage.clear();
    }
  }
}

export default member;


// const member = {
//   namespaced: true,

//   state: {
//     mNo: "",
//     mId: "",
//     mPassword: "",
//     mName: "",
//     mSsn: "",
//     mAge: 0,
//     mEmail: "",
//     mGender: "",
//     mPhone: "",
//     mNickname: "",
//     mRegion: "",
//     mBio: "",
//     mMbti: "",
//     mActive: "T",
//     jwt: "",
//     mAttachData: ""   
//   },

//   getters: {
//     getMember(state) { return state; },
//     getMNo: (state) => state.mNo,
//     getMId: (state) => state.mId,
//     getMPassword: (state) => state.mPassword,
//     getMName: (state) => state.mName,
//     getMSsn: (state) => state.mSsn,
//     getMAge: (state) => state.mAge,
//     getMEmail: (state) => state.mEmail,
//     getMGender: (state) => state.mGender,
//     getMPhone: (state) => state.mPhone,
//     getMNickname: (state) => state.mNickname,
//     getMRegion: (state) => state.mRegion,
//     getMBio: (state) => state.mBio,
//     getMMbti: (state) => state.mMbti,
//     getMActive: (state) => state.mActive,
//     getJwt: (state) => state.jwt,
//     getMAttachData: (state) => state.mAttachData,
//     getIsLogin: (state) => !!state.jwt
//   },

//   mutations: {
//     setMember(state, payload) { Object.assign(state, payload); },

//     setMid(state, payload) {
//       state.mId = payload;
//     },
//     setMno(state, payload) {
//       state.mNo = payload;
//     },
//     setMname(state, payload) {
//       state.mName = payload;
//     },
//     setJwt(state, payload) {
//       state.jwt = payload;
//     },
//     setMattachData(state, payload) {
//       state.mAttachData = payload;
//     }
//   },

//   actions: {
//     saveAuth(context, payload) {
  
//       context.commit("setMember", payload);

//       Object.keys(payload).forEach((key) => {
//         localStorage.setItem(key, payload[key]);
//       });

//       context.commit("setMid", payload.mId);
//       context.commit("setMno", payload.mNo);
//       context.commit("setMname", payload.mName);
//       context.commit("setMattachData", payload.mAttachData);
//       context.commit("setJwt", payload.jwt);

//       localStorage.setItem("mId", payload.mId);
//       localStorage.setItem("mNo", payload.mNo);
//       localStorage.setItem("mName", payload.mName);
//       localStorage.setItem("jwt", payload.jwt);
//       localStorage.setItem("mAttachData", payload.mAttachData);
//     },

//     savePhoto(context, payload) {
//       context.commit("setMattachData", payload.mAttachData);
//       localStorage.setItem("mAttachData", payload.mAttachData);
//     },

//     loadAuth(context) {

//       const payload = {};
//       Object.keys(localStorage).forEach((key) => {
//         payload[key] = localStorage.getItem(key);
//       });

//       context.commit("setMember", payload);

//       const mId = localStorage.getItem("mId") || "";
//       const mNo = localStorage.getItem("mNo") || "";
//       const mName = localStorage.getItem("mName") || "";
//       const jwt = localStorage.getItem("jwt") || "";
//       const mAttachData = localStorage.getItem("mAttachData") || "";

//       context.commit("setMId", mId);
//       context.commit("setMNo", mNo);
//       context.commit("setMName", mName);
//       context.commit("setJwt", jwt);
//       context.commit("setMAttachData", mAttachData);
//     },

//     logOut(context) {
//       context.commit("setMember", {
//         mNo: "",
//         mId: "",
//         mPassword: "",
//         mName: "",
//         mSsn: "",
//         mAge: 0,
//         mEmail: "",
//         mGender: "",
//         mPhone: "",
//         mNickname: "",
//         mRegion: "",
//         mBio: "",
//         mMbti: "",
//         mActive: "T",
//         jwt: "",
//         mAttachData: ""
//       });

//       localStorage.clear();
//     }
//   }
// }

// export default member;

