import React, { useState, useEffect } from "react";
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
        owner,
        image,
        image_title,
        owner_name,
        setPosts,
        uploaded_at,
        likes_count,
        trip_id,
        likes,
    } = props;

    //console.log("imitial props", props);

    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === owner_name;
    const isAuthenticated = !!currentUser;
    const navigate = useNavigate();

    const likesArray = Array.isArray(likes) ? likes : [];
    const hasLiked = likesArray.some(
        (like) => like.owner === currentUser?.username
    );

    const handleImageEdit = () => {
        navigate(`/trips/${trip_id}/images/edit/`);
    };

    const handleImageDelete = async () => {
        try {
            await axiosReq.delete(`/trips/${trip_id}/images/${id}/`);
            navigate(-1);
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
                    if (post.id === id) {
                        const updatedLikes = Array.isArray(post.likes)
                            ? post.likes
                            : [];
                        return {
                            ...post,
                            likes_count: post.likes_count + 1,
                            likes: [...updatedLikes, data], // Ensure likes is an array
                        };
                    }
                    return post;
                }),
            }));
        } catch (err) {
            console.error("Failed to like post:", err);
        }
    };

    const handleUnlike = async () => {
        try {
            const likeId = likesArray.find(
                (like) => like.owner === currentUser?.username
            )?.id;

            if (!likeId) {
                throw new Error("Like ID not found for the current user.");
            }

            await axiosReq.delete(`/likes/${likeId}/`);
            setPosts((prevPosts) => ({
                ...prevPosts,
                results: prevPosts.results.map((post) => {
                    if (post.id === id) {
                        const updatedLikes = Array.isArray(post.likes)
                            ? post.likes
                            : [];
                        return {
                            ...post,
                            likes_count: post.likes_count - 1,
                            likes: updatedLikes.filter(
                                (like) => like.owner !== currentUser?.username
                            ),
                        };
                    }
                    return post;
                }),
            }));
        } catch (err) {
            console.error("Failed to unlike post:", err);
        }
    };

    const getProfileImage = async (owner) => {
        try {
            const { data } = await axiosReq.get(`/profiles/${owner}/`);
            if (data.image && data.image.length > 0) {
                return data.image;
            } else {
                console.error("No images found for the profile.");
                return null;
            }
        } catch (err) {
            console.error("Failed to fetch profile image:", err);
            return null;
        }
    };

    const [profileImage, setProfileImage] = useState("");
    useEffect(() => {
        const fetchProfileImage = async () => {
            const imageUrl = await getProfileImage(owner);
            if (imageUrl) {
                setProfileImage(imageUrl);
            }
        };

        fetchProfileImage();
    }, [owner]);

    return (
        <Card className={styles.Post}>
            <Card.Body>
                <div className="d-flex align-items-center justify-content-between">
                    {isAuthenticated ? (
                        <Link
                            to={`/profiles/${owner}`}
                            className="d-flex align-items-center"
                        >
                            <Avatar
                                src={profileImage || undefined}
                                height={55}
                            />
                            <span className="ml-2">{owner_name}</span>
                        </Link>
                    ) : (
                        <OverlayTrigger
                            placement="top"
                            overlay={
                                <Tooltip>
                                    {is_owner
                                        ? "Visit profile"
                                        : "Log in to see profiles"}
                                </Tooltip>
                            }
                        >
                            <span className="d-flex align-items-center">
                                <Avatar
                                    src={profileImage || undefined}
                                    height={55}
                                />
                                <span className="ml-2">{owner_name}</span>
                            </span>
                        </OverlayTrigger>
                    )}

                    <div className="d-flex align-items-center justify-content-between">
                        <span className="mx-3 text-muted text-center">
                            {" "}
                            <small>Uploaded at: {uploaded_at}</small>
                        </span>
                        {is_owner && (
                            <MoreDropdown
                                handleEdit={handleImageEdit}
                                handleDelete={handleImageDelete}
                            />
                        )}
                    </div>
                </div>
                <hr />
            </Card.Body>
            <Card.Body>
                <>
                    {image_title && (
                        <Card.Title className="text-center">
                            {image_title}
                        </Card.Title>
                    )}
                    <Card.Img src={image} alt={image_title} />
                    {description && <Card.Text>{description}</Card.Text>}
                </>
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
                    ) : hasLiked ? ( // Use hasLiked here
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
