import React, { useState, useEffect } from "react";
import styles from "./App.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NavBar from "./components/NavBar";
import { Route, Routes } from "react-router-dom";
import "./api/axiosDefaults";
import { useLocation } from "react-router-dom";

import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";

import ProfileEditForm from "./pages/profiles/ProfileEditForm";
import UsernameForm from "./pages/profiles/UsernameForm";
import UserPasswordForm from "./pages/profiles/UserPasswordForm";

import TripFilterForm from "./components/TripFilterForm";
import Header from "./components/Header";
import ProfilePage from "./pages/profiles/ProfilePage";
import TripCreateForm from "./pages/posts/TripCreateForm";
import TripEditForm from "./pages/posts/TripEditForm";
import NotFound from "./components/NotFound";
import ImageUploadForm from "./pages/posts/ImageUploadForm";
import ImageGalleryPublic from "./pages/posts/ImageGalleryPublic";

import ImagePostEditForm from "./pages/posts/ImagePostEditForm";
import MapComponent from "./components/MapComponent";

function App() {
    const location = useLocation();
    const [filterCriteria, setFilterCriteria] = useState({
        country: "",
        place: "",
    });

    const handleFilter = () => {
        console.log("Apply filters:", filterCriteria);
    };

    const [mapKey, setMapKey] = useState(`map-${Date.now()}`);
    const [galleryRefresh, setGalleryRefresh] = useState(0);

    const handleProfileDelete = () => {
        setMapKey(`map-deleted-${Date.now()}`);
        setGalleryRefresh((prev) => prev + 1);

        sessionStorage.setItem("mapNeedsRefresh", "true");
        sessionStorage.setItem("mapRefreshTime", Date.now().toString());
    };

    useEffect(() => {
        const profileDeleted = sessionStorage.getItem("profileDeleted");
        const lastAction = sessionStorage.getItem("lastAction");

        if (profileDeleted === "true" && lastAction) {
            const now = Date.now();
            const timestamp = parseInt(lastAction, 10);

            if (now - timestamp < 60000) {
                console.log(
                    "Detected recent profile deletion, refreshing components"
                );

                setMapKey((prevKey) => prevKey + 1);
                setGalleryRefresh((prevState) => prevState + 1);

                sessionStorage.removeItem("profileDeleted");
                sessionStorage.removeItem("lastAction");
            }
        }
    }, [location.pathname]);

    return (
        <div className={styles.App}>
            <NavBar />
            <Container className={styles.Main}>
                {location.pathname === "/" && <Header />}
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Row className="justify-content-center my-0 flex-column-reverse flex-lg-row">
                                <Col xs={12} lg={8}>
                                    <MapComponent
                                        key={mapKey}
                                        className="mt-2 mt-lg-0"
                                        countryQuery={filterCriteria.country}
                                        placeQuery={filterCriteria.place}
                                    />
                                </Col>
                                <Col xs={12} lg={4}>
                                    <TripFilterForm
                                        className="mt-2 mt-lg-0"
                                        filterCriteria={filterCriteria}
                                        setFilterCriteria={setFilterCriteria}
                                        onSubmit={handleFilter}
                                    />
                                </Col>
                            </Row>
                        }
                    />
                    <Route
                        path="/gallery"
                        element={
                            <ImageGalleryPublic
                                key={`gallery-${galleryRefresh}`}
                                forceRefresh={galleryRefresh}
                                message="No results found. Adjust the search keyword or follow a user."
                            />
                        }
                    />

                    <Route
                        path="/feed"
                        element={
                            <ImageGalleryPublic
                                key={`gallery-${galleryRefresh}`}
                                forceRefresh={galleryRefresh}
                                message="No results found. Adjust the search keyword or make sure the user posted an image."
                                filter={`followed_users=True&`}
                            />
                        }
                    />
                    <Route
                        path="/liked"
                        element={
                            <ImageGalleryPublic
                                key={`gallery-${galleryRefresh}`}
                                forceRefresh={galleryRefresh}
                                filter={`liked_by_user=True&ordering=-likes__created_at&`}
                                message="No results found. Adjust the search keyword or like a post."
                            />
                        }
                    />

                    <Route path="/signin" element={<SignInForm />} />
                    <Route path="/signup" element={<SignUpForm />} />

                    <Route path="/trips/create" element={<TripCreateForm />} />

                    <Route
                        path="/trips/:tripId/edit"
                        element={<TripEditForm />}
                    />

                    <Route
                        path="/trips/:tripId/images"
                        element={<ImageUploadForm />}
                    />

                    <Route
                        path="/trips/:tripId/images/edit/:imageId"
                        element={<ImagePostEditForm />}
                    />

                    <Route
                        path="/profiles/:id"
                        element={
                            <ProfilePage
                                onDeleteProfile={handleProfileDelete}
                            />
                        }
                        message="No results found."
                    />

                    <Route
                        path="/profiles/:id/edit/username"
                        element={<UsernameForm />}
                    />
                    <Route
                        path="/profiles/:id/edit/password"
                        element={<UserPasswordForm />}
                    />
                    <Route
                        path="/profiles/:id/edit"
                        element={<ProfileEditForm />}
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Container>
        </div>
    );
}

export default App;
