import axios from "axios";

function getAllcategoryStatic(){
  return axios.post("http://localhost:8040/member/categories/static");
}

function insertMemberCategories(Request){
  return axios.post("http://localhost:8040/member/categories", Request);
}

const memberCategoryApi = {
  getAllcategoryStatic, insertMemberCategories
};

export default memberCategoryApi;