import React, { useState } from "react";
import { Carousel } from "react-bootstrap";
import { MoreDropdown } from "../components/MoreDropdown";
import styles from "../styles/ImageCarousel.module.css";
import { useNavigate } from "react-router-dom";
import { axiosReq } from "../api/axiosDefaults";
import ImageModal from "./ImageModal";

const ImageCarousel = ({ images, tripId }) => {
    const navigate = useNavigate();

    const handleImageEdit = () => {
        navigate(`/trips/${tripId}/images/edit`);
    };

    const handleImageDelete = async () => {
        try {
            await axiosReq.delete(`/trips/${tripId}/images/${images.id}/`);
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
            <Carousel>
                {images.map((image) => (
                    <Carousel.Item
                        key={image.id}
                        className={`${styles.CarouselIndicators} position-relative`}
                    >
                        <img
                            className="d-block w-100"
                            src={image.image}
                            alt={image.image_title}
                            style={{
                                objectFit: "contain",
                                height: "200px",
                                width: "100%",
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

// <Carousel className={styles.Carousel}>
//     {images.map((image) => (
//         <Carousel.Item key={image.id}>
//             <img
//                 className="d-block w-100"
//                 src={image.image}
//                 alt={image.image_title}
//                 style={{
//                     height: "400px",
//                     objectFit: "cover",
//                 }}
//             />
//             {/* Add any other components here like captions */}
//         </Carousel.Item>
//     ))}
// </Carousel>
