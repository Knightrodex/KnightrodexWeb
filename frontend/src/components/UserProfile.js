import React from 'react'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import './UserProfile.css';
import { Link } from 'react-router-dom';

function UserProfile({ userData }) {
    const {
        name,
        location,
        photos,
        followers,
        following,
        about,
        recentPhotos,
    } = userData;

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
                                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
                                        alt="Generic placeholder image"
                                        className="img-fluid img-thumbnail mt-4 mb-2"
                                        style={{ width: '150px', zIndex: '1' }}
                                    />
                                    <button type="button" className="btn btn-outline-dark" data-mdb-ripple-color="dark" style={{ zIndex: '1' }}>
                                        Edit profile
                                    </button>
                                </div>
                                <div className="ms-3" style={{ marginTop: '130px' }}>
                                    <h5>{name}</h5>
                                    <p>{location}</p>
                                </div>
                            </div>
                            <div className="p-4 text-black" style={{ backgroundColor: '#f8f9fa' }}>
                                <div className="d-flex justify-content-end text-center py-1">
                                    <div>
                                        <p className="mb-1 h5">{photos}</p>
                                        <p className="small text-muted mb-0">Photos</p>
                                    </div>
                                    <div className="px-3">
                                        <p className="mb-1 h5">{followers}</p>
                                        <p className="small text-muted mb-0">Followers</p>
                                    </div>
                                    <div>
                                        <p className="mb-1 h5">{following}</p>
                                        <p className="small text-muted mb-0">Following</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-4 text-black">
                                <div className="mb-5">
                                    <p className="lead fw-normal mb-1">About</p>
                                    <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
                                        {about.map((item, index) => (
                                            <p className="font-italic mb-1" key={index}>
                                                {item}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <p className="lead fw-normal mb-0">Recent photos</p>
                                    <p className="mb-0">
                                        <a href="#!" className="text-muted">
                                            Show all
                                        </a>
                                    </p>
                                </div>
                                <div className="row g-2">
                                    {recentPhotos.map((photo, index) => (
                                        <div className="col mb-2" key={index}>
                                            <img src={photo} alt={`image ${index + 1}`} className="w-100 rounded-3" />
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
