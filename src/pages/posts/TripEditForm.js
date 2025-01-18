import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Alert, Row, Col, Container } from "react-bootstrap";
import { axiosReq } from "../../api/axiosDefaults";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import styles from "../../styles/SignInUpForm.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

function TripEditForm() {
    const currentUser = useCurrentUser();
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [tripData, setTripData] = useState({
        title: "",
        content: "",
        place: "",
        country: "",
        start_date: "",
        end_date: "",
        trip_category: "Leisure",
        trip_status: "Planned",
        shared: true,
    });
    console.log("id", tripId);
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

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const { data } = await axiosReq.get(`/trips/${tripId}/`);
                setTripData({
                    title: data.title,
                    content: data.content,
                    place: data.place,
                    country: data.country,
                    start_date: data.start_date,
                    end_date: data.end_date,
                    trip_category: data.trip_category,
                    trip_status: data.trip_status,
                    shared: data.shared,
                });
            } catch (err) {
                console.error("Error fetching trip", err);
                setErrors(
                    err.response?.data || { error: "Could not load trip data" }
                );
            }
        };

        fetchTrip();
    }, [tripId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setTripData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
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
        formData.append("shared", shared);

        try {
            await axiosReq.patch(`/trips/${tripId}/`, formData);
            navigate(`/trips/${tripId}`);
            setErrors({});
        } catch (err) {
            console.error("Failed to update trip:", err);
            setErrors(err.response?.data || { error: "Failed to update trip" });
        }
    };

    return (
        <Row className={styles.Row}>
            <Col className="m-auto p-0 p-md-2" md={5}>
                <Container className={`${appStyles.Content}`}>
                    <h2 className="text-center">Edit Trip</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={title}
                                onChange={handleChange}
                                required
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
                                required
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
                                required
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
                                required
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
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="end_date">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="end_date"
                                value={end_date}
                                onChange={handleChange}
                                required
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
                                required
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
                                required
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
                                onChange={(e) =>
                                    setTripData({
                                        ...tripData,
                                        shared: e.target.checked,
                                    })
                                }
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-around">
                            <Button
                                className={`${btnStyles.Button} ${btnStyles.Bright} ${btnStyles.Blue}`}
                                type="submit"
                            >
                                Update Trip
                            </Button>
                            <Button
                                className={`${btnStyles.Button} ${btnStyles.Blue}`}
                                type="button"
                                onClick={() => navigate(`/trips/${tripId}`)}
                            >
                                Cancel
                            </Button>
                        </div>
                        {errors.non_field_errors?.map((message, idx) => (
                            <Alert key={idx} variant="warning">
                                {message}
                            </Alert>
                        ))}
                    </Form>
                </Container>
            </Col>
        </Row>
    );
}

export default TripEditForm;