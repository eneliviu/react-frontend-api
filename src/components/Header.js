import React from "react";
import styles from "../styles/Header.module.css"; // Add a CSS module for styling

function Header() {
    return (
        <header className={styles.header}>
            <h2>Welcome to the Travel Search App</h2>
            <p>Find your next adventure by exploring trips and images.</p>
        </header>
    );
}

export default Header;