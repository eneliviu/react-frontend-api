import React, { useRef, useState } from "react";
import { Form, Button, Alert, Row, Col, Container } from "react-bootstrap";
import { axiosReq } from "../../api/axiosDefaults";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import Asset from "../../components/Asset";
import Upload from "../../assets/upload.png";

function ImageUploadForm({ tripId, onFinish }) {
    const [errors, setErrors] = useState({});
    const [imageData, setImageData] = useState({
        image_title: "",
        description: "",
        image: "",
        shared: true, // Default value for shared
    });
    const { image_title, description, image, shared } = imageData;
    const imageInput = useRef(null);

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setImageData({
            ...imageData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleFileChange = (event) => {
        if (event.target.files.length) {
            URL.revokeObjectURL(image);
            setImageData({
                ...imageData,
                image: URL.createObjectURL(event.target.files[0]),
            });
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image_title", image_title);
        formData.append("description", description);
        formData.append("shared", shared);
        formData.append("trip_id", tripId);
        if (imageInput.current?.files[0]) {
            formData.append("image", imageInput.current.files[0]);
        }

        try {
            await axiosReq.post(`/trips/${tripId}/images/`, formData);
            onFinish(); // Notify parent that image upload is complete
        } catch (err) {
            console.error("Failed to upload image:", err);
            if (err.response?.status !== 401) {
                setErrors(err.response?.data);
            }
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col className="py-2 p-0 p-md-2" md={8} lg={6}>
                    <Container className={`${appStyles.Content}`}>
                        <h2>Upload Image</h2>
                        <Form.Group className="text-center">
                            {image ? (
                                <>
                                    <figure>
                                        <img
                                            src={image}
                                            alt="preview"
                                            className="img-fluid"
                                        />
                                    </figure>
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
                                onChange={handleFileChange}
                                ref={imageInput}
                            />
                        </Form.Group>
                        {errors.image?.map((message, idx) => (
                            <Alert key={idx} variant="warning">
                                {message}
                            </Alert>
                        ))}
                        <Form.Group controlId="image_title">
                            <Form.Label>Image Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="image_title"
                                value={image_title}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        {errors.image_title?.map((message, idx) => (
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
                        {errors.description?.map((message, idx) => (
                            <Alert key={idx} variant="warning">
                                {message}
                            </Alert>
                        ))}
                        <Form.Group controlId="shared">
                            <Form.Check
                                type="checkbox"
                                label="Share this image publicly"
                                name="shared"
                                checked={shared}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Button
                            className={`${btnStyles.Button} ${btnStyles.Blue}`}
                            type="submit"
                        >
                            Upload
                        </Button>
                    </Container>
                </Col>
            </Row>
        </Form>
    );
}

export default ImageUploadForm;
