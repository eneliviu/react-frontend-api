import React, { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { axiosReq } from "../api/axiosDefaults";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";

import { useParams } from "react-router-dom";

// Fix for default marker icon not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const MapLeafletTripId = () => {
    const [marker, setMarker] = useState(null);
    const defaultPosition = [51.505, -0.09]; // Default fallback position
    const { trip_id } = useParams();

    useEffect(() => {
        const fetchTrip = async () => {
            if (!trip_id) return; // Early return if tripId is not defined
            try {
                const { data } = await axiosReq(`/trips/${trip_id}/`); // Ensure the correct API endpoint
                const markerData = {
                    owner: data.owner,
                    position: [data.lat, data.lon],
                    popup: `Trip at (${data.lat}, ${data.lon})`,
                    country: data.country || "",
                    place: data.place || "",
                    from: data.start_date,
                    to: data.end_date,
                    status: data.trip_status,
                    category: data.trip_category,
                    content: data.content,
                    latestImageUrl:
                        data.images.length > 0
                            ? data.images[data.images.length - 1].image
                            : "",
                };
                setMarker(markerData);
            } catch (err) {
                console.error("Failed to fetch trip data:", err);
            }
        };

        fetchTrip();
    }, [trip_id]); // Fetch data when id changes

    const ZoomToMarker = ({ marker }) => {
        const map = useMap();

        useEffect(() => {
            if (marker) {
                map.setView(marker.position, 13);
            }
        }, [marker, map]);

        return null;
    };

    return (
        <Container className="d-flex flex-column w-100 p-0">
            <Row className="h-100">
                <Col className="py-2 p-0 p-lg-2" lg={8}>
                    <MapContainer
                        center={marker ? marker.position : defaultPosition}
                        zoom={13}
                        style={{ height: "85vh", width: "100%" }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {marker && (
                            <Marker position={marker.position}>
                                <Popup>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            padding: "10px",
                                        }}
                                    >
                                        {marker.latestImageUrl ? (
                                            <img
                                                src={marker.latestImageUrl}
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
                                                to={`/trips/${trip_id}/images/`}
                                            >
                                                <button
                                                    style={{
                                                        padding: "5px 10px",
                                                        backgroundColor:
                                                            "#007bff",
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: "4px",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Add Image
                                                </button>
                                            </NavLink>
                                        )}
                                        <div style={{ flex: 1 }}>
                                            <strong>
                                                {marker.owner}'s Trip
                                            </strong>
                                            <div style={{ margin: "5px 0" }}>
                                                <span>
                                                    {marker.place},{" "}
                                                    {marker.country}
                                                </span>
                                            </div>
                                            <div style={{ margin: "5px 0" }}>
                                                <p
                                                    className="text-muted"
                                                    style={{ margin: 0 }}
                                                >
                                                    {marker.content
                                                        ? marker.content
                                                        : "Content N/A"}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-muted">
                                                    <small>
                                                        Category:{" "}
                                                        {marker.category}
                                                    </small>
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-muted">
                                                    <small>
                                                        Status: {marker.status}
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
                                {/* <Popup>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                        }}
                                    >
                                        <strong style={{ textAlign: "center" }}>
                                            {marker.owner}'s Trip
                                        </strong>
                                        <hr style={{ width: "100%" }} />

                                        <span>
                                            {marker.place}, {marker.country}
                                        </span>
                                        <hr style={{ width: "100%" }} />

                                        <div
                                            style={{
                                                textAlign: "center",
                                                //marginTop: "5px",
                                            }}
                                        >
                                            <p className="text-muted">
                                                {marker.content
                                                    ? marker.content
                                                    : "N/A"}
                                            </p>
                                        </div>
                                        <hr style={{ width: "100%" }} />

                                        <div
                                            style={{
                                                textAlign: "center",
                                                // marginTop: "5px",
                                            }}
                                        >
                                            <span className="text-muted">
                                                <small>
                                                    Category: {marker.category}
                                                </small>
                                            </span>
                                        </div>
                                        <hr style={{ width: "100%" }} />
                                        <div
                                            style={{
                                                textAlign: "center",
                                                //marginTop: "0px",
                                            }}
                                        >
                                            <span className="text-muted">
                                                <small>
                                                    Status: {marker.status}
                                                </small>
                                            </span>
                                        </div>
                                        <hr style={{ width: "100%" }} />
                                        <div
                                            style={{
                                                textAlign: "center",
                                                //marginTop: "5px",
                                            }}
                                        >
                                            <span className="text-muted">
                                                <small>
                                                    {marker.from} : {marker.to}
                                                </small>
                                            </span>
                                            <hr style={{ width: "100%" }} />
                                        </div>

                                        {marker.latestImageUrl && (
                                            <img
                                                src={marker.latestImageUrl}
                                                alt={`${marker.owner}'s latest trip`}
                                                style={{
                                                    maxWidth: "100%",
                                                    height: "auto",
                                                    marginTop: "10px",
                                                    borderRadius: "4px",
                                                }}
                                            />
                                        )}
                                    </div>
                                </Popup> */}
                            </Marker>
                        )}
                        {marker && <ZoomToMarker marker={marker} />}
                    </MapContainer>
                </Col>
            </Row>
        </Container>
    );
};

export default MapLeafletTripId;
