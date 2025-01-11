import React, { useState } from "react";
import TripFilterForm from "./TripFilterForm";
import MapLeaflet from "./MapLeaflet";

const SearchPage = () => {
    const [filterCriteria, setFilterCriteria] = useState({
        country: "",
        place: "",
    });

    const handleSubmit = () => {
        // Optional: Perform operations when filters are applied
    };

    return (
        <div>
            <TripFilterForm
                filterCriteria={filterCriteria}
                setFilterCriteria={setFilterCriteria}
                onSubmit={handleSubmit}
            />
            <MapLeaflet
                countryQuery={filterCriteria.country}
                placeQuery={filterCriteria.place}
            />
        </div>
    );
};

export default SearchPage;
