import React, { createContext, useState, useContext } from "react";

const LikesContext = createContext();

export const LikesProvider = ({ children }) => {
    const [likesData, setLikesData] = useState({});
    const updateLikes = (postId, likesCount, likes) => {
        setLikesData((prevData) => ({
            ...prevData,
            [postId]: { likesCount, likes },
        }));
    };

    return (
        <LikesContext.Provider value={{ likesData, updateLikes }}>
            {children}
        </LikesContext.Provider>
    );
};

export const useLikes = () => useContext(LikesContext);
