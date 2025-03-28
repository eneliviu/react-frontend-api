import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";

import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { useRedirect } from "../../hooks/useRedirect";

function SignInForm() {
    const setCurrentUser = useSetCurrentUser();
    useRedirect("loggedIn");

    const [signInData, setSignInData] = useState({
        username: "",
        password: "",
    });
    const { username, password } = signInData;
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setSignInData({
            ...signInData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const tokenUser = await axios.post("/api-auth/token/", {
                username,
                password,
            });
            const { access, refresh } = tokenUser.data;
            localStorage.setItem("access_token", access);
            localStorage.setItem("refresh_token", refresh);

            const userResponse = await axios.get("/dj-rest-auth/user/", {
                headers: {
                    Authorization: `Bearer ${access}`,
                },
            });
            setCurrentUser(userResponse.data);
            navigate("/");
        } catch (err) {
            console.error("Error during form submission:", err);
            if (err.response) {

                if (err.response.status === 401) {
                    setErrors({
                        non_field_errors: [
                            err.response.data.detail || "Invalid credentials.",
                        ],
                    });
                } else {

                    setErrors(err.response.data);
                }
            } else {

                setErrors({
                    non_field_errors: [
                        "An unexpected error occurred. Please try again.",
                    ],
                });
            }
        }
    };

    return (
        <Row className={styles.Row}>
            <Col className="my-auto p-0 p-md-2" md={6}>
                <Container className={`${appStyles.Content} p-4`}>
                    <h1 className={styles.Header}>Sign In</h1>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label className="d-none">Username</Form.Label>
                            <Form.Control
                                className={styles.Input}
                                type="text"
                                placeholder="Username"
                                name="username"
                                value={username}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        {errors.username &&
                            errors.username.map((message, idx) => (
                                <Alert variant="warning" key={idx}>
                                    {message}
                                </Alert>
                            ))}

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label className="d-none">Password</Form.Label>
                            <Form.Control
                                className={styles.Input}
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={password}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        {errors.password &&
                            errors.password.map((message, idx) => (
                                <Alert variant="warning" key={idx}>
                                    {message}
                                </Alert>
                            ))}

                        <Button
                            className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`}
                            type="submit"
                        >
                            Sign In
                        </Button>

                        {errors.non_field_errors &&
                            errors.non_field_errors.map((message, idx) => (
                                <Alert
                                    key={idx}
                                    variant="danger"
                                    className="mt-3"
                                >
                                    {message}
                                </Alert>
                            ))}
                    </Form>
                </Container>
            </Col>
            <Col
                md={6}
                className={`my-auto d-none d-md-block p-2 ${styles.SignInCol}`}
            >
                <Image
                    className={`${appStyles.FillerImage}`}
                    src={
                        "https://res.cloudinary.com/dchoskzxj/image/upload/v1735823748/ktwva7tj7yinkuolexbx.webp"
                    }
                />
            </Col>
        </Row>
    );
}

export default SignInForm;

