const feed = {
  //store : 변할 수 있고, 전역적으로 공유되는 값만 넣는다.
  //namespaced : 상태들이 소속되어 있는 그룹 이름 //하위상태는 무조건 넣어야 함
  namespaced: true,
  state: {
    fno:"",
    fmemberno:"",
    fcontent:"",
    fdate:""
  },
  getters: {
    
  },
  mutations: {
    setContent(state, payload) {
      state.fcontent = payload;
    },
    setDate(state, payload) {
      state.fdate = payload;
    }
  },
  actions: {
    
  }
}
export default feed;