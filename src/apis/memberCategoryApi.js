import axios from "axios";

function getAllcategoryStatic(){
  return axios.post("http://localhost:8040/member/categories/static");
}

function insertMemberCategories(Request){
  return axios.post("http://localhost:8040/member/categories", Request);
}

function getPreferenceByMemberNo(memberNo){
  return axios.get("http://localhost:8040/member/membercategories", {
    params: { memberNo: memberNo }
  });
}

function deleteCategoriesByMemberWho(memberNo, memberWho){
  return axios.delete("http://localhost:8040/member/membercategories", {
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