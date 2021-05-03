import axiosInstance from "../helpers/HttpHelper"

const getSoundById = async(soundId) => {
    return axiosInstance.get('/sound/' + soundId);
}

const getImageById = async(imageId) => {
    return axiosInstance.get('/image/' + imageId);
}

export{
    getSoundById,
    getImageById
}