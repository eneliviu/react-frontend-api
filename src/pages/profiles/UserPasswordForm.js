import React, { useEffect, useState } from "react";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

import { useNavigate, useParams } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import {
    useCurrentUser,
    useSetCurrentUser,
} from "../../contexts/CurrentUserContext";

import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

const UserPasswordForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const currentUser = useCurrentUser();
    const setCurrentUser = useSetCurrentUser();

    const [userData, setUserData] = useState({
        new_password1: "",
        new_password2: "",
    });
    const { new_password1, new_password2 } = userData;

    const [errors, setErrors] = useState({});

    const [notification, setNotification] = useState("");

    const handleChange = (event) => {
        setUserData({
            ...userData,
            [event.target.name]: event.target.value,
        });
    };

    useEffect(() => {
        if (currentUser?.profile_id?.toString() !== id) {
            navigate("/");
        }
    }, [currentUser, navigate, id]);

    const handleLogout = async () => {
        try {
            await axiosRes.post("/dj-rest-auth/logout/");
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            setCurrentUser(null);
            navigate("/signin");
        } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axiosRes.post("/dj-rest-auth/password/change/", userData);
            setNotification(
                "Password changed successfully. Close to logout."
            );
        } catch (err) {
            console.log(err);
            setErrors(err.response?.data);
        }
    };

    return (
        <Row className={appStyles.StandardContainer}>
            <Col className="py-2 mx-auto text-center h-100" md={6}>
                <Container className={appStyles.Content}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>New password</Form.Label>
                            <Form.Control
                                placeholder="new password"
                                type="password"
                                value={new_password1}
                                onChange={handleChange}
                                name="new_password1"
                            />
                        </Form.Group>
                        {errors?.new_password1?.map((message, idx) => (
                            <Alert key={idx} variant="warning">
                                {message}
                            </Alert>
                        ))}
                        <Form.Group>
                            <Form.Label>Confirm password</Form.Label>
                            <Form.Control
                                placeholder="confirm new password"
                                type="password"
                                value={new_password2}
                                onChange={handleChange}
                                name="new_password2"
                            />
                        </Form.Group>
                        {errors?.new_password2?.map((message, idx) => (
                            <Alert key={idx} variant="warning">
                                {message}
                            </Alert>
                        ))}
                        {notification && (
                            <Alert
                                variant="success"
                                dismissible
                                onClose={() => {
                                    setNotification(null);
                                    handleLogout();
                                }}
                            >
                                {notification}
                            </Alert>
                        )}

                        <Button
                            className={`${btnStyles.Button} ${btnStyles.Blue}`}
                            onClick={() => {
                                setNotification(null);
                                setErrors({});
                                navigate(-1);
                            }}
                        >
                            cancel
                        </Button>
                        <Button
                            type="submit"
                            className={`${btnStyles.Button} ${btnStyles.Blue}`}
                        >
                            save
                        </Button>
                    </Form>
                </Container>
            </Col>
        </Row>
    );
};

export default UserPasswordForm;
