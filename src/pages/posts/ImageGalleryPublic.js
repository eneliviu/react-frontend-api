import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import Post from "./Post";
import Asset from "../../components/Asset";

import appStyles from "../../App.module.css";
import rowStyles from "../../styles/SignInUpForm.module.css";
import styles from "../../styles/ImageListPage.module.css";
import { useLocation } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

import NoResults from "../../assets/no-results.png";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";

import PopularProfiles from "../profiles/PopularProfiles";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

// component that is responsible for displaying a list of posts.
// It fetches the posts data from the server using an optional filter
// and then renders a list of Post components to display each post.

function ImageGalleryPublic({ message}) {
    const [posts, setPosts] = useState({ results: [] });
    const [hasLoaded, setHasLoaded] = useState(false);
    const { pathname } = useLocation();
    const [query, setQuery] = useState("");
    const currentUser = useCurrentUser() || {};
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await axiosReq.get(
                    `/gallery/?search=${query}`
                );
                setPosts(data);
                setHasLoaded(true);
            } catch (err) {
                console.log(err);
            }
        };
        setHasLoaded(false);
        const timer = setTimeout(() => {
            fetchPosts();
        }, 1000);
        return () => clearTimeout(timer);
    }, [query, pathname]);

    return (
        <Row className={rowStyles.Row}>
            <Col className="py-2 p-0 p-lg-2">
                <OverlayTrigger
                    placement="top"
                    overlay={
                        <Tooltip>
                            {currentUser
                                ? "See Most Followed Profiles"
                                : "Log in to see profiles"}
                        </Tooltip>
                    }
                >
                    <div
                        style={{
                            opacity: currentUser ? 1 : 0.5,
                            pointerEvents: currentUser ? "auto" : "none",
                        }}
                    >
                        <PopularProfiles mobile />
                    </div>
                </OverlayTrigger>
                <i className={`fas fa-search ${styles.SearchIcon}`} />
                <Form
                    className={styles.SearchBar}
                    onSubmit={(event) => event.preventDefault()}
                >
                    <Form.Control
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        type="text"
                        placeholder="Search free text and upload date (yyyy-mm-dd)"
                        className="mr-sm-2"
                    />
                </Form>
                {hasLoaded ? (
                    <>
                        {posts.results.length ? (
                            <InfiniteScroll
                                children={posts.results
                                    .filter((post) => post.image)
                                    .map((post) => (
                                        <Post
                                            key={post.id}
                                            {...post}
                                            setPosts={setPosts}
                                        />
                                    ))}
                                dataLength={posts.results.length}
                                loader={<Asset spinner />}
                                hasMore={!!posts.next}
                                next={() => fetchMoreData(posts, setPosts)}
                            />
                        ) : (
                            <Container className={appStyles.Content}>
                                <Asset src={NoResults} message={message} />
                            </Container>
                        )}
                    </>
                ) : (
                    <Container className={appStyles.Content}>
                        <Asset spinner />
                    </Container>
                )}
            </Col>
            <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
                <PopularProfiles />
            </Col>
        </Row>
    );
}

export default ImageGalleryPublic;

