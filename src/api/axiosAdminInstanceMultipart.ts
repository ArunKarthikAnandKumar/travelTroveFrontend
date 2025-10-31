import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { getToken } from "../utils/token";


const axiosAdminInstance=axios.create({
    baseURL:BASE_URL+'/api/admin',
    headers:{
        "Content-Type":"application/json"
    }
    
})

axiosAdminInstance.interceptors.request.use(
    (config)=>{
        const token=getToken();
        if(token){
            config.headers.Authorization=`Bearer ${token}`
        }
        return config
    },
    (error)=>Promise.reject(error)
)

export default axiosAdminInstance