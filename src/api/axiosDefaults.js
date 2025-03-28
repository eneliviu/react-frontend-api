import axios from "axios";


axios.defaults.baseURL = "https://drf-backend-api-70211104c0c7.herokuapp.com/";
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