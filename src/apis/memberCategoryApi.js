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

const memberCategoryApi = {
  getAllcategoryStatic, 
  insertMemberCategories,
  getPreferenceByMemberNo
};

export default memberCategoryApi;