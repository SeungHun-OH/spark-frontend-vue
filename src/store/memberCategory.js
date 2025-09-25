
const memberCategory = {
  namespaced: true,

  state: {
    categories: [],
    selectcategories: []
  },

  getters: {
    getselectcategories: (state) => state.selectcategories,

    getCategories: (state) => state.categories,

    getCategoriesByType: (state) => (type) => {
      return state.categories.filter(c => c.pc_type === type)
    },
    getCategoriesByTypeNum: (state) => (typenum) => {
      return state.categories.filter(c => c.pc_typenum === typenum)
    }

  },

  mutations: {

    // 선택 카테고리 추가 중복 방지
    addSelectCategories(state, bnos){
      bnos.forEach(bno => {
        if(!state.selectcategories.includes(bno)){
          state.selectcategories.push(bno);
        }    
      });
    },

    setCategories(state, payload) {
      state.categories = payload;
    }
  },

  actions: {
  }
};

export default memberCategory;