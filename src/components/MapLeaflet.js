import React, { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { axiosReq } from "../api/axiosDefaults";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import btnStyles from "../styles/Button.module.css";
import { Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { Card, OverlayTrigger, Tooltip } from "react-bootstrap";

// Standard fix for default marker icon not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const MapLeaflet = ({ countryQuery, placeQuery }) => {
    const currentUser = useCurrentUser();
    const isAuthenticated = !!currentUser;

    const [markers, setMarkers] = useState([]);
    const [showNotFound, setShowNotFound] = useState(false);
    const [showNoMarkers, setShowNoMarkers] = useState(false);
    const mapRef = useRef(null);
    const defaultPosition = [51.505, -0.09]; // Default center position for the map

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axiosReq("/trips");
                const markerData = data.results.map((result) => ({
                    id: result.id,
                    owner: result.owner,
                    position: [result.lat, result.lon],
                    country: result.country || "",
                    place: result.place || "",
                    from: result.start_date,
                    to: result.end_date,
                    status: result.status,
                    category: result.category,
                    latestImageUrl:
                        result.images.length > 0
                            ? result.images[result.images.length - 1].image
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

    return (
        <Container className="d-flex flex-column p-0">
            <Row>
                <Col
                    className="py-0 p-0 p-lg-2"
                    style={{ position: "relative" }}
                >
                    {showNotFound && (
                        <Alert
                            variant="warning"
                            onClose={() => setShowNotFound(false)}
                            style={{
                                position: "absolute",
                                top: 20,
                                left: "50%",
                                transform: "translateX(-50%)",
                                zIndex: 1000,
                                width: "auto",
                            }}
                        >
                            Sorry, no trips match your current search filters.
                        </Alert>
                    )}

                    {showNoMarkers && (
                        <Alert
                            variant="info"
                            dismissible
                            onClose={() => setShowNoMarkers(false)}
                            style={{
                                position: "absolute",
                                top: 60,
                                left: "50%",
                                transform: "translateX(-50%)",
                                zIndex: 1000,
                                width: "auto",
                            }}
                        >
                            There are no trips to display.
                        </Alert>
                    )}

                    <MapContainer
                        ref={mapRef}
                        center={defaultPosition}
                        zoom={13}
                        style={{
                            height: "75vh",
                            width: "100%",
                            position: "relative",
                        }}
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
                                    {isAuthenticated ? (
                                        <Popup>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent:
                                                        "space-between",
                                                    padding: "5px",
                                                    marginRight: "10px",
                                                }}
                                            >
                                                {marker.latestImageUrl ? (
                                                    <img
                                                        src={
                                                            marker.latestImageUrl
                                                        }
                                                        alt={`${marker.owner}'s latest trip`}
                                                        style={{
                                                            maxWidth: "100px",
                                                            height: "auto",
                                                            borderRadius: "4px",
                                                            marginRight: "10px",
                                                        }}
                                                    />
                                                ) : (
                                                    <NavLink
                                                        to={`/trips/${marker.id}/images/`}
                                                    >
                                                        <Button
                                                            style={{
                                                                padding:
                                                                    "5px 10px",
                                                                margin: "20px",
                                                                textAlign:
                                                                    "center",
                                                                cursor: "pointer",
                                                            }}
                                                            className={`${btnStyles.Button}  ${btnStyles.Bright}`}
                                                        >
                                                            <small>
                                                                Add Image
                                                            </small>
                                                        </Button>
                                                    </NavLink>
                                                )}
                                                <div style={{ flex: 1 }}>
                                                    <strong>
                                                        {marker.owner}'s Trip
                                                    </strong>
                                                    <div
                                                        style={{
                                                            margin: "5px 0",
                                                        }}
                                                    >
                                                        <span>
                                                            {" "}
                                                            <small>
                                                                {marker.place},{" "}
                                                                {marker.country}
                                                            </small>
                                                        </span>
                                                    </div>
                                                    <div
                                                        style={{
                                                            margin: "5px 0",
                                                        }}
                                                    >
                                                        <p
                                                            className="text-muted"
                                                            style={{
                                                                margin: 0,
                                                            }}
                                                        >
                                                            <small>
                                                                {marker.content
                                                                    ? marker.content
                                                                    : "Content N/A"}
                                                            </small>
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted">
                                                            <small>
                                                                Category:{" "}
                                                                {
                                                                    marker.category
                                                                }
                                                            </small>
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted">
                                                            <small>
                                                                Status:{" "}
                                                                {marker.status}
                                                            </small>
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted">
                                                            <small>
                                                                {marker.from} to{" "}
                                                                {marker.to}
                                                            </small>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Popup>
                                    ) : (
                                        // <></>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip>
                                                        Log in for details!
                                                    </Tooltip>
                                                }
                                            >
                                                <i className="fas fa-info-circle" />
                                            </OverlayTrigger>
                                    )}
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

export default MapLeaflet;
