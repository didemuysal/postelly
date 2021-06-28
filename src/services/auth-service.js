import axios from "axios";
import axiosInstance from "../helpers/HttpHelper";
import { getUserConfig, removeValue } from "../helpers/StorageHelper";
import {baseUrl } from '../helpers/Constants';

 /* Do not use axiosInstance in here and directly pass variables */
const login = async(username, password) => { //login operations 
    
    return axios.post(baseUrl + '/auth/login', {},   //login authentication with axios - before login, auth needed 
        {
            auth: {
                username: username,
                password: password
            }
        }
    )
}
const logoutUser = async () => {   // logout operations with axios Instance
    let config = await getUserConfig();
    return axiosInstance.post('/auth/logout')
}

export {
    login,
    logoutUser
}

