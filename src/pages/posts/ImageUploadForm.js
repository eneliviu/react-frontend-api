// import React, { useState, useRef } from "react";
// import { Form, Button, Alert, Container } from "react-bootstrap";
// import Col from "react-bootstrap/Col";
// import Row from "react-bootstrap/Row";
// import { axiosReq } from "../../api/axiosDefaults";
// import { useParams } from "react-router-dom";
// import { useRedirect } from "../../hooks/useRedirect";
// import { useNavigate } from "react-router-dom";
// import btnStyles from "../../styles/Button.module.css";
// import styles from "../../styles/SignInUpForm.module.css";

// function ImageUploadForm() {
//     const { tripId } = useParams(); // Get the trip ID from the URL
//     useRedirect("loggedOut");
//     const [errors, setErrors] = useState({});
//     const navigate = useNavigate();
//     const [imageData, setImageData] = useState({
//         image_title: "",
//         description: "",
//         image: "",
//         shared: true,
//     });
//     const { title, description, image, shared } = imageData;

//     const imageFile = useRef(null);

//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setImageData({
//             ...imageData,
//             [name]: type === "checkbox" ? checked : value,
//         });
//     };

//     const handleImageChange = (event) => {
//         if (event.target.files.length) {
//             setImageData((prevData) => ({
//                 ...prevData,
//                 image: event.target.files[0],
//             }));
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         formData.append("image_title", title);
//         formData.append("description", description);
//         formData.append("shared", shared);
//         if (imageFile.current?.files[0]) {
//             formData.append("image", imageFile.current.files[0]);
//         }
//         try {
//             const { data } = await axiosReq.post(
//                 `/trips/${tripId}/images/`,
//                 formData
//             );
//             alert("Image uploaded successfully!");
//             //navigate(`/trips/${tripId}/images/${data.id}`);
//             navigate('/gallery');
//             setErrors({});
//         } catch (err) {
//             setErrors(
//                 err.response?.data || { error: "Unexpected error occurred" }
//             );
//         }
//     };
//     return (
//         <Container className="d-flex justify-content-center align-items-center">
//             <Row
//                 className={`${styles.Row} w-50`}
//                 style={{ maxWidth: "600px", minWidth: "320px" }}
//             >
//                 <Col className="p-0 p-md-2">
//                     <h2 className="text-center">Upload Image</h2>
//                     <Form onSubmit={handleSubmit}>
//                         <Form.Group controlId="title">
//                             <Form.Label>Title</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 name="title"
//                                 value={title}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </Form.Group>
//                         <Form.Group controlId="description">
//                             <Form.Label>Description</Form.Label>
//                             <Form.Control
//                                 as="textarea"
//                                 name="description"
//                                 value={description}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </Form.Group>
//                         <Form.Group controlId="image">
//                             <Form.Label className="d-none">Image</Form.Label>
//                             <Form.Control
//                                 type="file"
//                                 name="image"
//                                 accept="image/*"
//                                 onChange={handleImageChange}
//                                 ref={imageFile}
//                                 style={{ display: "none" }}
//                                 required
//                             />
//                             <Button
//                                 className={`${btnStyles.Button} ${btnStyles.Bright} my-3 d-flex mx-auto`}
//                                 onClick={() => imageFile.current.click()}
//                             >
//                                 Select Image
//                             </Button>
//                             {image && <p>Selected file: {image.name}</p>}
//                             {errors.image?.map((error, idx) => (
//                                 <Alert key={idx} variant="danger">
//                                     {error}
//                                 </Alert>
//                             ))}
//                         </Form.Group>
//                         <Form.Group controlId="shared">
//                             <Form.Check
//                                 type="checkbox"
//                                 label="Shared"
//                                 name="shared"
//                                 checked={shared}
//                                 onChange={handleChange}
//                             />
//                         </Form.Group>
//                         <div className="d-flex justify-content-between">
//                             <Button
//                                 className={`${btnStyles.Button} ${btnStyles.Bright} my-2`}
//                                 type="submit"
//                             >
//                                 Upload Image
//                             </Button>
//                             <Button
//                                 className={`${btnStyles.Button} my-2 ${btnStyles.Blue}`}
//                                 type="submit"
//                                 onClick={() => navigate("/")}
//                             >
//                                 Cancel
//                             </Button>
//                         </div>
//                     </Form>
//                     {errors.error && (
//                         <Alert variant="danger">{errors.error}</Alert>
//                     )}
//                 </Col>
//             </Row>
//         </Container>
//     );
// }

// export default ImageUploadForm;

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

function ImageUploadForm() {
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
    const {
        id,
        owner,
        owner_name,
        trip_id,
        image_title,
        description,
        image,
        shared,
        uploaded_at,
        likes_count,
    } = postData;
    const { tripId } = useParams();

    const [errors, setErrors] = useState({});
    const imageInput = useRef(null);
    const navigate = useNavigate();

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
                image: event.target.files[0], //URL.createObjectURL(),
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

        // for (let pair of formData.entries()) {
        //     console.log(pair[0] + ", " + pair[1]);
        // }

        try {
            await axiosReq.post(`/trips/${tripId}/images/`, formData);
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
        <div className="text-center">
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
                                                    : URL.createObjectURL(image)
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
    );
}

export default ImageUploadForm;
