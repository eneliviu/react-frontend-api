import React, { useState } from "react";
import { Carousel, OverlayTrigger, Tooltip } from "react-bootstrap";
import { MoreDropdown } from "../components/MoreDropdown";
import { useNavigate } from "react-router-dom";
import { axiosReq } from "../api/axiosDefaults";
import ImageModal from "./ImageModal";
import Alert from "react-bootstrap/Alert";

const ImageCarousel = ({ images, tripId }) => {
    const navigate = useNavigate();
    const [notification, setNotification] = useState("");
    const [errors, setErrors] = useState({});

    const handleImageEdit = async (image_id) => {
        navigate(`/trips/${tripId}/images/edit/${image_id}/`);
    };

    const handleImageDelete = async (image_id) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this image? The action is irreversible."
            )
        ) {
            return;
        }

        try {
            await axiosReq.delete(`/trips/${tripId}/images/${image_id}/`);
            setNotification("Image deleted successfully. Close to refresh.");
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

    const [showModal, setShowModal] = useState(false);
    const [modalImage, setModalImage] = useState({
        src: "",
        title: "",
        content: "",
        uploaded_at: "",
    });

    const handleImageClick = (image) => {
        setModalImage({
            src: image.image,
            title: image.image_title,
            content: image.description,
            uploaded_at: image.uploaded_at,
        });
        setShowModal(true);
    };

    return (
        <>
            <Carousel variant="dark" indicators={false} interval={null}>
                {images.map((image) => (
                    <Carousel.Item key={image.id}>
                        <img
                            className="d-block w-100"
                            src={image.image}
                            alt={image.image_title}
                            style={{
                                objectFit: "contain",
                                height: "200px",
                                width: "100%",
                                marginBottom: "5px",
                                cursor: "pointer",
                            }}
                            onClick={() => handleImageClick(image)}
                        />
                        <MoreDropdown
                            handleEdit={() => handleImageEdit(image.id)}
                            handleDelete={() => handleImageDelete(image.id)}
                            className="position-absolute"
                            style={{
                                top: "10px",
                                right: "10px",
                            }}
                        />
                        {notification && (
                            <Alert
                                variant="success"
                                onClose={() => {
                                    setNotification("");
                                    navigate(0);
                                }}
                                dismissible
                            >
                                {notification}
                            </Alert>
                        )}
                    </Carousel.Item>
                ))}
            </Carousel>
            {errors?.content?.map((message, idx) => (
                <Alert key={idx} variant="warning">
                    {message}
                </Alert>
            ))}
            <ImageModal
                show={showModal}
                onHide={() => setShowModal(false)}
                src={modalImage.src}
                imageTitle={modalImage.title}
                imageContent={modalImage.content}
                uploadedAt={modalImage.uploaded_at}
            />
        </>
    );
};

export default ImageCarousel;