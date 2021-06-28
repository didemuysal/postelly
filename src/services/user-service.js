import axios from "axios";
import { baseUrl } from "../helpers/Constants";
import axiosInstance from "../helpers/HttpHelper";


const getUserFollowed = (userId) => {  //get the users followed users
    return axiosInstance.get('/user-relation/followed?userId=' + userId);
}

const getUserFollowers = (userId) => { // users followers
    return axiosInstance.get('/user-relation/followers?userId=' + userId);
}

const searchUser = (username) => { //search user
    return axiosInstance.get('/user?username=' + username);
}


const updateUserPicture = (body) => {  //update the profile picture
    return axiosInstance.put('/user/picture', body, {
        headers: {
            "Content-Type": "multipart/form-data" //letting know HTTP is going to get photo, and text
        }
    });
}

const followUser = (userId) => { //follow user
    return axiosInstance.put('/user-relation/follow?followedUserId=' + userId);
}


const unFollowUser = (userId) => {  //unfollow user
    return axiosInstance.put('/user-relation/unfollow?unFollowedUserId=' + userId);
}



// saves users before a login so a static user is passed for basic auth 
const saveUser = async (username, firstName, lastName, password, phone, email) => {
    let userObj = {
        "username": username,
        "firstName": firstName,
        "lastName": lastName,
        "gender": "female",
        "aboutText": phone,
        "city": "antalya",
        "country": "turkey",
        "password": password,
        "email": email
    }

    return axios.post(baseUrl + '/user',   // no login so axios itself with authentication
        userObj,
        {
            auth: {
                username: "didem",
                password: 123456
            }
        }
    );
}

export {
    saveUser,
    getUserFollowers,
    getUserFollowed,
    searchUser,
    updateUserPicture,
    followUser,
    unFollowUser,
}