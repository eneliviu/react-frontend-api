import React, { useState } from "react";
import { Form, Button, Alert, Row, Col, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
// import ImageUploadForm from "./ImageUploadForm"; // Import ImageUploadForm
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
// import { useRedirect } from "../../contexts/RedirectContext";

function TripCreateForm() {
    //useRedirect("loggedOut");
    const [errors, setErrors] = useState({});
    const [tripId, setTripId] = useState(null); // State to hold created trip ID
    const [tripData, setTripData] = useState({
        title: "",
        content: "",
        place: "",
        country: "",
        start_date: "",
        end_date: "",
        trip_category: "Leisure", // Default category
        trip_status: "Planned", // Default status
        shared: true, // Default status
    });

    const navigate = useNavigate();

    const {
        title,
        content,
        place,
        country,
        start_date,
        end_date,
        trip_category,
        trip_status,
        shared,
    } = tripData;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setTripData((prevData) => ({
            ...prevData,
            //[name]: value,
            [name]: type === "checkbox" ? checked : value,
        }));

        if (name === "start_date" || name === "end_date") {
            const dateErrors = validateDates(value);
            if (Object.keys(dateErrors).length === 0) {
                setErrors((prevErrors) => {
                    const newErrors = { ...prevErrors };
                    delete newErrors.date;
                    return newErrors;
                });
            }
        }
    };

    const validateDates = () => {
        let dateErrors = {};
        const start = new Date(tripData.start_date);
        const end = new Date(tripData.end_date);
        if (start_date && end_date && start > end) {
            dateErrors.date = "Start date must be before end date.";
        }
        return dateErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dateErrors = validateDates();
        if (Object.keys(dateErrors).length > 0) {
            setErrors(dateErrors);
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("place", place);
        formData.append("country", country);
        formData.append("start_date", start_date);
        formData.append("end_date", end_date);
        formData.append("trip_category", trip_category);
        formData.append("trip_status", trip_status);
        formData.append("shared", shared);

        try {
            const { data } = await axiosReq.post("/trips/", formData);
            setTripId(data.id); // Set the created trip ID
            navigate(`/trips/${data.id}`);
        } catch (err) {
            console.error("Failed to create trip:", err);
            if (err.response?.status === 400) {
                setErrors(err.response?.data);
            }
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col className="py-2 p-0 p-md-2" md={6} lg={6}>
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
                        {errors.place?.map((message, idx) => (
                            <Alert key={idx} variant="warning">
                                {message}
                            </Alert>
                        ))}
                        <Form.Group controlId="country">
                            <Form.Label>Country</Form.Label>
                            <Form.Control
                                type="text"
                                name="country"
                                value={country}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        {errors.country?.map((message, idx) => (
                            <Alert key={idx} variant="warning">
                                {message}
                            </Alert>
                        ))}
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
                        {errors.date && (
                            <Alert variant="warning">{errors.date}</Alert>
                        )}
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
                            type="submit"
                        >
                            Create
                        </Button>
                        {errors.non_field_errors?.map((message, idx) => (
                            <Alert key={idx} variant="warning">
                                {message}
                            </Alert>
                        ))}
                    </Container>
                </Col>
                {/* {tripId && (
                    <Col md={6}>
                        <ImageUploadForm
                            tripId={tripId}
                            onFinish={() => setTripId(null)} // Reset state or handle next steps
                        />
                    </Col>
                )} */}
            </Row>
        </Form>
    );
}

export default TripCreateForm;
