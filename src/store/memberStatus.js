const memberStatus = {
  namespaced: true,
  state: () => ({
    userStatus: {}
  }),
  mutations: {
    setUserStatus(state, { memberUuid, memberStatus }) {
      state.userStatus = {
        ...state.userStatus,
        [memberUuid]: memberStatus
      };
    }
  },
  getters: {
    getStatus: (state) => (uuid) => {
      console.log("getter uuid ",uuid);
      console.log("getter status ",state.userStatus[uuid]);
      return state.userStatus[uuid] || "OFFLINE";
    }
  }
};

export default memberStatus;