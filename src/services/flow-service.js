import axiosInstance from "../helpers/HttpHelper";
import { getJsonFromStorage } from "../helpers/StorageHelper";

const getMainFlow = async () => {   //get the main flow for the very first login
    let userObj = await getJsonFromStorage('user');
    let userId = await userObj.id;

    return axiosInstance.get('/flow/main?userId=' + userId);
}

const getUserFlow = async () => {  //get the user profile flow for the very first login
    let userObj = await getJsonFromStorage('user');
    let userId = await userObj.id;

    return axiosInstance.get('/flow/user?userId=' + userId)
}

export {
    getMainFlow,
    getUserFlow
}

