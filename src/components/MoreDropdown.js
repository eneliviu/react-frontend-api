import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import styles from "../styles/MoreDropdown.module.css";
import { useNavigate } from "react-router-dom";
import { axiosReq } from "../api/axiosDefaults";
import { useSetCurrentUser } from "../contexts/CurrentUserContext";
import { useRedirect } from "../hooks/useRedirect";



const ThreeDotsToggle = React.forwardRef(({ onClick }, ref) => (
    <div
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
        aria-label="More options"
        role="button"
        tabIndex="0"
        style={{ cursor: "pointer" }}
    >
        <i className="fa fa-ellipsis-v"></i>
    </div>
));


export const MoreDropdown = ({ handleEdit, handleDelete }) => {
    return (
        <Dropdown className="ml-auto">
            <Dropdown.Toggle
                as={ThreeDotsToggle}
                id="dropdown-custom-components"
            />

            <Dropdown.Menu
                className="text-center"
                popperConfig={{ strategy: "absolute" }}
            >
                <Dropdown.Item
                    className={styles.DropdownItem}
                    onClick={handleEdit}
                    aria-label="edit"
                >
                    <i className="fas fa-edit" />
                </Dropdown.Item>

                <Dropdown.Item
                    className={styles.DropdownItem}
                    onClick={handleDelete}
                    aria-label="delete"
                >
                    <i className="fas fa-trash-alt" />
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};


export function ProfileEditDropdown({ id }) {
    useRedirect("loggedOut");
    const navigate = useNavigate();
    const setCurrentUser = useSetCurrentUser();

    const handleDeleteProfile = async () => {
        if (
            !window.confirm(
                "Are you sure you want to delete this profile? The action is irreversible."
            )
        ) {
            return;
        }
        try {

            await axiosReq.delete(`/profiles/${id}/`);

            setCurrentUser(null);
            localStorage.removeItem("authToken");
            localStorage.removeItem("refreshToken");

            window.alert("Profile deleted successfully.");

            window.location.href = "/signup?reload=" + new Date().getTime();

        } catch (error) {
            console.error("Error deleting profile:", error);
        }
    };

    return (
        <>
            <Dropdown className={`ml-auto px-3 ${styles.Absolute}`} drop="left">
                <Dropdown.Toggle as={ThreeDotsToggle} />
                <Dropdown.Menu>
                    <Dropdown.Item
                        onClick={() => navigate(`/profiles/${id}/edit`)}
                        aria-label="edit-profile"
                    >
                        <i className="fas fa-edit" /> edit profile
                    </Dropdown.Item>
                    <Dropdown.Item
                        onClick={() =>
                            navigate(`/profiles/${id}/edit/username`)
                        }
                        aria-label="edit-username"
                    >
                        <i className="far fa-id-card" />
                        change username
                    </Dropdown.Item>
                    <Dropdown.Item
                        onClick={() =>
                            navigate(`/profiles/${id}/edit/password`)
                        }
                        aria-label="edit-password"
                    >
                        <i className="fas fa-key" />
                        change password
                    </Dropdown.Item>
                    <Dropdown.Item
                        onClick={handleDeleteProfile}
                        aria-label="delete"
                    >
                        <i className="fas fa-trash-alt" />
                        delete profile
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
}
