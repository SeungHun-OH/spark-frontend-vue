
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
    getUniqueDesc : (state) => {
      return [... new Set(state.categories.map(c => c.pc_desc))]
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
        title : first.pc_type,
        description: first.pc_desc
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

    // 선탁 카테고리 삭제 
    removeSelectCategory(state, bno){
      state.selectcategories = state.selectcategories.filter(no => no !== bno);
    },

    setCategories(state, payload) {
      state.categories = payload;
    }
  },

  actions: {
  }
};

export default memberCategory;