import React, { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { axiosReq } from "../api/axiosDefaults";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
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
    const { id } = useParams();

    useEffect(() => {
        const fetchTrip = async () => {
            console.log("tripId:", id);
            if (!id) return; // Early return if tripId is not defined
            try {
                const { data } = await axiosReq(`/trips/${id}/`); // Ensure the correct API endpoint
                const markerData = {
                    position: [data.lat, data.lon],
                    popup: `Trip at (${data.lat}, ${data.lon})`, // Customize this as needed
                };
                setMarker(markerData);
            } catch (err) {
                console.error("Failed to fetch trip data:", err);
            }
        };

        fetchTrip();
    }, [id]); // Fetch data when id changes

    const ZoomToMarker = ({ marker }) => {
        const map = useMap();

        useEffect(() => {
            if (marker) {
                map.setView(marker.position, 13); // Zoom level 13 for single point
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
                                 <Popup>{marker.popup}</Popup>
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
