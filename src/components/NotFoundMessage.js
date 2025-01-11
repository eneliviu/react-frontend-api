import React from "react";
import styles from "../styles/NotFoundMessage.module.css";

const NotFoundMessage = () => {
    return (
        <div className={styles.NotFoundContainer}>
            <p className={styles.Message}>
                Sorry, no trips match the current search filters.
            </p>
        </div>
    );
};

export default NotFoundMessage;
