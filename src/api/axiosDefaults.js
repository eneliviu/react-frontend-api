import axios from "axios";

axios.defaults.baseURL = "http://127.0.0.1:8000";

//axios.defaults.baseURL = "https://dj-api-backend-8cf355e96add.herokuapp.com";

axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

export const axiosReq = axios.create();
export const axiosRes = axios.create();

axiosReq.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosRes.interceptors.response.use(
    async (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem("refresh_token");
            if (refreshToken) {
                try {
                    const { data } = await axios.post(
                        "/api-auth/token/refresh/",
                        { refresh: refreshToken }
                    );
                    localStorage.setItem("access_token", data.access);
                    // localStorage.setItem("refresh_token", data.refresh);
                    originalRequest.headers[
                        "Authorization"
                    ] = `Bearer ${data.access}`;
                    return axiosRes(originalRequest);
                } catch (err) {
                    console.error("Token refresh failed:", err);
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                }
            }
        }

        return Promise.reject(error);
    }
);