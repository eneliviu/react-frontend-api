import React, { useState } from "react";
import { Carousel } from "react-bootstrap";
import { MoreDropdown } from "../components/MoreDropdown";
import { useNavigate } from "react-router-dom";
import { axiosReq } from "../api/axiosDefaults";
import ImageModal from "./ImageModal";

const ImageCarousel = ({ images, tripId }) => {
    const navigate = useNavigate();

    const handleImageEdit = async () => {
        navigate(`/trips/${tripId}/images/edit`);
    };

    const handleImageDelete = async (image_id) => {
        try {
            await axiosReq.delete(`/trips/${tripId}/images/${image_id}/`);
            navigate("*");
        } catch (err) {
            console.log(err);
        }
    };

    const [showModal, setShowModal] = useState(false);
    const [modalImage, setModalImage] = useState({ src: "", title: "" });
    const handleImageClick = (image) => {
        setModalImage({ src: image.image, title: image.image_title });
        setShowModal(true);
    };

    return (
        <>
            <Carousel variant="dark" indicators={false}>
                {images.map((image) => (
                    <Carousel.Item
                        key={image.id}
                    >
                        <img
                            className="d-block w-100"
                            src={image.image}
                            alt={image.image_title && "First slide"}
                            style={{
                                objectFit: "contain",
                                height: "200px",
                                width: "100%",
                                marginBottom: "5px",
                                // backgroundColor: "black",
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
                    </Carousel.Item>
                ))}
            </Carousel>
            <ImageModal
                show={showModal}
                onHide={() => setShowModal(false)}
                src={images[0]?.image}
                imageTitle={modalImage.title}
            />
        </>
    );
};

export default ImageCarousel;
