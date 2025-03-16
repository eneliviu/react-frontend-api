import React, { useState, useEffect } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Post from "./Post";
//import { useCurrentUser } from "../../contexts/CurrentUserContext";
import PopularProfiles from "../profiles/PopularProfiles";


function PostPage() {
    const { id } = useParams();
    const [post, setPost] = useState({ results: [] });
    //const currentUser = useCurrentUser();

    useEffect(() => {
        const handleMount = async () => {
            try {
                const [
                    { data: post },
                ] = await Promise.all([
                    axiosReq.get(`/trips/${id}`),
                ]);
                setPost({ results: [post] });
            } catch (err) {
                console.error("Post fetch failed:", err);
            }
        };

        handleMount();
    }, [id]);

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
