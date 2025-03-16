import React, { useState } from "react";
import TripCreateForm from "./TripCreateForm";
import ImageUploadForm from "./ImageUploadForm";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";

function TripWithImageCreate() {
    const [tripCreatedId, setTripCreatedId] = useState(null);
    const navigate = useNavigate();

    const handleTripCreated = (id) => {
        setTripCreatedId(id);
    };

    const skipImageUpload = () => {
        if (tripCreatedId) {
            navigate(`/trips/${tripCreatedId}`);
        }
    };

    return (
        <div>
            <TripCreateForm onTripCreated={handleTripCreated} />
            <Button onClick={skipImageUpload}>Skip Image Upload ?</Button>
            {tripCreatedId && (
                <ImageUploadForm
                    tripId={tripCreatedId}
                    onFinish={() => navigate(`/trips/${tripCreatedId}`)}
                />
            )}
        </div>
    );
}

export default TripWithImageCreate;
