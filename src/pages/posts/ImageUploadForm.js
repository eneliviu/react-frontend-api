import React, { useState, useRef } from "react";
import { Form, Button, Alert, Container } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { axiosReq } from "../../api/axiosDefaults";
import { useParams } from "react-router-dom";
// import { useRedirect } from "../../hooks/useRedirect";
import { useNavigate } from "react-router-dom";
import btnStyles from "../../styles/Button.module.css";
import styles from "../../styles/SignInUpForm.module.css";

function ImageUploadForm() {
    const { tripId } = useParams(); // Get the trip ID from the URL
    //useRedirect("loggedOut");
    console.log("tripId", tripId);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [imageData, setImageData] = useState({
        image_title: "",
        description: "",
        image: "",
        shared: true,
    });
    const { title, description, image, shared } = imageData;
    console.log("imageData upload", imageData);

    const imageFile = useRef(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setImageData({
            ...imageData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleImageChange = (event) => {
        if (event.target.files.length) {
            setImageData((prevData) => ({
                ...prevData,
                image: event.target.files[0],
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image_title", title);
        formData.append("description", description);
        formData.append("shared", shared);
        if (imageFile.current?.files[0]) {
            formData.append("image", imageFile.current.files[0]);
        }
        try {
            const { data } = await axiosReq.post(
                `/trips/${tripId}/images/`,
                formData
            );
            alert("Image uploaded successfully!");
            //navigate(`/trips/${tripId}/images/${data.id}`);
            navigate('/gallery');
            setErrors({});
        } catch (err) {
            setErrors(
                err.response?.data || { error: "Unexpected error occurred" }
            );
        }
    };
    return (
        <Container className="d-flex justify-content-center align-items-center">
            <Row className={styles.Row}>
                <Col className="p-0 p-md-2">
                    <h2 className="text-center">Upload Image</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={title}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={description}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="image">
                            <Form.Label className="d-none">Image</Form.Label>
                            <Form.Control
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                ref={imageFile}
                                style={{ display: "none" }}
                                required
                            />
                            <Button
                                className={`${btnStyles.Button} my-3`}
                                onClick={() => imageFile.current.click()}
                            >
                                Select Image
                            </Button>
                            {image && <p>Selected file: {image.name}</p>}
                            {errors.image?.map((error, idx) => (
                                <Alert key={idx} variant="danger">
                                    {error}
                                </Alert>
                            ))}
                        </Form.Group>
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
                            className={`${btnStyles.Button} ${btnStyles.Bright} my-2`}
                            type="submit"
                        >
                            Upload Image
                        </Button>
                    </Form>
                    {errors.error && (
                        <Alert variant="danger">{errors.error}</Alert>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default ImageUploadForm;

