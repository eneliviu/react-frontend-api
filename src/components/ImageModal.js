import React from "react";
import { Modal } from "react-bootstrap";

const ImageModal = ({ show, onHide, src, imageTitle }) => {
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
            </Modal.Body>
        </Modal>
    );
};

export default ImageModal;
