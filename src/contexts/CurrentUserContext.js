import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import { axiosReq } from "../api/axiosDefaults";

export const CurrentUserContext = createContext(null);
export const SetCurrentUserContext = createContext(null);

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

const getToken = (type) => {
    const token = localStorage.getItem(type);
    console.log(`Retrieved ${type}:`, token);
    return token;
};

const setToken = (type, value) => {
    if (value) {
        console.log(`Setting ${type}:`, value);
        localStorage.setItem(type, value);
    } else {
        console.log(`Removing ${type}`);
        localStorage.removeItem(type);
    }
};

const CurrentUserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    // const navigate = useNavigate();

    const clearTokens = useCallback(() => {
        setToken("access_token", null);
        setToken("refresh_token", null);
    }, []);

    const handleLogout = useCallback(() => {
        clearTokens();
        setCurrentUser(null);
        //navigate("/");
    }, [clearTokens]);

    const fetchUserData = useCallback(async () => {

        try {
            const { data } = await axiosReq.get("/dj-rest-auth/user/");
            setCurrentUser(data);
        } catch (err) {
            console.error("Failed to fetch user data:", err);
            if (err.response && err.response.status === 401) {
                console.warn("Unauthorized access - clearing user session");
                handleLogout();
                setCurrentUser(null);
                clearTokens();
            }
        }
    }, [clearTokens, handleLogout]);

    const refreshToken = useCallback(async () => {
        const refreshTokenValue = getToken("refresh_token");
        if (!refreshTokenValue) {
            console.warn("No refresh token available, redirecting to sign-in.");
            handleLogout();
            return;
        }

        try {
            const response = await axios.post("/api-auth/token/refresh/", {
                refresh: refreshTokenValue,
            });

            const { access, refresh: newRefresh } = response.data;
            setToken("access_token", access);
            setToken("refresh_token", newRefresh);

            return access;
        } catch (err) {
            console.error("Token refresh failed:", err);
            handleLogout();
        }
    }, [handleLogout]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    useEffect(() => {
        const refreshTokenValue = getToken("refresh_token");
        if (!refreshTokenValue) {
            console.warn("No refresh token available; skipping refresh setup.");
            return;
        }

        const intervalId = setInterval(async () => {
            console.log("Attempting to refresh token...");
            await refreshToken();
        }, 30000);

        // const intervalId = setInterval(() => {
        //     console.log("Attempting to refresh token...");
        //     refreshToken();
        // }, 30000);

        return () => clearInterval(intervalId);
    }, [refreshToken]);

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <SetCurrentUserContext.Provider value={setCurrentUser}>
                {children}
            </SetCurrentUserContext.Provider>
        </CurrentUserContext.Provider>
    );
};

export default CurrentUserProvider;
