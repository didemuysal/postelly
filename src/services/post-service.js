//API related requests
import axiosInstance from "../helpers/HttpHelper";


const getUsersLikedPost = (postId) => {   //get all the users who liked the posts
    return axiosInstance.get('post/like-users?postId=' + postId);
}

const likePost = (postId) => {  //like post
    return axiosInstance.put('post/like?postId=' + postId);
}
const unLikePost = (postId) => {  //unlike post
    return axiosInstance.put('post/unlike?postId=' + postId);
}

const deletePost = (postId) => {  // delete post
    return axiosInstance.delete('/post?postId=' + postId);
}


const savePost = async (formData) => {  // save post
    return axiosInstance.post('/post/save', formData, {
        headers: {
            "Content-Type": "multipart/form-data"  //letting know HTTP is going to get photo, and text
        } 
    });
}


export {
    savePost,
    getUsersLikedPost,
    likePost,
    unLikePost,
    deletePost
}