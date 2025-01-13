/**
 * Profile component displays user profile information including avatar, username, and follow/unfollow button.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.profile - Profile data
 * @param {number} props.profile.id - Profile ID
 * @param {number} props.profile.following_id - Following ID
 * @param {string} props.profile.image - Profile image URL
 * @param {string} props.profile.owner - Profile owner's username
 * @param {boolean} [props.mobile=false] - Flag to indicate if the component is in mobile view
 * @param {number} [props.imageSize=55] - Size of the profile image
 * @example <Profile profile={profile} mobile={true} imageSize={55} />
 * @returns {JSX.Element} Rendered Profile component
 */

import React from "react";
import styles from "../../styles/Profile.module.css";
import btnStyles from "../../styles/Button.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Avatar from "../../components/Avatar";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useSetProfileData } from "../../contexts/ProfileDataContext";


const Profile = (props) => {
    const { profile, mobile, imageSize = 55 } = props;
    const { id, following_id, image, owner } = profile;

    const { handleFollow, handleUnfollow } = useSetProfileData();

    const currentUser = useCurrentUser();
    //console.log("currentUser: ", currentUser);

    const is_owner = currentUser?.username === owner;

    return (
        <div
            className={`my-3 d-flex align-items-center container container-fluid ${
                mobile && "flex-column"
            }`}
        >
            <div>
                <Link className="align-self-center" to={`/profiles/${id}`}>
                    <Avatar src={image} height={imageSize} />
                </Link>
            </div>
            <div className={`w-100 mx-2 ${styles.WordBreak}`}>
                <strong>{owner}</strong>
            </div>

            <div className={`text-right container ${!mobile && "ml-auto"}`}>
                {!mobile &&
                    currentUser &&
                    !is_owner &&
                    (following_id ? (
                        <Button
                            className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
                            onClick={() => handleUnfollow(profile)}
                        >
                            unfollow
                        </Button>
                    ) : (
                        <Button
                            className={`${btnStyles.Button} ${btnStyles.Black}`}
                            onClick={() => handleFollow(profile)}
                        >
                            follow
                        </Button>
                    ))}
            </div>
        </div>
    );
};

export default Profile;
