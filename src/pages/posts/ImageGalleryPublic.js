import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import Post from "./Post";
import Asset from "../../components/Asset";

import appStyles from "../../App.module.css";
import srcbStyles from "../../styles/SearchBar.module.css";
import styles from "../../styles/ImageGalleryPublic.module.css";

import { useLocation } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

import NoResults from "../../assets/no-results.png";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";

import PopularProfiles from "../profiles/PopularProfiles";
// import { useCurrentUser } from "../../contexts/CurrentUserContext";
import log from "../../utils/logger";


function ImageGalleryPublic({ message, filter="" }) {
    const [posts, setPosts] = useState({ results: [] });
    const [hasLoaded, setHasLoaded] = useState(false);
    const { pathname } = useLocation();
    const [query, setQuery] = useState("");
    //const currentUser = useCurrentUser() || {};

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await axiosReq.get(
                    `/gallery/?search=${query}&${filter}`
                );
                setPosts(data);
                setHasLoaded(true);
            } catch (err) {
                log.error(err);
            }
        };
        setHasLoaded(false);
        const timer = setTimeout(() => {
            fetchPosts();
        }, 1000);
        return () => clearTimeout(timer);
    }, [query, pathname, filter]);

    return (
        <div className={styles.GalleryContainer}>
            <Row>
                <Col className="py-2 p-0 p-lg-2">
                    <i className={`fas fa-search ${srcbStyles.SearchIcon}`} />
                    <Form
                        className={srcbStyles.SearchBar}
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
        </div>
    );
}

export default ImageGalleryPublic;

