import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";

import axios from "axios";
import { axiosReq } from "../api/axiosDefaults";

export const CurrentUserContext = createContext(null);
export const SetCurrentUserContext = createContext(null);

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

const getToken = (type) => {
    const token = localStorage.getItem(type);
    return token;
};

const setToken = (type, value) => {
    if (value) {
        localStorage.setItem(type, value);
    } else {
        localStorage.removeItem(type);
    }
};

const CurrentUserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const clearTokens = useCallback(() => {
        setToken("access_token", null);
        setToken("refresh_token", null);
    }, []);

    const handleLogout = useCallback(() => {
        clearTokens();
        setCurrentUser(null);
    }, [clearTokens]);

    const fetchUserData = useCallback(async () => {

        try {
            const { data } = await axiosReq.get("/dj-rest-auth/user/");
            setCurrentUser(data);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                handleLogout();
                setCurrentUser(null);
                clearTokens();
            }
        }
    }, [clearTokens, handleLogout]);

    const refreshToken = useCallback(async () => {
        const refreshTokenValue = getToken("refresh_token");
        if (!refreshTokenValue) {
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
            return;
        }

        const intervalId = setInterval(async () => {
            await refreshToken();
        }, 53000);

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
