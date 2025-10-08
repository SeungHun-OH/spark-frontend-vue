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

function  getHobbyCategoriesByMemberNo() {
  return axios.get("http://localhost:8040/member/membercategories/hobby",{
    headers : { Authorization:"Bearer eyJhbGciOiJIUzUxMiJ9.eyJtZW1iZXJObyI6MSwiaWF0IjoxNzU5NTc5MTAyLCJleHAiOjE3NjA2NTkxMDJ9.bXe7xLBaMxPaucazjBAtSLCZqxdKDaDvGfxfm07z2AcLeRez8o8BwF_X7hNEqyDi7kY7D6JuYXYtcx8WI2w_Ng"}
  });
}



const memberCategoryApi = {
  getAllcategoryStatic, 
  insertMemberCategories,
  getPreferenceByMemberNo,
  deleteCategoriesByMemberWho,
  getAllcategoryStatic, 
  insertMemberCategories, 
  getHobbyCategoriesByMemberNo
};

export default memberCategoryApi;