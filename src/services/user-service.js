import axios from "axios";
import { baseUrl } from "../helpers/Constants";
import axiosInstance from "../helpers/HttpHelper";
import { getUserConfig } from "../helpers/StorageHelper";



const getUserByUsername = (username) => {
    return axiosInstance.get('/user?username=' + username);
}

const getUserFollowed = (userId) => {
    return axiosInstance.get('/user-relation/followed?userId=' + userId);
}

const getUserFollowers = (userId) => {
    return axiosInstance.get('/user-relation/followers?userId=' + userId);
}

const searchUser = (username) => {
    return axiosInstance.get('/user?username=' + username);
}


const updateUserPicture = (body) => {
    return axiosInstance.put('/user/picture', body, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
}

const followUser = (userId) => {
    return axiosInstance.put('/user-relation/follow?followedUserId=' + userId);
}


const unFollowUser = (userId) => {
    return axiosInstance.put('/user-relation/unfollow?unFollowedUserId=' + userId);
}




const deleteUserPicture = () => {
    return axiosInstance.delete('/user/picture2')
}



/* This function is saves users before a login so a static user is passed for basic auth */
const saveUser = async (username, firstName, lastName, password, phone, email) => {
    let userObj = {
        "username": username,
        "firstName": firstName,
        "lastName": lastName,
        "gender": "male",
        "aboutText": phone,
        "city": "antalya",
        "country": "turkey",
        "password": password,
        "email": email
    }

    return axios.post(baseUrl + '/user',
        userObj,
        {
            auth: {
                username: "anil",
                password: 123456
            }
        }
    );
}

export {
    getUserByUsername,
    saveUser,
    getUserFollowers,
    getUserFollowed,
    searchUser,
    updateUserPicture,
    followUser,
    unFollowUser,
    deleteUserPicture
}