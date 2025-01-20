/**
 * Post component renders a single post with its details, including the image, title, description,
 * owner information, and likes functionality.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {string} props.description - The description of the post.
 * @param {number} props.id - The ID of the post.
 * @param {string} props.image - The URL of the image in the post.
 * @param {string} props.image_title - The title of the image.
 * @param {string} props.owner_name - The username of the post owner.
 * @param {Function} props.setPosts - Function to update the posts state.
 * @param {string} props.uploaded_at - The upload date of the post.
 * @param {number} props.likes_count - The number of likes the post has received.
 * @param {number} props.trip_id - The ID of the trip associated with the post.
 * @param {number} props.like_id - The ID of the like if the current user has liked the post.
 * @returns {JSX.Element} The rendered Post component.
 */

import React, { useEffect, useState } from "react";
import styles from "../../styles/Post.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { axiosReq } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";


const Post = (props) => {
    const {
        description,
        id,
        image,
        image_title,
        owner_name,
        setPosts,
        uploaded_at,
        likes_count,
        trip_id,
        likes,
    } = props;

    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === owner_name;
    const navigate = useNavigate();

//   const [likeId, setLikeId] = useState(null);


    const handleImageEdit = () => {
        navigate(`/trips/${trip_id}/images/edit/`);
    };

    const handleImageDelete = async () => {
        try {
            await axiosReq.delete(`/trips/${trip_id}/images/${id}/`);
            navigate("*");
        } catch (err) {
            console.log(err);
        }
    };

    const handleLike = async () => {
        try {
            const { data } = await axiosReq.post("/likes/", {
                image: id,
            });
            setPosts((prevPosts) => ({
                ...prevPosts,
                results: prevPosts.results.map((post) => {
                    return post.id === id
                        ? {
                              ...post,
                              likes_count: (post.likes_count ) + 1,
                              likes: data.id,
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
            await axiosReq.delete(`/likes/${likes}/`);
            setPosts((prevPosts) => ({
                ...prevPosts,
                results: prevPosts.results.map((post) => {
                    return post.id === id
                        ? {
                              ...post,
                              likes_count: post.likes_count - 1,
                              likes: null,
                          }
                        : post;
                }),
            }));
        } catch (err) {
            console.error("Failed to unlike post:", err);
        }
    };

    console.log("likes_count", likes_count);
    console.log("likes", likes);
    return (
        <Card className={styles.Post}>
            <Card.Body>
                <div className="d-flex align-items-center justify-content-between">
                    {is_owner ? (
                        <Link
                            to={`/profiles/${currentUser.pk}`}
                            className="d-flex align-items-center"
                        >
                            <Avatar src={image} height={55} />
                            <span className="ml-2">{owner_name}</span>
                        </Link>
                    ) : (
                        <>
                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Log in for details!</Tooltip>}
                            >
                                <div className="d-flex align-items-center">
                                    <Avatar src={image} height={55} />
                                    <span className="ml-2">{owner_name}</span>
                                </div>
                            </OverlayTrigger>
                        </>
                    )}

                    <div className="d-flex align-items-center justify-content-between">
                        <span className="mx-3 text-muted">
                            {" "}
                            Uploaded: {uploaded_at}
                        </span>
                        {is_owner && (
                            <MoreDropdown
                                handleEdit={handleImageEdit}
                                handleDelete={handleImageDelete}
                            />
                        )}
                    </div>
                </div>
            </Card.Body>
            <Card.Body>
                {is_owner ? (
                    <>
                        {image_title && (
                            <Card.Title className="text-center">
                                {image_title}
                            </Card.Title>
                        )}
                        {/* <Link to={`/trips/${trip_id}`}> */}
                        <Card.Img src={image} alt={image_title} />
                        {/* </Link> */}
                        {description && <Card.Text>{description}</Card.Text>}
                    </>
                ) : (
                    <>
                        {currentUser ? (
                            // <Link to={`/trips/${trip_id}`}>
                            <Card.Img src={image} alt={image_title} />
                        ) : (
                            // </Link>
                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>Log in for details!</Tooltip>}
                            >
                                <Card.Img src={image} alt={image_title} />
                            </OverlayTrigger>
                        )}
                    </>
                )}
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
                    ) : likes_count>0 ? (
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

