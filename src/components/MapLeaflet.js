// import React, { useRef, useEffect, useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import MarkerClusterGroup from "react-leaflet-cluster";
// import PopularProfiles from "../pages/profiles/PopularProfiles";
// import axios from "axios";

// import Form from "react-bootstrap/Form";
// import Col from "react-bootstrap/Col";
// import Row from "react-bootstrap/Row";
// import Container from "react-bootstrap/Container";

// // Fix for default marker icon not showing
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl:
//         "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
//     iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
//     shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
// });

// const MapLeaflet = () => {
//     const [markers, setMarkers] = useState([]);
//     const mapRef = useRef(null);
//     const position = [51.505, -0.09]; // Default position for the map
//     const markers = [
//         { position: [51.505, -0.09], popup: "Marker 1" },
//         { position: [51.515, -0.1], popup: "Marker 2" },
//         { position: [51.505, -0.095], popup: "Marker 1" },
//         { position: [51.515, -0.11], popup: "Marker 2" },
//     ];
//     return (
//         <Container className="d-flex flex-column w-100 p-0">
//             <Row className="h-100">
//                 <Col className="py-2 p-0 p-lg-2" lg={8}>
//                     <MapContainer
//                         ref={mapRef}
//                         center={position}
//                         zoom={13}
//                         style={{ height: "85vh", width: "100%" }}
//                     >
//                         <TileLayer
//                             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                         />
//                         <MarkerClusterGroup>
//                             {markers.map((marker, index) => (
//                                 <Marker key={index} position={marker.position}>
//                                     <Popup>{marker.popup}</Popup>
//                                 </Marker>
//                             ))}
//                         </MarkerClusterGroup>
//                     </MapContainer>
//                 </Col>
//                 <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
//                     <PopularProfiles />
//                 </Col>
//             </Row>
//         </Container>
//     );
// }

// export default MapLeaflet;

import React, { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
// import PopularProfiles from "../pages/profiles/PopularProfiles";
import { axiosReq } from "../api/axiosDefaults";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

// Fix for default marker icon not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const MapLeaflet = ({ query }) => {
    const [markers, setMarkers] = useState([]);
    const mapRef = useRef(null);
    //const position = [51.505, -0.09]; // Default center position for the map

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axiosReq("/trips");
                console.log(data, "data");
                const markerData = data.results.map((result) => ({
                    position: [result.lat, result.lon],
                    popup: `Trip at (${result.lat}, ${result.lon})`, // Customize this as needed
                }));
                console.log("markerData data:", markerData);

                setMarkers(markerData);
            } catch (err) {
                console.error("Failed to fetch data:", err);
            }
        };

        fetchData();
    }, []); // Empty dependency array so the fetch occurs on mount

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
        <Container className="d-flex flex-column w-100 p-0">
            <Row className="h-100">
                <Col className="py-2 p-0 p-lg-2" >
                    <MapContainer
                        //ref={mapRef}
                        //center={position}
                        center={[51.505, -0.09]}
                        zoom={13}
                        style={{ height: "75vh", width: "50%", position: "fixed" }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <MarkerClusterGroup>
                            {markers.map((marker, index) => (
                                <Marker key={index} position={marker.position}>
                                    <Popup>{marker.popup}</Popup>
                                </Marker>
                            ))}
                        </MarkerClusterGroup>
                        <ZoomToMarkers markers={markers} />
                    </MapContainer>
                </Col>
                {/* <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
                    <PopularProfiles />
                </Col> */}
            </Row>
        </Container>
    );
};

export default MapLeaflet;
