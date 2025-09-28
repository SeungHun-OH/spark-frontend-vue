const getDefaultState = () => {
  return {
    PreferenceResponse: {},
    categories: [],
    selectcategories: [],
    selectedItems: []
  }
}

const memberCategory = {
  namespaced: true,

  state: {
    PreferenceResponse: {},
    categories: [],
    selectcategories: [],    
    selectedItems: []
  },

  getters: {
    getselectedItems: (state) => state.selectedItems,

    getPreferenceResponse: (state) => state.PreferenceResponse,
    
    getselectcategories: (state) => state.selectcategories,

    getCategories: (state) => state.categories,

    getUniqueTypes : (state) => {
      return [...new Set(state.categories.map(c => c.pcType))]
    },
    getUniqueDesc : (state) => {
      return [... new Set(state.categories.map(c => c.pcDesc))]
    },

    getCategoriesByType: (state) => (type) => {
      return state.categories.filter(c => c.pcType === type)
    },
    getCategoriesByTypeNum: (state) => (typenum) => {
      return state.categories.filter(c => c.pcTypenum === typenum)
    },

     getTypeMeta: (state) => (type) => {
      const first = state.categories.find(c => c.pcType === type);
      if (!first) return { title: type, description: "" };
      return {
        title : first.pcType,
        description: first.pcDesc
      };
    }
  },

  mutations: {
    setselectedItems(state, payload){
      state.selectedItems = payload;
    },

    setPreferenceResponse(state, payload){
      state.PreferenceResponse = payload;
    },

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
    },

    clearSelectCategories(state){
      state.selectcategories = [];
    },

    resetState(state) {
      Object.assign(state, getDefaultState());
    }
  },

  actions: {
  }
};

export default memberCategory;