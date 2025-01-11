import React, { useState } from "react";
import styles from "./App.module.css";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import NavBar from "./components/NavBar";
import { Route, Routes } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
// import PostCreateForm from "./pages/posts/PostCreateForm";
// import PostEditForm from "./pages/posts/PostEditForm";
// import PostPage from "./pages/posts/PostPage";

import { useCurrentUser } from "./contexts/CurrentUserContext";

import ImageListPage from "./pages/posts/ImageListPage";
// import PostsPage from "./pages/posts/PostsPage";
// import ProfilePage from "./pages/profiles/ProfilePage";
// import ProfileEditForm from "./pages/profiles/ProfileEditForm";
// import UsernameForm from "./pages/profiles/UsernameForm";
// import UserPasswordForm from "./pages/profiles/UserPasswordForm";
// import NotFound from "./components/NotFound";a

import MapLeaflet from "./components/MapLeaflet";
import MapLeafletTripId from "./components/MapLeafletTripId";
import TripFilterForm from "./components/TripFilterForm";
import SearchBar from "./components/SearchBar";
import Header from "./components/Header";
import SearchTripPage from "./components/SearchTripPage";

// import Button from "react-bootstrap/Button";
// import Footer from "./components/Footer";

function App() {
    const currentUser = useCurrentUser();
    console.log("currentUser: ", currentUser);

    //const profile_id = currentUser?.profile?.id || "";
    const [query, setQuery] = useState(""); // Search query state

    const [filterCriteria, setFilterCriteria] = useState({
        country: "",
        place: "",
    });

    const handleFilter = () => {
        console.log("Applying filters:", filterCriteria);
    };

    return (
        <div className={styles.App}>
            <NavBar />
            <Header />
            <Container className={styles.Main}>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Row className="justify-content-center my-3">
                                <Col xs={12} lg={8}>
                                    <MapLeaflet
                                        countryQuery={filterCriteria.country}
                                        placeQuery={filterCriteria.place}
                                    />
                                </Col>
                                <Col
                                    xs={12}
                                    lg={4}
                                >
                                    <TripFilterForm
                                        filterCriteria={filterCriteria}
                                        setFilterCriteria={setFilterCriteria}
                                        onSubmit={handleFilter}
                                    />
                                </Col>
                            </Row>
                        }
                    />
                    {/* <Route path="/" element={<SearchTripPage />} /> */}

                    <Route
                        path="/trips/"
                        element={
                            <MapLeaflet
                                countryQuery={filterCriteria.country}
                                placeQuery={filterCriteria.place}
                            />
                        }
                    />
                    <Route
                        path="/trips/:id"
                        element={
                            <MapLeafletTripId
                                countryQuery={filterCriteria.country}
                                placeQuery={filterCriteria.place}
                            />
                        }
                    />

                    <Route
                        path="/images/"
                        element={<ImageListPage query={query} />}
                    />

                    {/* <Route
                        path="/feed"
                        element={
                            <PostsPage
                                message="No results found. Adjust the search keyword or follow a user."
                                //filter={`owner__followed__owner__profile=${profile_id}&`}
                                filter={`followed_users=True&`}
                            />
                        }
                    />
                    <Route
                        path="/liked"
                        element={
                            <PostsPage
                                message="No results found. Adjust the search keyword or like a post."
                                //filter={`likes_owner_profile=${profile_id}&ordering=-likes__created_at&`}
                                filter={`liked_by_user=True&ordering=-likes__created_at&`}
                            />
                        }
                    /> */}
                    <Route path="/signin" element={<SignInForm />} />
                    <Route path="/signup" element={<SignUpForm />} />
                    {/* <Route path="/trips/create" element={<PostCreateForm />} /> */}
                    {/* <Route exact path="/trips/:id" element={<PostPage />} />
                    <Route path="/trips/:id/edit" element={<PostEditForm />} /> */}
                    {/* <Route path="/profiles/:id" element={<ProfilePage />} /> */}
                    {/* <Route
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
                    /> */}
                    {/* <Route path="*" element={<NotFound />} /> */}
                </Routes>
            </Container>
            {/* <div style={{ paddingTop: "80px" }}>
                <Button variant="primary">Primary</Button>
            </div>
            <div style={{ paddingTop: "80px" }}>
                <MapLeaflet />
            </div> */}
            {/* <Footer /> */}
        </div>
    );
}

export default App;
