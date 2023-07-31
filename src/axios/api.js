import axios from "axios";
export const url = "https://kodegram-server.onrender.com";
// export const url = "http://localhost:8080";

export const getAllUsers = async(data) => {
    try {
        return await axios.post(url+"/user/get", data);
    } catch (error) {
        console.log(error);
    }
}

export const createNewUser = async(data) => {
    try {
        return await axios.post(url+"/user/add", data);
    } catch (error) {
        console.log(error);
    }
}

export const updateUser = async(data) => {
    try {
        return await axios.post(url+"/user/update", data);
    } catch (error) {
        console.log(error);
    }
}

export const updatePass = async(data) => {
    try {
        return await axios.post(url+"/user/pass", data);
    } catch (error) {
        console.log(error);
    }
}

export const loginUser = async(data) => {
    try {
        return await axios.post(url+"/user/login", data);
    } catch (error) {
        console.log(error);
    }
}

export const forgotPass = async(data) => {
    try {
        return await axios.post(url+"/user/forgot", data);
    } catch (error) {
        console.log(error);
    }
}

export const getUserFromToken = async(data) => {
    try {
        return await axios.post(url+"/user/home", data);
    } catch (error) {
        console.log(error);
    }
}

export const getUserProfile = async(data) => {
    try {
        return await axios.post(url+"/user/profile", data);
    } catch (error) {
        console.log(error);
    }
}

export const followUser = async(data) => {
    try {
        return await axios.post(url+"/user/follow", data);
    } catch (error) {
        console.log(error);
    }
}

export const getFollows = async(data) => {
    try {
        return await axios.post(url+"/user/follow-count", data);
    } catch (error) {
        console.log(error);
    }
}

export const followersDetail = async(data) => {
    try {
        return await axios.post(url+"/user/followers", data);
    } catch (error) {
        console.log(error);
    }
}

export const followingsDetail = async(data) => {
    try {
        return await axios.post(url+"/user/followings", data);
    } catch (error) {
        console.log(error);
    }
}

export const addPost = async(data) => {
    try {
        return await axios.post(url+"/post/add", data);
    } catch (error) {
        console.log(error);
    }
}

export const editPost = async(data) => {
    try {
        return await axios.post(url+"/post/edit", data);
    } catch (error) {
        console.log(error);
    }
}

export const deletePost = async(data) => {
    try {
        return await axios.post(url+"/post/delete", data);
    } catch (error) {
        console.log(error);
    }
}

export const getHomePostsFromToken = async(data) => {
    try {
        return await axios.post(url+"/post/home-posts", data);
    } catch (error) {
        console.log(error);
    }
}

export const getProfilePostsFromToken = async(data) => {
    try {
        return await axios.post(url+"/post/profile-posts", data);
    } catch (error) {
        console.log(error);
    }
}

export const likePost = async(data) => {
    try {
        return await axios.post(url+"/post/like", data);
    } catch (error) {
        console.log(error);
    }
}

export const addComment = async(data) => {
    try {
        return await axios.post(url+"/post/add-comment", data);
    } catch (error) {
        console.log(error);
    }
}

export const getComment = async(data) => {
    try {
        return await axios.post(url+"/post/get-comment", data);
    } catch (error) {
        console.log(error);
    }
}

export const getPostLikers = async(data) => {
    try {
        return await axios.post(url+"/post/get-likers", data);
    } catch (error) {
        console.log(error);
    }
}

export const getConvo = async(data) => {
    try {
        return await axios.post(url+"/chat/getConvo", data);
    } catch (error) {
        console.log(error);
    }
}

export const getMessage = async(data) => {
    try {
        return await axios.post(url+"/chat/getMessage", data);
    } catch (error) {
        console.log(error);
    }
}

export const sendMessage = async(data) => {
    try {
        return await axios.post(url+"/chat/sendMessage", data);
    } catch (error) {
        console.log(error);
    }
}

export const setRead = async(data) => {
    try {
        return await axios.post(url+"/chat/setRead", data);
    } catch (error) {
        console.log(error);
    }
}