import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { axiosReq } from "../api/axiosDefaults";

export const useRedirect = (userAuthStatus) => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleMount = async () => {
            try {
                await axiosReq.get("/dj-rest-auth/user/");
                if (userAuthStatus === "loggedIn") {
                    navigate("/");
                }
            } catch (err) {
                if (userAuthStatus === "loggedOut") {
                    navigate("/signin");
                }
            }
        };
        handleMount();
    }, [navigate, userAuthStatus]);
};
