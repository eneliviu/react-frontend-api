import React from "react";
import { Modal } from "react-bootstrap";

const ImageModal = ({
    show,
    onHide,
    src,
    imageTitle,
    imageContent,
    uploadedAt,
}) => {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{imageTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <img
                    src={src}
                    alt={imageTitle}
                    className="img-fluid"
                    style={{
                        height: "auto",
                        width: "100%",
                    }}
                />
                <p className="my-2">{imageContent}</p>
            </Modal.Body>
            <Modal.Footer className="text-muted">
                <small>Uploaded at: {uploadedAt}</small>
            </Modal.Footer>
        </Modal>
    );
};

export default ImageModal;
