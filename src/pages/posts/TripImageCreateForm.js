import React, { useState } from "react";
import TripCreateForm from "./TripCreateForm";
import ImageUploadForm from "./ImageUploadForm";
import { useNavigate } from "react-router-dom";
import Button  from "react-bootstrap/Button";

function TripWithImageCreate() {
    const [tripCreatedId, setTripCreatedId] = useState(null); // To track the created trip
    const navigate = useNavigate();

    // Function called after a trip is created to show image upload option
    const handleTripCreated = (id) => {
        setTripCreatedId(id); // Store the created trip ID
    };

    const skipImageUpload = () => {
        if (tripCreatedId) {
            navigate(`/trips/${tripCreatedId}`); // Navigate to trip details page
        }
    };

    return (
        <div>
            <TripCreateForm onTripCreated={handleTripCreated} />
            <Button onClick={skipImageUpload}>Skip Image Upload ?</Button>
            {tripCreatedId && (
                <>
                    <ImageUploadForm
                        tripId={tripCreatedId}
                        onFinish={() => navigate(`/trips/${tripCreatedId}`)}
                    />
                </>
            )}
        </div>
    );
}

export default TripWithImageCreate;
