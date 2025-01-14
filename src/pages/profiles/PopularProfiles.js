import React from "react";
import appStyles from "../../App.module.css";
import { Container } from "react-bootstrap";
import Asset from "../../components/Asset";
import Profile from "./Profile";
import { useProfileData } from "../../contexts/ProfileDataContext";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { OverlayTrigger, Tooltip } from "react-bootstrap";


const PopularProfiles = ({ mobile }) => {
    const { popularProfiles } = useProfileData();
    const currentUser = useCurrentUser();

    return (
        <Container
            className={`${appStyles.Content} ${
                mobile && "d-lg-none text-center mb-3"
            }`}
        >
            {popularProfiles.results.length ? (
                currentUser ? (
                    <>
                        <p>Most followed profiles.</p>
                        {mobile ? (
                            <div className="d-flex justify-content-around">
                                {popularProfiles.results
                                    .slice(0, 4)
                                    .map((profile) => (
                                        <Profile
                                            key={profile.id}
                                            profile={profile}
                                            mobile
                                        />
                                    ))}
                            </div>
                        ) : (
                            popularProfiles.results.map((profile) => (
                                <Profile key={profile.id} profile={profile} />
                            ))
                        )}
                    </>
                ) : (
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Log in to see popular profiles!</Tooltip>}
                    >
                        <div style={{ pointerEvents: 'none', opacity: 0.7 }}>
                            <p className="text-center py-4">
                                Please log in to view popular profiles.
                            </p>
                        </div>
                    </OverlayTrigger>
                )
            ) : (
                <Asset spinner />
            )}
        </Container>
    );
};

export default PopularProfiles;
