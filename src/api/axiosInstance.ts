import axios from "axios";
import { BASE_URL } from "../utils/constatnts";
import { getToken } from "../utils/token";


const axiosInstance=axios.create({
    baseURL:BASE_URL+'/api',
    headers:{
        "Content-Type":"application/json"
    }
    
})

export default axiosInstance