import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq } from "../api/axiosDefaults";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { followHelper, unfollowHelper } from "../utils/utils";
import { useNavigate } from "react-router-dom";

const ProfileDataContext = createContext();
const SetProfileDataContext = createContext();

export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);

export const ProfileDataProvider = ({ children }) => {
    const [profileData, setProfileData] = useState({
        pageProfile: { results: [] },
        popularProfiles: { results: [] },
    });

    const currentUser = useCurrentUser();
    const navigate = useNavigate();

    const handleFollow = async (clickedProfile) => {
        try {
            const { data } = await axiosReq.post("/followers/", {
                followed: clickedProfile.id,
            });

            setProfileData((prevState) => ({
                ...prevState,
                pageProfile: {
                    results: prevState.pageProfile.results.map((profile) =>
                        followHelper(profile, clickedProfile, data.id)
                    ),
                },
                popularProfiles: {
                    ...prevState.popularProfiles,
                    results: prevState.popularProfiles.results.map((profile) =>
                        followHelper(profile, clickedProfile, data.id)
                    ),
                },
            }));

        } catch (err) {
            console.log(err);
        }
    };

    const handleUnfollow = async (clickedProfile) => {
        try {
            await axiosReq.delete(`/followers/${clickedProfile.following_id}/`);

            setProfileData((prevState) => ({
                ...prevState,
                pageProfile: {
                    results: prevState.pageProfile.results.map((profile) =>
                        unfollowHelper(profile, clickedProfile)
                    ),
                },
                popularProfiles: {
                    ...prevState.popularProfiles,
                    results: prevState.popularProfiles.results.map((profile) =>
                        unfollowHelper(profile, clickedProfile)
                    ),
                },
            }));
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const handleMount = async () => {
            if (!currentUser) return;
            try {
                const { data } = await axiosReq.get(
                    "/profiles/?ordering=-followers_count"
                );
                setProfileData((prevState) => ({
                    ...prevState,
                    popularProfiles: data,
                }));
            } catch (err) {
                if (err.response?.status === 401) {
                    console.log(
                        "User is not authenticated. Redirecting to login..."
                    );
                    navigate("/signin");
                } else {
                    console.log("Error fetching profiles:", err);
                }
            }
        };

        handleMount();
    }, [currentUser, navigate]);

    return (
        <ProfileDataContext.Provider value={profileData}>
            <SetProfileDataContext.Provider
                value={{ setProfileData, handleFollow, handleUnfollow }}
            >
                {children}
            </SetProfileDataContext.Provider>
        </ProfileDataContext.Provider>
    );
};
