// // FilterForm.js
// import React from "react";
// import { Form, Button } from "react-bootstrap";
// import styles from "../styles/TripFilterForm.module.css";

// function TripFilterForm({ filterCriteria, setFilterCriteria, onSubmit }) {
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFilterCriteria((prevCriteria) => ({
//             ...prevCriteria,
//             [name]: value,
//         }));
//     };

//     return (
//         <Form
//             onSubmit={(event) => {
//                 event.preventDefault();
//                 onSubmit();
//             }}
//             className={styles.form}
//         >
//             <Form.Group controlId="formCountry">
//                 <Form.Label>Country</Form.Label>
//                 <Form.Control
//                     type="text"
//                     name="country"
//                     value={filterCriteria.country}
//                     onChange={handleChange}
//                     placeholder="Enter country"
//                 />
//             </Form.Group>
//             <Form.Group controlId="formPlace">
//                 <Form.Label>Place</Form.Label>
//                 <Form.Control
//                     type="text"
//                     name="place"
//                     value={filterCriteria.place}
//                     onChange={handleChange}
//                     placeholder="Enter place"
//                 />
//             </Form.Group>
//             <Button
//                 variant="primary"
//                 type="submit"
//                 className={styles.buttonContainer}
//             >
//                 Filter
//             </Button>
//         </Form>
//     );
// }

// export default TripFilterForm;

import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import styles from "../styles/TripFilterForm.module.css";

function TripFilterForm({ filterCriteria, setFilterCriteria, onSubmit }) {
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
      
            <Form
                onSubmit={(event) => {
                    event.preventDefault();
                    onSubmit();
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
                    {/* <Button
                    variant="primary"
                    type="submit"
                    className={styles.buttonContainer}
                >
                    Filter
                </Button> */}
                    <Button
                        variant="secondary"
                        onClick={handleClear}
                        className={styles.ButtonContainer}
                    >
                        Clear
                    </Button>
                </Container>
            </Form>
 
    );
}

export default TripFilterForm;
