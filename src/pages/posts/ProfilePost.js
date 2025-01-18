import React from "react";
import styles from "../../styles/Post.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Card, OverlayTrigger, Tooltip, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { axiosReq } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";

const ProfilePost = (props) => {
    const {
        id,
        updated_at,
        title,
        place,
        country,
        trip_status,
        trip_category,
        start_date,
        end_date,
        content,
        likes_count,
    } = props;

    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/trips/${id}/edit`);
    };

    const handleDelete = async () => {
        try {
            await axiosReq.delete(`/trips/${id}/`);
            navigate("*");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Card className={styles.Post}>
            <Card.Body>
                <div className="d-flex align-items-center justify-content-between">
                    <Container className="d-flex flex-row  justify-content-between">
                        <div className="mx-3">
                            <h5>
                                <strong>{title}</strong>
                            </h5>
                            <div className="mx-3">
                                Destination: {place}, {country}
                            </div>
                            <div className="mx-3">Status: {trip_status}</div>
                            <div className="mx-3">
                                Category: {trip_category}
                            </div>
                            <div className="mx-3">
                                From {start_date} to {end_date}
                            </div>
                            <p className="mx-3">{content}</p>
                        </div>
                        <MoreDropdown
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                        />
                    </Container>
                </div>
            </Card.Body>
            <Card.Body>
                <div className={styles.PostBar}>
                    <i className="fas fa-heart" style={{color: "red"}}  />
                    {likes_count}
                </div>
                <div className="mx-3 text-muted">
                    {" "}
                    <small>Last updated: {updated_at}</small>
                </div>
            </Card.Body>
        </Card>
    );
};

export default ProfilePost;
