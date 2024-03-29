import axios from "axios";
import { SetPosts } from "../redux/postSlice";

const API_URL = "https://socialmedia-7p99.onrender.com";
// const API_URL = "http://localhost:8800";

export const API = axios.create({
    baseURL: API_URL,
    responseType: "json",
});
export const apiRequest = async ({ url, token, data, method }) => {
    try {
        const result = await API(url, {
            method: method || "GET",
            data: data,
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
            },
        });
        return result?.data;
    } catch (error) {
        const err = error.response.data;
        console.log(err);
        return { status: err.success, message: err.message };
    }
}

export const handleFileUpload = async (uploadFile) => {
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("upload_preset", "socialmedia");
    try {
        const response = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_ID}/image/upload/`, formData);
        return response.data.secure_url;

    } catch (error) {
        console.log(error);
        // Handle error appropriately, e.g., show a message to the user
        throw new Error("Failed to upload file to Cloudinary");
    }
};


export const fetchPosts = async (token, dispatch, uri, data) => {
    try {
        const res = await apiRequest({
            url: uri || "/posts",
            token: token,
            method: "POST",
            data: data || {}
        });
        dispatch(SetPosts(res?.data));
        return;
    } catch (error) {
        console.log(error);
    }
}

export const likePost = async (token, uri) => {
    try {
        const res = await apiRequest({
            url: uri,
            token: token,
            method: "POST",
        });
        return res;
    } catch (error) {
        console.log(error);
    }
}


export const deletePost = async (id, token) => {
    try {
        await apiRequest({
            url: "/posts/" + id,
            token: token,
            method: "DELETE",
        });
        return;
    } catch (error) {
        console.log(error);
    }
}

export const getUSerInfo = async (token, id) => {
    try {
        const uri = id === undefined ? "/users/get-user" : "/users/get-user/" + id;
        const res = await apiRequest({
            url: uri,
            token: token,
            method: "POST",

        });
        if (res?.message === "Authentication failed") {
            localStorage.removeItem("user");
            window.alert("User Session expired. Login again.");
            window.location.replace("/login");
        }
        return res?.user;
    } catch (error) {
        console.log(error);
    }
}

export const sendFriendRequest = async (token, id) => {
    try {
        await apiRequest({
            url: "/users/friend-request",
            token: token,
            method: "POST",
            data: { requestTo: id },

        });
        return;
    } catch (error) {
        console.log(error);
    }
}

