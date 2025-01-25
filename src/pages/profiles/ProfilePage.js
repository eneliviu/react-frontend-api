// /**
//  * ProfilePage component displays the profile information and posts of a user.
//  *
//  * This component fetches and displays the profile details and posts of a user.
//  * It allows the current user to follow or unfollow the profile owner.
//  *
//  * @component ProfilePage
//  * @example <ProfilePage />
//  * return (
//  *   <ProfilePage />
//  * )
//  *
//  * @returns {JSX.Element} The ProfilePage component.
//  */

// import React, { useEffect, useState } from "react";
// import Form from "react-bootstrap/Form";
// import Col from "react-bootstrap/Col";
// import Row from "react-bootstrap/Row";
// import Container from "react-bootstrap/Container";
// import Asset from "../../components/Asset";

// import styles from "../../styles/ProfilePage.module.css";
// import btnStyles from "../../styles/Button.module.css";
// import rowStyles from "../../styles/SignInUpForm.module.css";
// import appStyles from "../../App.module.css";

// import PopularProfiles from "./PopularProfiles";
// import { useCurrentUser } from "../../contexts/CurrentUserContext";
// import { useParams } from "react-router";
// import { axiosReq } from "../../api/axiosDefaults";
// import {
//     useProfileData,
//     useSetProfileData,
// } from "../../contexts/ProfileDataContext";

// import { Button, Image } from "react-bootstrap";
// import InfiniteScroll from "react-infinite-scroll-component";
// import { fetchMoreData } from "../../utils/utils";
// import NoResults from "../../assets/no-results.png";
// import { ProfileEditDropdown } from "../../components/MoreDropdown";

// import ProfilePost from "../posts/ProfilePost";

// function ProfilePage({ message }) {
//     const [hasLoaded, setHasLoaded] = useState(false);
//     const [profilePosts, setProfilePosts] = useState({ results: [] });

//     const currentUser = useCurrentUser();
//     const { id } = useParams();
//     console.log("profileID", id);

//     const { setProfileData, handleFollow, handleUnfollow } =
//         useSetProfileData();
//     const { pageProfile } = useProfileData();

//     const [profile] = pageProfile.results;
//     const is_owner = currentUser?.username === profile?.owner;

//     const [query, setQuery] = useState("");

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const [{ data: pageProfile }, { data: profilePosts }] =
//                     await Promise.all([
//                         axiosReq.get(`/profiles/${id}/`),
//                         //axiosReq.get(`/trips/?owner__profile_id=${id}`),
//                         // axiosReq.get(
//                         //     `/trips/?current_user_trips=True&owner__profile=${id}`
//                         // ),
//                         axiosReq.get(
//                             `/trips/?current_user_trips=True&owner__profile=${id}&search=${query}`
//                         ),
//                     ]);

//                 setProfileData((prevState) => ({
//                     ...prevState,
//                     pageProfile: { results: [pageProfile] },
//                 }));
//                 setProfilePosts(profilePosts);
//                 setHasLoaded(true);
//             } catch (err) {
//                 console.log(err);
//             }
//         };
//         fetchData();
//     }, [id, query, setProfileData]);

//     console.log("setProfileData", profilePosts.results);
//     console.log("query", query);

//     // Calculate total likes count
//     const totalLikesCount = profilePosts.results.reduce(
//         (acc, trip) => acc + (trip.total_likes_count || 0),
//         0
//     );

//     const mainProfile = (
//         <>
//             {profile?.is_owner && <ProfileEditDropdown id={profile?.id} />}
//             <Row className="px-3 text-center">
//                 <Col lg={3} className="text-lg-left">
//                     <Image
//                         className={styles.ProfileImage}
//                         roundedCircle
//                         src={profile?.image}
//                     />
//                 </Col>

//                 <Col lg={6}>
//                     <h3 className="m-2">{profile?.owner}</h3>
//                     <Row className="justify-content-center no-gutters">
//                         <Col xs={4} className="my-2">
//                             <small>
//                                 <div>{profile?.trips_count}</div>
//                                 <div>trips</div>
//                             </small>
//                         </Col>
//                         <Col xs={4} className="my-2">
//                             <small>
//                                 <div>{profile?.images_count}</div>
//                                 <div>photos</div>
//                             </small>
//                         </Col>
//                         <Col xs={4} className="my-2">
//                             <small>
//                                 <div>{profile?.followers_count}</div>
//                                 <div>followers</div>
//                             </small>
//                         </Col>
//                         <Col xs={4} className="my-2">
//                             <small>
//                                 <div>{profile?.following_count}</div>
//                                 <div>follows</div>
//                             </small>
//                         </Col>
//                         <Col xs={4} className="my-2">
//                             <small>
//                                 <div>{totalLikesCount}</div>
//                                 <div>likes</div>
//                             </small>
//                         </Col>
//                     </Row>
//                 </Col>
//                 <Col lg={3} className="text-lg-right">
//                     {currentUser &&
//                         !is_owner &&
//                         (profile?.following_id ? (
//                             <Button
//                                 className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
//                                 onClick={() => handleUnfollow(profile)}
//                             >
//                                 unfollow
//                             </Button>
//                         ) : (
//                             <Button
//                                 className={`${btnStyles.Button} ${btnStyles.Black}`}
//                                 onClick={() => handleFollow(profile)}
//                             >
//                                 follow
//                             </Button>
//                         ))}
//                 </Col>
//                 {profile?.content && (
//                     <Col className="p-3">{profile.content}</Col>
//                 )}
//             </Row>
//         </>
//     );

//     const mainProfilePosts = (
//         <>
//             {/* <hr />
//             <h5 className="text-center">Latest {profile?.owner}'s posts</h5> */}

//             <i className={`fas fa-search ${styles.SearchIcon}`} />
//             <Form
//                 className={styles.SearchBar}
//                 onSubmit={(event) => event.preventDefault()}
//             >
//                 <Form.Control
//                     value={query}
//                     onChange={(event) => setQuery(event.target.value)}
//                     type="text"
//                     placeholder="Search free text and upload date (yyyy-mm-dd)"
//                     className="mr-sm-2"
//                 />
//             </Form>

//             {profilePosts.results.length ? (
//                 <InfiniteScroll
//                     children={profilePosts.results.map((post) => (
//                         <ProfilePost
//                             key={post.id}
//                             {...post}
//                             setPosts={setProfilePosts}
//                         />
//                     ))}
//                     dataLength={profilePosts.results.length}
//                     loader={<Asset spinner />}
//                     hasMore={!!profilePosts.next}
//                     next={() => fetchMoreData(profilePosts, setProfilePosts)}
//                 />
//             ) : (
//                 {
//                     ...(query ? (
//                         <Container className={appStyles.Content}>
//                             <Asset
//                                 src={NoResults}
//                                 message={`No results found for "${query}".`}
//                             />
//                         </Container>
//                     ) : (
//                         <Container className={appStyles.Content}>
//                             <Asset
//                                 src={NoResults}
//                                 message={`No results found, ${profile?.owner} hasn't posted yet.`}
//                             />
//                         </Container>
//                     )),
//                 }
//             )}
//         </>
//     );

//     return (
//         <Container>
//             {/* className={styles.App} */}
//             <Row>
//                 <Col className="py-2 p-lg-2 vh-100`" lg={8}>
//                     <PopularProfiles mobile />
//                     <Container>
//                         {
//                             hasLoaded ? (
//                                 <>
//                                     {mainProfile}
//                                     <hr />
//                                     <h5 className="text-center">
//                                         Latest {profile?.owner}'s posts
//                                     </h5>
//                                     {mainProfilePosts}
//                                 </>
//                             ) : null
//                             // <>
//                             //     <Asset spinner />
//                             //     <Container className={appStyles.Content}>
//                             //         <Asset src={NoResults} message={message} />
//                             //     </Container>
//                             // </>
//                         }
//                     </Container>
//                 </Col>
//                 <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
//                     <PopularProfiles />
//                 </Col>
//             </Row>
//         </Container>
//     );
// }

// export default ProfilePage;

// Import necessary modules and components
import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Asset from "../../components/Asset";

import styles from "../../styles/ProfilePage.module.css";
import srcbStyles from "../../styles/SearchBar.module.css";
import btnStyles from "../../styles/Button.module.css";
import rowStyles from "../../styles/SignInUpForm.module.css";
import appStyles from "../../App.module.css";

import PopularProfiles from "./PopularProfiles";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import {
    useProfileData,
    useSetProfileData,
} from "../../contexts/ProfileDataContext";

import { Button, Image } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import NoResults from "../../assets/no-results.png";
import { ProfileEditDropdown } from "../../components/MoreDropdown";
import ProfilePost from "../posts/ProfilePost";

/**
 * MainProfilePosts component to display the profile posts based on query
 *
 * @component
 */
function MainProfilePosts({
    profile,
    query,
    setQuery,
    profilePosts,
    setProfilePosts,
}) {
    return (
        <>
            {profilePosts.results.length ? (
                <InfiniteScroll
                    children={profilePosts.results.map((post) => (
                        <ProfilePost
                            key={post.id}
                            {...post}
                            setPosts={setProfilePosts}
                        />
                    ))}
                    dataLength={profilePosts.results.length}
                    loader={<Asset spinner />}
                    hasMore={!!profilePosts.next}
                    next={() => fetchMoreData(profilePosts, setProfilePosts)}
                />
            ) : (
                <>
                    {query ? (
                        <Container className={appStyles.Content}>
                            <Asset
                                src={NoResults}
                                message={`No results found for "${query}".`}
                            />
                        </Container>
                    ) : (
                        <Container className={appStyles.Content}>
                            <Asset
                                src={NoResults}
                                message={`No results found, ${profile?.owner} hasn't posted yet.`}
                            />
                        </Container>
                    )}
                </>
            )}
        </>
    );
}

/**
 * ProfilePage component displays the profile information and posts of a user.
 *
 * @component
 * @returns {JSX.Element} The ProfilePage component.
 */

function ProfilePage({ message }) {
    const [hasLoaded, setHasLoaded] = useState(false);
    const [profilePosts, setProfilePosts] = useState({ results: [] });

    const currentUser = useCurrentUser();
    const { id } = useParams();
    console.log("profileID", id);

    const { setProfileData, handleFollow, handleUnfollow } =
        useSetProfileData();
    const { pageProfile } = useProfileData();

    const [profile] = pageProfile.results;
    const is_owner = currentUser?.username === profile?.owner;

    const [query, setQuery] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [{ data: pageProfile }, { data: profilePosts }] =
                    await Promise.all([
                        axiosReq.get(`/profiles/${id}/`),
                        axiosReq.get(
                            `/trips/?current_user_trips=True&owner__profile=${id}&search=${query}`
                        ),
                    ]);

                setProfileData((prevState) => ({
                    ...prevState,
                    pageProfile: { results: [pageProfile] },
                }));
                setProfilePosts(profilePosts);
                setHasLoaded(true);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [id, query, setProfileData, setProfilePosts, setHasLoaded]);

    // Calculate total likes count
    const totalLikesCount = profilePosts.results.reduce(
        (acc, trip) => acc + (trip.total_likes_count || 0),
        0
    );

    const mainProfile = (
        <>
            {profile?.is_owner && <ProfileEditDropdown id={profile?.id} />}
            <Row className="px-3 text-center">
                <Col lg={3} className="text-lg-left">
                    <Image
                        className={styles.ProfileImage}
                        roundedCircle
                        src={profile?.image}
                    />
                </Col>

                <Col lg={6}>
                    <h3 className="m-2">{profile?.owner}</h3>
                    <Row className="justify-content-center no-gutters">
                        <Col xs={4} className="my-2">
                            <small>
                                <div>{profile?.trips_count}</div>
                                <div>trips</div>
                            </small>
                        </Col>
                        <Col xs={4} className="my-2">
                            <small>
                                <div>{profile?.images_count}</div>
                                <div>photos</div>
                            </small>
                        </Col>
                        <Col xs={4} className="my-2">
                            <small>
                                <div>{profile?.followers_count}</div>
                                <div>followers</div>
                            </small>
                        </Col>
                        <Col xs={4} className="my-2">
                            <small>
                                <div>{profile?.following_count}</div>
                                <div>follows</div>
                            </small>
                        </Col>
                        <Col xs={4} className="my-2">
                            <small>
                                <div>{totalLikesCount}</div>
                                <div>likes</div>
                            </small>
                        </Col>
                    </Row>
                </Col>

                <Col lg={3} className="text-lg-right">
                    {currentUser &&
                        !is_owner &&
                        (profile?.following_id ? (
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
                </Col>
                {profile?.content && (
                    <Col className="p-3">{profile.content}</Col>
                )}
            </Row>
        </>
    );

    console.log("Profile: ", profile);
    return (
        <div className={styles.App}>
            <Row className={`${rowStyles.Row} h-100`}>
                <Col className="py-2 p-lg-2 `" lg={8}>
                    <PopularProfiles mobile />
                    {hasLoaded ? (
                        <>
                            {mainProfile}

                            {is_owner && (
                                <>
                                    {" "}
                                    <hr />
                                    <h5 className="text-center pb-2">
                                        Latest {profile?.owner}'s posts
                                    </h5>
                                    <i
                                        className={`fas fa-search ${srcbStyles.SearchIcon}`}
                                    />
                                    <Form
                                        className={srcbStyles.SearchBar}
                                        onSubmit={(event) =>
                                            event.preventDefault()
                                        }
                                    >
                                        <Form.Control
                                            value={query}
                                            onChange={(event) =>
                                                setQuery(event.target.value)
                                            }
                                            type="text"
                                            placeholder="Search free text and upload date (yyyy-mm-dd)"
                                            className="mr-sm-2"
                                        />
                                    </Form>
                                </>
                            )}

                            {is_owner && (
                                <MainProfilePosts
                                    profile={profile}
                                    query={query}
                                    setQuery={setQuery}
                                    profilePosts={profilePosts}
                                    setProfilePosts={setProfilePosts}
                                />
                            )}
                        </>
                    ) : (
                        <>
                            <Asset spinner />
                            <Container className={appStyles.Content}>
                                <Asset src={NoResults} message={message} />
                            </Container>
                        </>
                    )}
                </Col>
                <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
                    <PopularProfiles />
                </Col>
            </Row>
        </div>
    );
}

export default ProfilePage;
