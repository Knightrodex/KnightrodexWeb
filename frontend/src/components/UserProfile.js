import React from 'react'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import { Tooltip } from 'react-tooltip'
import './UserProfile.css';

function UserProfile({ userData }) {
    const {
        userId,
        firstName,
        lastName,
        profilePicture,
        usersFollowed,
        dateCreated,
        badgesCollected,
        jwtToken,
        error
    } = userData;

    console.log(userData);

    dayjs.extend(relativeTime);

    return (
        <section className="h-100 gradient-custom-2">
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col col-lg-9 col-xl-7">
                        <div className="card">
                            <div
                                className="rounded-top text-white d-flex flex-row"
                                style={{ backgroundColor: '#000', height: '200px' }}
                            >
                                <div className="ms-4 mt-5 d-flex flex-column" style={{ width: '150px' }}>
                                    <img
                                        src={profilePicture}
                                        alt="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
                                        className="img-fluid img-thumbnail mt-4 mb-2"
                                        style={{ width: '150px', zIndex: '1' }}
                                    />
                                    <button type="button" className="btn btn-outline-dark" data-mdb-ripple-color="dark" style={{ zIndex: '1' }}>
                                        edit picture
                                    </button>
                                </div>
                                <div className="ms-3" style={{ marginTop: '130px' }}>
                                    <h5>{firstName + " " + lastName}</h5>
                                </div>
                            </div>
                            <div className="p-4 text-black" style={{ backgroundColor: '#f8f9fa' }}>
                                <div className="d-flex justify-content-end text-center py-1">
                                    <div>
                                        <p className="mb-1 h5">{(badgesCollected == null) ? 0 : badgesCollected.length}</p>
                                        <p className="small text-muted mb-0">Badges</p>
                                    </div>
                                    <div className="px-3">
                                        <p className="mb-1 h5">{(usersFollowed == null) ? 0 : usersFollowed.length}</p>
                                        <p className="small text-muted mb-0">Following</p>
                                    </div>
                                    {/* <div>
                                        <p className="mb-1 h5">{following}</p>
                                        <p className="small text-muted mb-0">Following</p>
                                    </div> */}
                                </div>
                            </div>
                            <div className="card-body p-4 text-black">
                                <div className="mb-5">
                                    <p className="lead fw-normal mb-1">About</p>
                                    <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
                                        <p className="font-italic mb-1">
                                            { userData.jwtToken.email } 
                                        </p>
                                        <p className="font-italic mb-1">
                                            Account created { dayjs(dateCreated).fromNow() }
                                        </p>
                                        
                                        
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <p className="lead fw-normal mb-0">Badges Found</p>
                                    <p className="mb-0 text-muted">
                                        Hover over a badge for more info
                                    </p>
                                </div>
                                <div className="row g-2" id="img-wrapper" style={{ backgroundColor: '#f8f9fa' }}>
                                    { (badgesCollected.length == 0) ? <p>Wow much empty, go find some badges</p> : badgesCollected.map((badge, index) => (
                                        <div className="col mb-2" key={index} data-tooltip-id="my-tooltip" data-tooltip-float="true" data-tooltip-html={"<h4>" + badge.title + "</h4><em>" + badge.description + "</em><br /><br />" + "Collected " + dayjs(badge.dateObtained).fromNow() + "<br />" + "Location found: " + badge.location + "<br />" + "Number " +  badge.uniqueNumber + " of " + badge.limit}>
                                            <img src={badge.badgeImage} alt={`image ${index + 1}`} className="w-100 rounded-3" />
                                            <Tooltip id="my-tooltip" />
                                        </div>
                                    ))}
                                    { (badgesCollected.length == 0) ? <p>Wow much empty, go find some badges</p> : badgesCollected.map((badge, index) => (
                                        <div className="col mb-2" key={index} data-tooltip-id="my-tooltip" data-tooltip-float="true" data-tooltip-html={"<h4>" + badge.title + "</h4><em>" + badge.description + "</em><br /><br />" + "Collected " + dayjs(badge.dateObtained).fromNow() + "<br />" + "Location found: " + badge.location + "<br />" + "Number " +  badge.uniqueNumber + " of " + badge.limit}>
                                            <img src={badge.badgeImage} alt={`image ${index + 1}`} className="w-100 rounded-3" />
                                            <Tooltip id="my-tooltip" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

}

export default UserProfile;
