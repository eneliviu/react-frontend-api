import React, { useState } from "react";
import styles from "../../styles/Post.module.css";
import mapStyles from "../../styles/MapComponent.module.css";
import { Button, Card, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";
import ImageCarousel from "../../components/ImageCarousel";
import btnStyles from "../../styles/Button.module.css";
import Alert from "react-bootstrap/Alert";

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
        total_likes_count,
        images,
        is_owner,
    } = props;

    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/trips/${id}/edit`);
    };

    const [notification, setNotification] = useState("");
    const [, setErrors] = useState({});

    const handleDelete = async (id) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this trip? The action is irreversible."
            )
        ) {
            return;
        }
        try {
            await axiosReq.delete(`/trips/${id}/`);
            setInterval(() => {
                setNotification("Trip deleted successfully. Close to refresh.");
            }, 1000);
        } catch (err) {
            if (err.response?.status !== 401) {
                setErrors(
                    err.response?.data || { error: "Unexpected error occurred" }
                );
                setNotification(
                    "Failed to delete the image. Please try again."
                );
            } else {
                console.warn(
                    "You might be unauthorized to perform this action."
                );
            }
        }
    };

    const handleAddNewImage = () => {
        navigate(`/trips/${id}/images/`);
    };

    return (
        <Card className={styles.Post}>
            <Card.Title>
                <Container className="d-flex flex-row align-items-center">
                    <h5 className="py-3 w-100">
                        <strong>{title}</strong>
                    </h5>
                    <div>
                        {is_owner && (
                            <MoreDropdown
                                handleEdit={handleEdit}
                                handleDelete={() => handleDelete(id)}
                            />
                        )}
                        {notification && (
                            <Alert
                                variant="success"
                                onClose={() => {
                                    setNotification("");
                                    navigate(0);
                                }}
                                className={mapStyles.MapAlertDelete}
                                dismissible
                            >
                                {notification}
                            </Alert>
                        )}
                    </div>
                </Container>
                <hr className="p-0 m-0" />
            </Card.Title>

            <Card.Body className="d-flex flex-columns">
                <Container>
                    <Row>
                        <div>
                            <strong>Destination:</strong> {place}, {country}
                        </div>
                        <div>
                            <strong>Status:</strong> {trip_status}
                        </div>
                        <div>
                            <strong>Category:</strong> {trip_category}
                        </div>

                        <div>
                            <strong>Dates:</strong> From {start_date} to{" "}
                            {end_date}
                        </div>
                        <br />

                        <div>
                            <p className="p-0 text-start">{content}</p>
                        </div>
                    </Row>

                    <Row>
                        {images.length > 0 ? (
                            <>
                                <h6>Photos</h6>
                                <ImageCarousel images={images} tripId={id} />
                                <Button
                                    className={`${btnStyles.Button} ${btnStyles.Bright} w-25 mx-auto mt-1`}
                                    onClick={handleAddNewImage}
                                    disabled={!is_owner}
                                >
                                    Add Images
                                </Button>
                            </>
                        ) : (
                            <Button
                                className={`${btnStyles.Button} ${btnStyles.Bright} w-25 mx-auto mt-1`}
                                onClick={handleAddNewImage}
                                disabled={!is_owner}
                            >
                                Add Images
                            </Button>
                        )}
                    </Row>
                </Container>
            </Card.Body>
            <hr className="p-0 m-0" />
            <Card.Body>
                <Container>
                    <div className={styles.PostBar}>
                        <i className="far fa-heart" />
                        {total_likes_count}
                    </div>
                    <div className="mx-3 text-muted">
                        {" "}
                        <small>Last updated: {updated_at}</small>
                    </div>
                </Container>
            </Card.Body>
        </Card>
    );
};

export default ProfilePost;
