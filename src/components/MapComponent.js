import React, { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { axiosReq } from "../api/axiosDefaults";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import TripPopup from "./TripPopUp";
import styles from "../styles/MapComponent.module.css";

// Standard fix for default marker icon not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const MapComponent = ({ countryQuery, placeQuery }) => {
    const currentUser = useCurrentUser();
    const isAuthenticated = !!currentUser;
    const [errors, setErrors] = useState({});
    const [markers, setMarkers] = useState([]);
    const [showNotFound, setShowNotFound] = useState(false);
    const [showNoMarkers, setShowNoMarkers] = useState(false);
    const [notification, setNotification] = useState("");
    const [, setTrips] = useState([]);
    const mapRef = useRef(null);
    const defaultPosition = [51.505, -0.09];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axiosReq("/public/");
                const markerData = data.results.map((result) => ({
                    id: result.id,
                    profile_id: result.profile_id,
                    owner: result.owner,
                    position: [result.lat, result.lon],
                    country: result.country || "",
                    place: result.place || "",
                    content: result.content,
                    from: result.start_date,
                    to: result.end_date,
                    status: result.trip_status,
                    category: result.trip_category,
                    latestImageUrl:
                        result.images.length > 0
                            ?
                              result.images[0].image
                            : "",
                }));
                setMarkers(markerData);
            } catch (err) {
                console.error("Failed to fetch data:", err);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (markers.length === 0) {
            setShowNoMarkers(true);
        } else {
            setTrips(markers.results);
            setShowNoMarkers(false);
        }
    }, [markers]);

    const filteredMarkers = markers.filter(
        (marker) =>
            marker.country.toLowerCase().includes(countryQuery.toLowerCase()) &&
            marker.place.toLowerCase().includes(placeQuery.toLowerCase())
    );

    useEffect(() => {
        setShowNotFound(
            filteredMarkers.length === 0 && (countryQuery || placeQuery)
        );
    }, [filteredMarkers, countryQuery, placeQuery]);

    const ZoomToMarkers = ({ markers }) => {
        const map = useMap();

        useEffect(() => {
            if (markers.length > 0) {
                const bounds = markers.map((marker) => marker.position);
                map.fitBounds(bounds);
            }
        }, [markers, map]);

        return null;
    };

    const handleDelete = async (tripId) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this trip? The action is irreversible."
            )
        ) {
            return;
        }
        try {
            await axiosReq.delete(`/trips/${tripId}/`);
            setTrips((trips) =>
                (trips || []).filter((trip) => trip.id !== tripId)
            );
            setMarkers((prevMarkers) =>
                prevMarkers.filter((marker) => marker.id !== tripId)
            );
            setNotification("Trip deleted successfully.");
        } catch (err) {
            setErrors(
                err.response?.data || { error: "Unexpected error occurred" }
            );
            setNotification("Failed to delete the trip. Please try again.");
        }
    };

    const handleImageUpload = async (tripId) => {
        try {
            const { data } = await axiosReq.get(`/trips/${tripId}/images/`);
            const latestImageUrl = data.results[0]?.image || "";
            setTrips((prevTrips) =>
                prevTrips.map((trip) =>
                    trip.id === tripId ? { ...trip, latestImageUrl } : trip
                )
            );
        } catch (err) {
            console.error("Failed to fetch latest image:", err);
        }
    };

    return (
        <Container className={styles.MapContainer}>
            <Row>
                <Col
                    className="py-0 p-0 p-lg-2 h-100"
                    style={{ position: "relative" }}
                >
                    {showNotFound && (
                        <Alert
                            variant="warning"
                            onClose={() => setShowNotFound(false)}
                            className={styles.MapAlert}
                            dismissible
                        >
                            Sorry, no trips match your current search filters.
                        </Alert>
                    )}

                    {showNoMarkers && (
                        <Alert
                            variant="info"
                            dismissible
                            onClose={() => setShowNoMarkers(false)}
                            className={styles.MapAlert}
                        >
                            There are no trips to display.
                        </Alert>
                    )}

                    {notification && (
                        <Alert
                            variant="success"
                            onClose={() => setNotification("")}
                            className={styles.MapAlertDelete}
                            dismissible
                        >
                            {notification}
                        </Alert>
                    )}

                    <MapContainer
                        className={styles.MapWrapper}
                        ref={mapRef}
                        center={defaultPosition}
                        zoom={13}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <MarkerClusterGroup>
                            {filteredMarkers.map((marker) => (
                                <Marker
                                    key={marker.id}
                                    position={marker.position}
                                >
                                    <TripPopup
                                        handleDelete={() =>
                                            handleDelete(marker.id)
                                        }
                                        imageUpload={() =>
                                            handleImageUpload(marker.id)
                                        }
                                        marker={marker}
                                        errors={errors}
                                        isOwner={
                                            currentUser?.username ===
                                            marker.owner
                                        }
                                        isAuthenticated={isAuthenticated}
                                    />
                                </Marker>
                            ))}
                        </MarkerClusterGroup>
                        <ZoomToMarkers markers={filteredMarkers} />
                    </MapContainer>
                </Col>
            </Row>
        </Container>
    );
};

export default MapComponent;
