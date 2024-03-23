import axios from "axios";

//get token from session storage
let token=sessionStorage.getItem('token')
export const axiosWithToken=axios.create({
    headers:{Authorization:`Bearer ${token}`}
})