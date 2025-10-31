import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { getToken } from "../utils/token";


const axiosAuthInstance=axios.create({
    baseURL:BASE_URL+'/api/auth',
    headers:{
        "Content-Type":"application/json"
    }
    
})

axiosAuthInstance.interceptors.request.use(
    (config)=>{
        const token=getToken();
        if(token){
            config.headers.Authorization=`Bearer ${token}`
        }
        return config
    },
    (error)=>Promise.reject(error)
)

export default axiosAuthInstance