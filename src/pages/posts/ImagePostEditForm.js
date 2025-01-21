import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Upload from "../../assets/upload.png";
import Asset from "../../components/Asset";

import styles from "../../styles/TripCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import { axiosReq } from "../../api/axiosDefaults";
import { Alert } from "react-bootstrap";
import { useCurrentUser } from "../../contexts/CurrentUserContext";


function ImagePostEditForm() {
    const currentUser = useCurrentUser();
    const [postData, setPostData] = useState({
        id: "",
        owner: "",
        owner_name: "",
        trip_id: "",
        image_title: "",
        description: "",
        image: "",
        shared: true,
        uploaded_at: "",
        likes_count: 0,
    });
    const { id, owner, owner_name, trip_id, image_title, description, image,
        shared,uploaded_at, likes_count } = postData;
    const { tripId } = useParams();

    const [errors, setErrors] = useState({});
    const imageInput = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleMount = async () => {
            try {
                const { data } = await axiosReq.get(`/trips/${tripId}/images/`);
                const { image_title, description, image, shared, id } =
                    data.results[0];
                currentUser
                    ? setPostData({
                          image_title,
                          description,
                          image,
                          shared,
                          id,
                      })
                    : navigate("/");
            } catch (err) {
                console.error("Post fetch failed:", err);
            }
        };

        handleMount();
    }, [navigate, tripId, currentUser]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPostData({
            ...postData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleChangeImage = (event) => {
        if (event.target.files.length) {
            URL.revokeObjectURL(image);
            setPostData({
                ...postData,
                image: event.target.files[0] //URL.createObjectURL(),
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image_title", image_title);
        formData.append("description", description);
        formData.append("shared", shared);
        if (imageInput.current?.files[0]) {
            formData.append("image", imageInput.current.files[0]);
        }
      for (let pair of formData.entries()) {
          console.log(pair[0] + ", " + pair[1]);
      }

        try {
            //console.log(`/trips/${tripId}/images/${id}/`);
            await axiosReq.patch(`/trips/${tripId}/images/${id}/`,
                formData);
            navigate(-1);
            setErrors({});
        } catch (err) {
            console.error("Failed to update post:", err);
            setErrors(
                err.response?.data || { error: "Unexpected error occurred" }
            );
        }
    };

    const textFields = (
        <div >
            <Form.Group controlId="image_title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    name="image_title"
                    value={image_title}
                    onChange={handleChange}
                />
            </Form.Group>
            {errors?.title?.map((message, idx) => (
                <Alert key={idx} variant="warning">
                    {message}
                </Alert>
            ))}
            <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                    as="textarea"
                    name="description"
                    value={description}
                    onChange={handleChange}
                />
            </Form.Group>
            {errors?.description?.map((message, idx) => (
                <Alert key={idx} variant="warning">
                    {message}
                </Alert>
            ))}
            <Form.Group controlId="shared">
                <Form.Check
                    type="checkbox"
                    label="Shared"
                    name="shared"
                    checked={shared}
                    onChange={handleChange}
                />
            </Form.Group>
            <Button
                className={`${btnStyles.Button} ${btnStyles.Blue}`}
                onClick={() => navigate(`/gallery/`)}
            >
                Cancel
            </Button>
            <Button
                className={`${btnStyles.Button} ${btnStyles.Blue}`}
                type="submit"
            >
                Save
            </Button>
        </div>
    );

    return (
        <div className={`${styles.Div} text-center`}>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
                        <Container
                            className={`${appStyles.Content}
                        ${styles.Container} d-flex flex-column justify-content-center`}
                        >
                            <Form.Group className="text-center">
                                {image ? (
                                    <>
                                        <figure>
                                            <Image
                                                className={styles.ImagePreview}
                                                src={
                                                    typeof image === "string"
                                                        ? image
                                                        : URL.createObjectURL(
                                                              image
                                                          )
                                                }
                                                rounded
                                            />
                                        </figure>

                                        <div>
                                            <Form.Label
                                                className={`${btnStyles.Button} ${btnStyles.Blue} btn`}
                                                htmlFor="image-upload"
                                            >
                                                Change the image
                                            </Form.Label>
                                        </div>
                                    </>
                                ) : (
                                    <Form.Label
                                        className="d-flex justify-content-center"
                                        htmlFor="image-upload"
                                    >
                                        <Asset
                                            src={Upload}
                                            message="Click or tap to upload an image"
                                        />
                                    </Form.Label>
                                )}

                                <Form.Control
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleChangeImage}
                                    ref={imageInput}
                                />
                            </Form.Group>
                            {errors?.image?.map((message, idx) => (
                                <Alert key={idx} variant="warning">
                                    {message}
                                </Alert>
                            ))}
                            <div className="d-md-none">{textFields}</div>
                        </Container>
                    </Col>
                    <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
                        <Container className={appStyles.Content}>
                            {textFields}
                        </Container>
                    </Col>
                </Row>
            </Form>
        </div>
    );

}

export default ImagePostEditForm;
