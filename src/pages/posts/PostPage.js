import React, { useState, useEffect } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Post from "./Post";
import Asset from "../../components/Asset";

import InfiniteScroll from "react-infinite-scroll-component";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";



// Component that is responsible for displaying a single post along
// with its details. It fetches the post data from the server using
// the post ID from the URL parameters and then renders the Post
// component to display the post.
function PostPage() {
    const { id } = useParams();
    const [post, setPost] = useState({ results: [] });
    const currentUser = useCurrentUser();
    const profile_image = currentUser?.profile_image;

    useEffect(() => {
        const handleMount = async () => {
            try {
                const [
                    { data: post },
                ] = await Promise.all([
                    axiosReq.get(`/trips/${id}`), // Fetch post data
                ]);
                setPost({ results: [post] });
            } catch (err) {
                console.error("Post fetch failed:", err);
            }
        };

        handleMount();
    }, [id]); // Runs when id changes

    return (
        <Row className="h-100">
            <Col className="py-2 p-0 p-lg-2" lg={8}>
                <PopularProfiles mobile />
                {<Post {...post.results[0]} setPosts={setPost} />}
            </Col>
            <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
                <PopularProfiles />
            </Col>
        </Row>
    );
}

export default PostPage;
