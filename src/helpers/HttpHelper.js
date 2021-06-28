import axios from "axios";
import { getUserConfig, removeValue } from "../helpers/StorageHelper";
import { baseUrl } from "./Constants";

const axiosInstance = axios.create({   //axios instance created
    baseURL: baseUrl,
})

axiosInstance.interceptors.request.use(  //inceptor adds basic auth config to the header of the API request
    async config => {
        const authConfig = await getUserConfig()
        if(authConfig){
            config.auth = authConfig.auth
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)



export default axiosInstance;