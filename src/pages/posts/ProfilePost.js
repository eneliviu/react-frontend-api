import React from "react";
import styles from "../../styles/Post.module.css";
import { Button, Card, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import ImageCarousel from "../../components/ImageCarousel";
import btnStyles from "../../styles/Button.module.css";

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
        images,
        owner,
    } = props;
    console.log("posfilepostdata", props);

    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === owner;

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

    const handleAddNewImage = () => {
            navigate(`/trips/${id}/images/`);
    };


    const handleImageEdit = () => {
        navigate(`/trips/${id}/images/edit`);
    };

    const handleImageDelete = async () => {
        try {
             await axiosReq.delete(`/trips/${id}/images/${images.id}/`);
            navigate("*");
        } catch (err) {
            console.log(err);
        }
    };


    return (
        <Card className={styles.Post}>
            <Card.Title>
                <Container className="d-flex flex-row align-items-center">
                    <h5 className="py-3 w-100">
                        <strong>{title}</strong>
                    </h5>
                    <div>
                        <MoreDropdown
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                        />
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
                                >
                                    Add Images
                                </Button>
                            </>
                        ) : (
                            <Button
                                className={`${btnStyles.Button} ${btnStyles.Bright} w-25 mx-auto mt-1`}
                                onClick={handleAddNewImage}
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
                        {likes_count}
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
