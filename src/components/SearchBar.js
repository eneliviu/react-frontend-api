import React from "react";
import Form from "react-bootstrap/Form";
import styles from "../styles/SearchBar.module.css";

// function SearchBar({ query, setQuery }) {
//     return (
//         <>
//             <i className={`fas fa-search ${styles.SearchIcon}`} />
//             <Form
//                 className={styles.SearchBar}
//                 onSubmit={(event) => event.preventDefault()}
//             >
//                 <Form.Control
//                     value={query}
//                     onChange={(event) => setQuery(event.target.value)}
//                     type="text"
//                     placeholder="Search"
//                     className="mr-sm-2"
//                 />
//             </Form>
//         </>
//     );

// }

function SearchBar({
    countryQuery,
    setCountryQuery,
    placeQuery,
    setPlaceQuery,
}) {
    return (
        <>
            <i className={`fas fa-search ${styles.SearchIcon}`} />
            <Form
                className={styles.SearchBar}
                onSubmit={(event) => event.preventDefault()}
            >
                <Form.Control
                    value={countryQuery}
                    onChange={(event) => setCountryQuery(event.target.value)}
                    type="text"
                    placeholder="Search by Country"
                    className="mr-sm-2 mb-2"
                />
                <Form.Control
                    value={placeQuery}
                    onChange={(event) => setPlaceQuery(event.target.value)}
                    type="text"
                    placeholder="Search by Place"
                    className="mr-sm-2"
                />
            </Form>
        </>
    );
}
export default SearchBar;
