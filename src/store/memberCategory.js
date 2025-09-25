
const memberCategory = {
  namespaced: true,

  state: {
    categories: [],
    selectcategories: []
  },

  getters: {
    getselectcategories: (state) => state.selectcategories,

    getCategories: (state) => state.categories,

    getUniqueTypes : (state) => {
      return [...new Set(state.categories.map(c => c.pc_type))]
    },

    getCategoriesByType: (state) => (type) => {
      return state.categories.filter(c => c.pc_type === type)
    },
    getCategoriesByTypeNum: (state) => (typenum) => {
      return state.categories.filter(c => c.pc_typenum === typenum)
    },

     getTypeMeta: (state) => (type) => {
      const first = state.categories.find(c => c.pc_type === type);
      if (!first) return { title: type, description: "" };

      return {
        title: first.pc_group || type,  // pc_group을 제목처럼 활용
        description: `Select your ${first.pc_group || type.toLowerCase()}`
      };
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