// import React, { useRef, useState } from "react";
// import { Form, Button, Alert, Row, Col, Container } from "react-bootstrap";
// import { axiosReq } from "../../api/axiosDefaults";
// import appStyles from "../../App.module.css";
// import btnStyles from "../../styles/Button.module.css";
// import Asset from "../../components/Asset";
// import Upload from "../../assets/upload.png";
// import { useNavigate } from "react-router-dom";

// function ImageUploadForm({ tripId }) {
//     const [errors, setErrors] = useState({});
//     const navigate = useNavigate();
//     const [imageData, setImageData] = useState({
//         owner: "",
//         image_title: "",
//         description: "",
//         image: "",
//         shared: true,
//     });
//     const { owner, image_title, description, image, shared } = imageData;
//     const imageFile = useRef(null);

//     const handleChange = (e) => {
//         const { name, type, value, checked } = e.target;
//         setImageData({
//             ...imageData,
//             [name]: type === "checkbox" ? checked : value,
//         });
//     };

//     const handleImageChange = (event) => {
//         if (event.target.files.length) {
//             URL.revokeObjectURL(image);
//             setImageData({
//                 ...imageData,
//                 image: URL.createObjectURL(event.target.files[0]),
//             });
//             console.log("image URL", event.target.files[0]);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         formData.append("owner", image_title);
//         formData.append("image_title", image_title);
//         formData.append("description", description);
//         formData.append("shared", shared);
//         if (imageFile.current?.files[0]) {
//             formData.append("image", imageFile.current.files[0]);
//         }
//         for (let pair of formData.entries()) {
//             console.log(pair[0] + ", " + pair[1]);
//         }

//         try {
//             const { data } = await axiosReq.post(
//                 `/trips/${tripId}/images/`,
//                 formData
//             );
//             navigate("/"); // Redirect to the trip details page
//             //onFinish(); // Notify parent that image upload is complete
//         } catch (err) {
//             console.error("Failed to upload image:", err);
//              if (err.response) {
//                  setErrors(err.response.data);
//              } else {
//                  console.log("Error", err.message);
//              }
//              alert("An unexpected error occurred during the upload.");
//         }
//     };

//     return (
//         <Form onSubmit={handleSubmit}>
//             <Row>
//                 <Col className="py-2 p-0 p-md-2" md={6} lg={6}>
//                     <Container className={`${appStyles.Content}`}>
//                         <h2>Upload Image</h2>
//                         <Form.Group className="text-center">
//                             {image ? (
//                                 <>
//                                     <figure>
//                                         <img
//                                             src={image}
//                                             alt="preview"
//                                             className="img-fluid"
//                                         />
//                                     </figure>
//                                 </>
//                             ) : (
//                                 <Form.Label
//                                     className="d-flex justify-content-center"
//                                     htmlFor="image-upload"
//                                 >
//                                     <Asset
//                                         src={Upload}
//                                         message="Click or tap to upload an image"
//                                     />
//                                 </Form.Label>
//                             )}
//                             <Form.Control
//                                 id="image-upload"
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={handleImageChange}
//                                 ref={imageFile}
//                             />
//                         </Form.Group>
//                         {errors.image?.map((message, idx) => (
//                             <Alert key={idx} variant="warning">
//                                 {message}
//                             </Alert>
//                         ))}
//                         <Form.Group controlId="image_title">
//                             <Form.Label>Image Title</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 name="image_title"
//                                 value={image_title}
//                                 onChange={handleChange}
//                             />
//                         </Form.Group>
//                         {errors.image_title?.map((message, idx) => (
//                             <Alert key={idx} variant="warning">
//                                 {message}
//                             </Alert>
//                         ))}
//                         <Form.Group controlId="description">
//                             <Form.Label>Description</Form.Label>
//                             <Form.Control
//                                 as="textarea"
//                                 name="description"
//                                 value={description}
//                                 onChange={handleChange}
//                             />
//                         </Form.Group>
//                         {errors.description?.map((message, idx) => (
//                             <Alert key={idx} variant="warning">
//                                 {message}
//                             </Alert>
//                         ))}
//                         <Form.Group controlId="shared">
//                             <Form.Check
//                                 type="checkbox"
//                                 label="Share this image publicly"
//                                 name="shared"
//                                 checked={shared}
//                                 onChange={handleChange}
//                             />
//                         </Form.Group>
//                         <Button
//                             className={`${btnStyles.Button} ${btnStyles.Blue}`}
//                             type="submit"
//                         >
//                             Upload
//                         </Button>
//                     </Container>
//                 </Col>
//             </Row>
//         </Form>
//     );
// }

// export default ImageUploadForm;

// import React, { useState, useRef } from "react";
// import { Form, Button, Alert, Container } from "react-bootstrap";
// import { axiosReq } from "../../api/axiosDefaults";
// import { useParams } from "react-router";

// function ImageUploadForm() {
//     const tripId = 33;

//     console.log("tripId", tripId);

//     const [errors, setErrors] = useState({});
//     const [imageData, setImageData] = useState({
//         trip: "",
//         title: "",
//         description: "",
//         image: "",
//     });
//     const imageFile = useRef(null);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setImageData((prevData) => ({
//             ...prevData,
//             [name]: value,
//         }));
//     };

//     const handleImageChange = (e) => {
//         if (e.target.files.length) {
//             setImageData((prevData) => ({
//                 ...prevData,
//                 image: e.target.files[0],
//             }));
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         formData.append("trip", tripId);
//         formData.append("title", imageData.title);
//         formData.append("description", imageData.description);
//         formData.append("image", imageData.image);

//         try {
//             await axiosReq.post(`/trips/${tripId}/images/`, formData);
//             alert("Image uploaded successfully!");
//             setErrors({});
//         } catch (err) {
//             setErrors(
//                 err.response?.data || { error: "Unexpected error occurred" }
//             );
//         }
//     };

//     return (
//         <Container>
//             <h2>Upload Image to Trip</h2>
//             <Form onSubmit={handleSubmit}>
//                 <Form.Group controlId="title">
//                     <Form.Label>Title</Form.Label>
//                     <Form.Control
//                         type="text"
//                         name="title"
//                         value={imageData.title}
//                         onChange={handleChange}
//                     />
//                 </Form.Group>
//                 <Form.Group controlId="description">
//                     <Form.Label>Description</Form.Label>
//                     <Form.Control
//                         as="textarea"
//                         name="description"
//                         value={imageData.description}
//                         onChange={handleChange}
//                     />
//                 </Form.Group>
//                 <Form.Group controlId="image">
//                     <Form.Label>Image</Form.Label>
//                     <Form.Control
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageChange}
//                         ref={imageFile}
//                     />
//                 </Form.Group>
//                 <Button type="submit">Upload</Button>
//             </Form>
//             {errors && <Alert variant="danger">{errors.error}</Alert>}
//         </Container>
//     );
// }

// export default ImageUploadForm;

import React, { useState, useRef } from "react";
import { Form, Button, Alert, Container } from "react-bootstrap";
import { axiosReq } from "../../api/axiosDefaults";
import { useParams } from "react-router-dom";
// import { useRedirect } from "../../hooks/useRedirect";
import { useNavigate } from "react-router-dom";

function ImageUploadForm() {
    const { tripId } = useParams(); // Get the trip ID from the URL
    //useRedirect("loggedOut");
    //const tripId = 33;
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

    // const handleImageChange = (event) => {
    //     if (event.target.files.length) {
    //         URL.revokeObjectURL(image);
    //         setImageData({
    //             ...imageData,
    //             image: URL.createObjectURL(event.target.files[0]),
    //         });
    //         console.log("image URL", event.target.files[0]);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image_title", title);
        formData.append("description", description);
        formData.append("shared", shared);
        if (imageFile.current?.files[0]) {
            formData.append("image", imageFile.current.files[0]);
        }
        for (let pair of formData.entries()) {
            console.log(pair[0] + ", " + pair[1]);
        }

        try {
            const { data } = await axiosReq.post(
                `/trips/${tripId}/images/`,
                formData
            );
            navigate(`/trips/${tripId}/images/${data.id}`);
            alert("Image uploaded successfully!");
            setErrors({});
        } catch (err) {
            setErrors(
                err.response?.data || { error: "Unexpected error occurred" }
            );
        }
    };

    return (
        <Container>
            <h2>Upload Image to Trip</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={imageData.title}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="description"
                        value={imageData.description}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="image">
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={imageFile}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="shared">
                    <Form.Check
                        type="checkbox"
                        label="Shared"
                        name="shared"
                        checked={imageData.shared}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Button type="submit">Upload</Button>
            </Form>
            {errors.error && <Alert variant="danger">{errors.error}</Alert>}
        </Container>
    );
}

export default ImageUploadForm;
