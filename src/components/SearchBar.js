import React from "react";
import Form from "react-bootstrap/Form";
import styles from "../styles/SearchBar.module.css";

function SearchBar({ query, setQuery }) {
    return (
        <>
            <i className={`fas fa-search ${styles.SearchIcon}`} />
            <Form
                className={styles.SearchBar}
                onSubmit={(event) => event.preventDefault()}
            >
                <Form.Control
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    type="text"
                    placeholder="Search for trips and images"
                    className="mr-sm-2"
                />
            </Form>
        </>
    );

}

export default SearchBar;
