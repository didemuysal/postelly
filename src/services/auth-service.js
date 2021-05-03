import axios from "axios";
import axiosInstance from "../helpers/HttpHelper";
import { getUserConfig, removeValue } from "../helpers/StorageHelper";
import {baseUrl } from '../helpers/Constants';

 /* Do not use axiosInstance in here and directly pass variables */
const login = async(username, password) => {
    
    return axios.post(baseUrl + '/auth/login', {},
        {
            auth: {
                username: username,
                password: password
            }
        }
    )
}
const logoutUser = async () => {
    let config = await getUserConfig();
    return axiosInstance.post('/auth/logout')
}

export {
    login,
    logoutUser
}

