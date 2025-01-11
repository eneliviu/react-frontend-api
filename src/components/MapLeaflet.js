// // Desc: Component to display a map with markers for trips fetched from the server.
// import React, { useRef, useEffect, useState, use } from "react";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import MarkerClusterGroup from "react-leaflet-cluster";
// import { axiosReq } from "../api/axiosDefaults";

// import Col from "react-bootstrap/Col";
// import Row from "react-bootstrap/Row";
// import Container from "react-bootstrap/Container";
// import NotFoundMessage from "./NotFoundMessage";

// import Alert from "react-bootstrap/Alert";

// // Standard fix for default marker icon not showing
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl:
//         "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
//     iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
//     shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
// });

// const MapLeaflet = ({ countryQuery, placeQuery }) => {
//     const [markers, setMarkers] = useState([]);
//     const [showNotFound, setShowNotFound] = useState(false);
//     const mapRef = useRef(null);
//     const defaultPosition = [51.505, -0.09]; // Default center position for the map

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const { data } = await axiosReq("/trips");
//                 console.log("marker data: ", data);
//                 const markerData = data.results.map((result) => ({
//                     id: result.id,
//                     owner: result.owner,
//                     position: [result.lat, result.lon],
//                     popup: `Trip at (${result.lat}, ${result.lon})`,
//                     country: result.country || "",
//                     place: result.place || "",
//                     status: result.trip_status || "",
//                     category: result.trip_category || "",
//                 }));
//                 setMarkers(markerData);
//             } catch (err) {
//                 console.error("Failed to fetch data:", err);
//             }
//         };

//         fetchData();
//     }, []); // Empty dependency array so the fetch occurs on mount

//     const filteredMarkers = markers.filter(
//         (marker) =>
//             // [marker.country, marker.place, marker.status, marker.category].some(
//             //     (property) => property.toLowerCase().includes(query.toLowerCase())
//             // )
//             marker.country.toLowerCase().includes(countryQuery.toLowerCase()) &&
//             marker.place.toLowerCase().includes(placeQuery.toLowerCase())
//     );

//     useEffect(() => {
//         setShowNotFound(
//             filteredMarkers.length === 0 && (countryQuery || placeQuery)
//         );
//     }, [filteredMarkers, countryQuery, placeQuery]);

//     const ZoomToMarkers = ({ markers }) => {
//         const map = useMap();

//         useEffect(() => {
//             if (markers.length > 0) {
//                 const bounds = markers.map((marker) => marker.position);
//                 map.fitBounds(bounds);
//             }
//         }, [markers, map]);

//         return null;
//     };

//     return (
//         <Container className="d-flex flex-column p-0">
//             <Row>
//                 <Col
//                     className="py-2 p-0 p-lg-2"
//                     style={{ position: "relative" }}
//                 >
//                     {showNotFound && (
//                         <Alert
//                             variant="warning"
//                             onClose={() => setShowNotFound(false)}
//                             dismissible
//                             style={{
//                                 position: "absolute",
//                                 top: 20,
//                                 left: "50%",
//                                 transform: "translateX(-50%)",
//                                 zIndex: 1000,
//                                 width: "auto",
//                             }}
//                         >
//                             Sorry, no trips match your current search filters.
//                         </Alert>
//                     )}
//                     <MapContainer
//                         ref={mapRef}
//                         center={defaultPosition}
//                         zoom={13}
//                         style={{
//                             height: "75vh",
//                             width: "100%",
//                             position: "relative",
//                         }}
//                     >
//                         <TileLayer
//                             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                         />
//                         <MarkerClusterGroup>
//                             {filteredMarkers.map((marker) => (
//                                 <Marker
//                                     key={marker.id}
//                                     position={marker.position}
//                                 >
//                                     <Popup>
//                                         {marker.owner}: {marker.country},{" "}
//                                         {marker.place}
//                                     </Popup>
//                                 </Marker>
//                             ))}
//                         </MarkerClusterGroup>
//                         <ZoomToMarkers markers={filteredMarkers} />
//                     </MapContainer>
//                 </Col>
//             </Row>
//         </Container>
//     );
// };

// export default MapLeaflet;

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

// Standard fix for default marker icon not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const MapLeaflet = ({ countryQuery, placeQuery }) => {
    const [markers, setMarkers] = useState([]);
    const [showNotFound, setShowNotFound] = useState(false);
    const mapRef = useRef(null);
    const defaultPosition = [51.505, -0.09]; // Default center position for the map

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axiosReq("/trips");
                console.log("marker data: ", data);
                const markerData = data.results.map((result) => ({
                    id: result.id,
                    owner: result.owner,
                    position: [result.lat, result.lon],
                    country: result.country || "",
                    place: result.place || "",
                    latestImageUrl:
                        result.images.length > 0
                            ? result.images[result.images.length - 1].image
                            : "",
                }));
                setMarkers(markerData);
                console.log("markerData", markerData);
            } catch (err) {
                console.error("Failed to fetch data:", err);
            }
        };

        fetchData();
    }, []);

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
                    className="py-2 p-0 p-lg-2"
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
                                    <Popup>
                                        <div>
                                            <strong>{marker.owner}</strong>:{" "}
                                            {marker.country}, {marker.place}
                                        </div>
                                        {marker.latestImageUrl && (
                                            <img
                                                src={marker.latestImageUrl}
                                                alt={`${marker.owner}'s latest trip`}
                                                style={{
                                                    maxWidth: "100%",
                                                    height: "auto",
                                                }}
                                            />
                                        )}
                                    </Popup>
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