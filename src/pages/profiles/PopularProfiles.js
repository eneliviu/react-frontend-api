import React from "react";
import appStyles from "../../App.module.css";
import { Container } from "react-bootstrap";
import Asset from "../../components/Asset";
import Profile from "./Profile";
import { useProfileData } from "../../contexts/ProfileDataContext";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Alert from "react-bootstrap/Alert";


const PopularProfiles = ({ mobile }) => {
    const { popularProfiles } = useProfileData();
    const currentUser = useCurrentUser();
    const isLoading = !popularProfiles;
    const hasPopularProfiles = popularProfiles?.results?.length > 0;

    return (
        <Container
            className={`${appStyles.Content} ${
                mobile && "d-lg-none text-center mb-3"
            }`}
        >
            {isLoading ? (
                <Asset spinner />
            ) : currentUser ? (
                hasPopularProfiles ? (
                    <>
                        <p>Most followed profiles.</p>
                        {mobile ? (
                            <div className="d-flex justify-content-around">
                                {popularProfiles.results
                                    .slice(0, 10)
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
                    <Alert variant="info" className="text-center">
                        No popular profiles to display.
                    </Alert>
                )
            ) : (
                <Alert variant="info" className="text-center">
                    Please <a href="/login">log in</a> or{" "}
                    <a href="/register">register</a> to see popular profiles.
                </Alert>
            )}
        </Container>
    );
};

export default PopularProfiles;
