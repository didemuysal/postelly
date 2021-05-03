import axios from "axios";
import axiosInstance from "../helpers/HttpHelper";
import { getJsonFromStorage, getUserConfig } from "../helpers/StorageHelper";

const queryString = require('query-string');


const getPostById = (postId) => {
    return axiosInstance.get('/post' + postId);
}

const getUserPosts = (userId) => {
    return axiosInstance.get('/post?userId=' + userId);
}

const getUsersLikedPost = (postId) => {
    return axiosInstance.get('post/like-users?postId=' + postId);
}

const likePost = (postId) => {
    return axiosInstance.put('post/like?postId=' + postId);
}
const unLikePost = (postId) => {
    return axiosInstance.put('post/unlike?postId=' + postId);
}

const deletePost = (postId) => {
    return axiosInstance.delete('/post?postId=' + postId);
}


const savePost = async (formData) => {
    return axiosInstance.post('/post/save', formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
}


export {
    getPostById,
    savePost,
    getUserPosts,
    getUsersLikedPost,
    likePost,
    unLikePost,
    deletePost
}