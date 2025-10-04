import axios from  "./axiosConfig";

function getAllcategoryStatic(){
  return axios.post("/member/categories/static");
}

function insertMemberCategories(Request){
  return axios.post("/member/categories", Request);
}

function getPreferenceByMemberNo(memberNo){
  return axios.get("/member/membercategories", {
    params: { memberNo: memberNo }
  });
}

function deleteCategoriesByMemberWho(memberNo, memberWho){
  return axios.delete("/member/membercategories", {
    params: { memberNo: memberNo, memberWho: memberWho }
  })
}

const memberCategoryApi = {
  getAllcategoryStatic, 
  insertMemberCategories,
  getPreferenceByMemberNo,
  deleteCategoriesByMemberWho
};

export default memberCategoryApi;