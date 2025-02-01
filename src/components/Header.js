import React from "react";
import styles from "../styles/Header.module.css"; // Add a CSS module for styling
import { useCurrentUser } from "../contexts/CurrentUserContext";

function Header() {
    const currentUser = useCurrentUser();
    const isAuthenticated = !!currentUser;

    return (
        <header className={styles.header}>
            {isAuthenticated ? (
                <>
                    <h1>
                        Welcome, <strong>{currentUser.username}</strong>!
                    </h1>
                    <p>
                        Find your next adventure by exploring trips and images.
                    </p>
                </>
            ) : (
                <>
                    <h1>
                        Welcome to the <span>LovingEscapades</span> App!
                    </h1>
                    <p>
                        Find your next adventure by exploring trips and images.
                    </p>
                </>
            )}
        </header>
    );
}

export default Header;