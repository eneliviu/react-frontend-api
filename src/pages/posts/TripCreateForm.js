import React, { useState } from "react";
import { Form, Button, Alert, Row, Col, Container } from "react-bootstrap";
import { axiosReq } from "../../api/axiosDefaults";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

function TripCreateForm({ onTripCreated }) {
    const [errors, setErrors] = useState({});
    const [tripData, setTripData] = useState({
        title: "",
        content: "",
        place: "",
        country: "",
        start_date: "",
        end_date: "",
        trip_category: "Leisure", // Default value
        trip_status: "Planned", // Default value
    });
    const {
        title,
        content,
        place,
        country,
        start_date,
        end_date,
        trip_category,
        trip_status,
    } = tripData;

    const handleChange = (e) => {
        setTripData({
            ...tripData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("place", place);
        formData.append("country", country);
        formData.append("start_date", start_date);
        formData.append("end_date", end_date);
        formData.append("trip_category", trip_category);
        formData.append("trip_status", trip_status);

        try {
            const { data } = await axiosReq.post("/trips/", formData);
            onTripCreated(data.id); // Notify parent that the trip is created
        } catch (err) {
            console.error("Failed to create trip:", err);
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
                        <h2>Create Trip</h2>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={title}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        {errors.title?.map((message, idx) => (
                            <Alert key={idx} variant="warning">
                                {message}
                            </Alert>
                        ))}
                        <Form.Group controlId="content">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="content"
                                value={content}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        {errors.content?.map((message, idx) => (
                            <Alert key={idx} variant="warning">
                                {message}
                            </Alert>
                        ))}
                        <Form.Group controlId="place">
                            <Form.Label>Place</Form.Label>
                            <Form.Control
                                type="text"
                                name="place"
                                value={place}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="country">
                            <Form.Label>Country</Form.Label>
                            <Form.Control
                                type="text"
                                name="country"
                                value={country}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="start_date">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="start_date"
                                value={start_date}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="end_date">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="end_date"
                                value={end_date}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="trip_category">
                            <Form.Label>Trip Category</Form.Label>
                            <Form.Control
                                as="select"
                                name="trip_category"
                                value={trip_category}
                                onChange={handleChange}
                            >
                                <option value="Leisure">Leisure</option>
                                <option value="Business">Business</option>
                                <option value="Adventure">Adventure</option>
                                <option value="Family">Family</option>
                                <option value="Romantic">Romantic</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="trip_status">
                            <Form.Label>Trip Status</Form.Label>
                            <Form.Control
                                as="select"
                                name="trip_status"
                                value={trip_status}
                                onChange={handleChange}
                            >
                                <option value="Planned">Planned</option>
                                <option value="Ongoing">Ongoing</option>
                                <option value="Completed">Completed</option>
                            </Form.Control>
                        </Form.Group>
                        <Button
                            className={`${btnStyles.Button} ${btnStyles.Blue}`}
                            type="submit"
                        >
                            Create
                        </Button>
                    </Container>
                </Col>
            </Row>
        </Form>
    );
}

export default TripCreateForm;
