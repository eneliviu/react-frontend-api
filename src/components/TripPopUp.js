import React from "react";
import { NavLink } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import btnStyles from "../styles/Button.module.css";

import { Popup } from "react-leaflet";

function TripImage({ latestImageUrl }) {
    return latestImageUrl ? (
        <img
            src={latestImageUrl}
            alt="Latest trip"
            style={{
                maxWidth: "100px",
                height: "auto",
                borderRadius: "4px",
                marginRight: "10px",
            }}
        />
    ) : null;
}

function TripDetails({
    profile_id,
    owner,
    is_owner,
    place,
    country,
    content,
    category,
    status,
    from,
    to,
}) {
    return (
        <Container className="d-flex flex-column align-items-center">
            <div className="text-center">
                {is_owner ? (
                    <NavLink to={`/profiles/${profile_id}`}>
                        <Button type="label" variant="link">
                            <h5>{owner}</h5>
                        </Button>
                    </NavLink>
                ) : (
                    <NavLink to={`/profiles/${profile_id}`}>
                        <Button type="label" variant="link">
                            <h5>{owner}</h5>
                        </Button>
                    </NavLink>
                )}
            </div>
            <div style={{ margin: "5px" }}>
                <small>
                    {place}, {country}
                </small>
            </div>
            <div style={{ margin: "5px" }}>
                <p className="text-muted" style={{ margin: 0 }}>
                    <small>{content || "Content N/A"}</small>
                </p>
            </div>
            <div>
                <small className="text-muted">Category: {category}</small>
            </div>
            <div>
                <small className="text-muted">Status: {status}</small>
            </div>
            <div>
                <small className="text-muted">
                    {from} to {to}
                </small>
            </div>
        </Container>
    );
}

function TripActions({
    onDelete,
    onImageUpload,
    tripId,
    error,
    isOwner,
    isAuthenticated,
}) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "10px",
                paddingBottom: "10px",
            }}
        >
            {isOwner && isAuthenticated ? (
                <>
                    <NavLink to={`/trips/${tripId}/images/`}>
                        <Button
                            style={{
                                cursor: "pointer",
                            }}
                            className={`${btnStyles.Button} ${btnStyles.Bright}`}
                            onClick={onImageUpload}
                        >
                            Add Image
                        </Button>
                    </NavLink>
                    <Button
                        variant="danger"
                        onClick={onDelete}
                        style={{
                            cursor: "pointer",
                        }}
                        className={`${btnStyles.Button} danger`}
                    >
                        Delete Trip
                    </Button>
                </>
            ) : (
                <>
                    <Button
                        style={{
                            cursor: "pointer",
                        }}
                        className={`${btnStyles.Button} ${btnStyles.Bright}`}
                        disabled={!isOwner || !isAuthenticated}
                    >
                        Add Image
                    </Button>

                    <Button
                        variant="danger"
                        style={{
                            cursor: "pointer",
                        }}
                        className={`${btnStyles.Button} danger`}
                        disabled={!isOwner || !isAuthenticated}
                    >
                        Delete Trip
                    </Button>
                </>
            )}

            {error && <p className="text-danger">{error}</p>}
        </div>
    );
}

export default function TripPopup({
    isAuthenticated,
    marker,
    errors,
    handleDelete,
    imageUpload,
    isOwner,
}) {
    return isAuthenticated ? (
        <Popup>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "5px",
                    marginRight: "20px",
                }}
            >
                <TripImage
                    latestImageUrl={marker.latestImageUrl}
                    tripId={marker.id}
                />
                <TripDetails
                    profile_id={marker.profile_id}
                    owner={marker.owner}
                    is_owner={isOwner}
                    place={marker.place}
                    country={marker.country}
                    content={marker.content}
                    category={marker.category}
                    status={marker.status}
                    from={marker.from}
                    to={marker.to}
                />
            </div>

            <TripActions
                onDelete={() => handleDelete(marker.id)}
                onImageUpload={() => imageUpload(marker.id)}
                tripId={marker.id}
                error={errors.error}
                isOwner={isOwner}
                isAuthenticated={isAuthenticated}
            />
        </Popup>
    ) : (
        <Popup>
            <strong>Log in for details!</strong>
        </Popup>
    );
}
