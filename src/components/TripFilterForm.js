import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import styles from "../styles/TripFilterForm.module.css";
import btnStyles from "../styles/Button.module.css";

function TripFilterForm({ filterCriteria, setFilterCriteria }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilterCriteria((prevCriteria) => ({
            ...prevCriteria,
            [name]: value,
        }));
    };

    const handleClear = () => {
        setFilterCriteria({
            country: "",
            place: "",
        });
    };

    return (
        <Container className="d-flex flex-column p-2 justify-content-center">
            <div className="d-flex justify-content-center py-md-3 py-lg-0">
                <h4>Filter by:</h4>
            </div>

            <div>
                <Form
                    onSubmit={(event) => {
                        event.preventDefault();
                    }}
                    className={styles.Form}
                >
                    <Form.Group controlId="formCountry">
                        <Form.Label>Country</Form.Label>
                        <Form.Control
                            type="text"
                            name="country"
                            value={filterCriteria.country}
                            onChange={handleChange}
                            placeholder="Enter country"
                        />
                    </Form.Group>
                    <Form.Group controlId="formPlace">
                        <Form.Label>Place</Form.Label>
                        <Form.Control
                            type="text"
                            name="place"
                            value={filterCriteria.place}
                            onChange={handleChange}
                            placeholder="Enter place"
                        />
                    </Form.Group>
                    <Container className="d-flex flex-row justify-content-center">
                        <Button
                            variant="secondary"
                            onClick={handleClear}
                            className={`${btnStyles.Button} ${btnStyles.Bright} ${btnStyles.Wide}`}
                        >
                            Clear
                        </Button>
                    </Container>
                </Form>
            </div>
        </Container>
    );
}

export default TripFilterForm;
