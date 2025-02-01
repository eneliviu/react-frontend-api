import React, { useState } from "react";
import { Form, Button, Alert, Row, Col, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
// import ImageUploadForm from "./ImageUploadForm"; // Import ImageUploadForm
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import styles from "../../styles/SignInUpForm.module.css";
import { NavLink } from "react-router-dom";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useRedirect } from "../../hooks/useRedirect";

function TripCreateForm() {
    useRedirect("loggedOut");
    const currentUser = useCurrentUser();
    const [errors, setErrors] = useState({});
    const [tripId, setTripId] = useState(null);
    const [tripData, setTripData] = useState({
        title: "",
        content: "",
        place: "",
        country: "",
        start_date: "",
        end_date: "",
        trip_category: "Leisure",
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

        for (let pair of formData.entries()) {
            console.log("paris", pair);
            console.log(pair[0] + ", " + pair[1]);
        }

        try {
            const { data } = await axiosReq.post("/trips/", formData);
            console.log("sent data", data);
            setTripId(data.id); // Set the created trip ID
            navigate(`/profiles/${currentUser.profile_id}`); // `profiles/${currentUser.id}/trips/${data.id}`
        } catch (err) {
            console.error("Failed to create trip:", err);
            setErrors(
                err.response?.data || { error: "Unexpected error occurred" }
            );
        }
    };

    return (
        <Row className={styles.Row}>
            <Col className="m-auto p-0 p-md-2" md={5}>
                <Container className={`${appStyles.Content}`}>
                    <h2 className="text-center">Create Trip</h2>
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
                                className={`${btnStyles.Button} ${btnStyles.Bright} ${btnStyles.Blue} `}
                                type="submit"
                            >
                                Create Trip
                            </Button>
                            <div className="d-flex">
                                <NavLink to={`/`}>
                                    <Button
                                        className={`${btnStyles.Button} ${btnStyles.Blue}`}
                                        type="text"
                                    >
                                        Cancel Trip
                                    </Button>
                                </NavLink>
                            </div>
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

export default TripCreateForm;
