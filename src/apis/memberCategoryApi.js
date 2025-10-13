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

function  getHobbyCategoriesByMemberNo(m_no) {
  return axios.get("/member/membercategories/hobby", {
    params : { m_no }
  });
}

function getCategoryByMnickname(m_nickname) {
  return axios.get(`/member/membercategories/${encodeURIComponent(m_nickname)}`);
}


const memberCategoryApi = {
  getAllcategoryStatic, 
  insertMemberCategories,
  getPreferenceByMemberNo,
  deleteCategoriesByMemberWho,
  getHobbyCategoriesByMemberNo,
  getCategoryByMnickname
};

export default memberCategoryApi;