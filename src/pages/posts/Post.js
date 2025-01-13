import React from "react";
import styles from "../../styles/Post.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { axiosReq } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";

// component that is responsible for rendering the details of a single post.
// This component is used by both PostPage.js and PostsPage.js to display
// individual posts. It displays the post's image, title, description, owner,

const Post = (props) => {
    const {
        description,
        id,
        image,
        images,
        image_title,
        owner_name,
        setPosts,
        shared,
        uploaded_at,
        like_id,
        likes_count,
        trip_id,
    } = props;

    //console.log("Image Post props", image);
    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === owner_name;
    //const is_owner = currentUser?.id === owner;
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/images/${id}/edit`);
    };

    const handleDelete = async () => {
        try {
            await axiosReq.delete(`/trips/${trip_id}/images/${id}/`);
            navigate("*"); // Redirect to the 404 page;
        } catch (err) {
            console.log(err);
        }
    };

    const handleLike = async () => {
        try {
            const { data } = await axiosReq.post(`/likes/`, { post: id });
            console.log("data: ", data);
            setPosts((prevPosts) => ({
                ...prevPosts,
                results: prevPosts.results.map((post) => {
                    return post.id === id
                        ? {
                              ...post,
                              likes_count: post.likes_count + 1,
                              like_id: data.id,
                          }
                        : post;
                }),
            }));
        } catch (err) {
            console.error("Failed to like post:", err);
        }
    };

    const handleUnlike = async () => {
        try {
            await axiosReq.delete(`/likes/${like_id}/`);
            setPosts((prevPosts) => ({
                ...prevPosts,
                results: prevPosts.results.map((post) => {
                    return post.id === id
                        ? {
                              ...post,
                              likes_count: post.likes_count - 1,
                              like_id: null,
                          }
                        : post;
                }),
            }));
        } catch (err) {
            console.error("Failed to unlike post:", err);
        }
    };

    return (
        <Card className={styles.Post}>
            <Card.Header>
                <Link to={`/trips/${id}`} className="d-flex align-items-center">
                    <Avatar src={image} height={55} />
                    <span className="ml-2">{owner_name}</span>
                    {image_title}
                </Link>
            </Card.Header>
            <Card.Body>
                <div className="d-flex align-items-center justify-content-between">
                    <Link
                        to={`/profiles/${id}`}
                        className="d-flex align-items-center"
                    >
                        {/* <Avatar src={image} height={55} /> */}
                        <span className="ml-2">{owner_name}</span>
                    </Link>

                    <div className="d-flex align-items-center justify-content-between">
                        <span className="mx-3"> Uploadet : {uploaded_at}</span>
                        {is_owner && (
                            <MoreDropdown
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                            ></MoreDropdown>
                        )}
                    </div>
                </div>
            </Card.Body>
            <Link to={`/trips/${trip_id}`}>
                <Card.Img src={image} alt={image_title} />
            </Link>
            <Card.Body>
                {image_title && (
                    <Card.Title className="text-center">
                        {image_title}
                    </Card.Title>
                )}
                {description && <Card.Text>{description}</Card.Text>}
                <div className={styles.PostBar}>
                    {is_owner ? (
                        <OverlayTrigger
                            placement="top"
                            overlay={
                                <Tooltip>You can't like your own post!</Tooltip>
                            }
                        >
                            <i className="far fa-heart" />
                        </OverlayTrigger>
                    ) : like_id ? (
                        <span onClick={handleUnlike}>
                            <i className={`fas fa-heart ${styles.Heart}`} />
                        </span>
                    ) : currentUser ? (
                        <span onClick={handleLike}>
                            <i
                                className={`far fa-heart ${styles.HeartOutline}`}
                            />
                        </span>
                    ) : (
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Log in to like posts!</Tooltip>}
                        >
                            <i className="far fa-heart" />
                        </OverlayTrigger>
                    )}
                    {likes_count}
                </div>
            </Card.Body>
        </Card>
    );
};

export default Post;
