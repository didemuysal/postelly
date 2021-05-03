import axiosInstance from "../helpers/HttpHelper";
import { getJsonFromStorage } from "../helpers/StorageHelper";

const getMainFlow = async () => {
    let userObj = await getJsonFromStorage('user');
    let userId = await userObj.id;

    return axiosInstance.get('/flow/main?userId=' + userId);
}

const getUserFlow = async () => {
    let userObj = await getJsonFromStorage('user');
    let userId = await userObj.id;

    return axiosInstance.get('/flow/user?userId=' + userId)
}

export {
    getMainFlow,
    getUserFlow
}

