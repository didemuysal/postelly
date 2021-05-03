import axios from "axios";
import { getUserConfig, removeValue } from "../helpers/StorageHelper";
import { baseUrl } from "./Constants";

const axiosInstance = axios.create({
    baseURL: baseUrl,
})

axiosInstance.interceptors.request.use(
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