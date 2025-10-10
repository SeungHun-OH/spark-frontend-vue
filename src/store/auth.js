const auth = {
  namespaced: true,
  state: {
    memberUuid: "",
    jwtToken: ""
  },
  getters: {
    getmemberUuid: function (state) {
      return state.memberUuid;
    },
    getjwtToken: function (state) {
      return state.jwtToken;
    }
  },
  mutations: {
    setMemberUuid(state, payload){
      state.memberUuid = payload;
    },
    setJwtToken(state, payload){
      state.jwtToken = payload;
    }
  },
  actions: {
    
  }
}
export default auth;