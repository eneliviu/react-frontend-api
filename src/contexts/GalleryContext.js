import React, { createContext, useState, useContext } from "react";

export const GalleryContext = createContext();

export const useGalleryContext = () => {
    return useContext(GalleryContext);
};


export const GalleryProvider = ({ children }) => {
    const [refreshGallery, setRefreshGallery] = useState(0);

    return (
        <GalleryContext.Provider value={{ refreshGallery, setRefreshGallery }}>
            {children}
        </GalleryContext.Provider>
    );
};
