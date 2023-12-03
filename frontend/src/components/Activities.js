import React, { useEffect, useState } from 'react';
import './Activities.css';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";

function Activities({ userActivity }) {
    // const {
    //     activity,
    //     jwtToken,
    //     error
    // } = userActivity;

    dayjs.extend(relativeTime);

    useEffect(() => {
        //console.log("++++", userActivity.activity);
        userActivity.activity.map((act, index) => {
            // console.log(index);
            // console.log(act.profilePicture);
        });
    }, []);

    return (
        <div className="container bootstrap snippets bootdeys custom-body">
            <div className="col-md-12 col-right">
                <div
                    className="col-inside-lg decor-default activities"
                    id="activities"
                    style={{ overflowY: "hidden", outline: "none" }}
                    tabIndex={5003}
                >
                    <h4 className="text-center fw-bold">Recent Activities</h4>
                    {userActivity.activity.map((act, index) => (
                        <div className="unit" key={index}>
                            {act.profilePicture && (
                                <div className="avatar">
                                    <img
                                        src={act.profilePicture}
                                        className="img-responsive"
                                        alt="profile"
                                    />
                                </div>
                            )}
                            <div className="field title fw-bold">
                                {act.firstName + " " + act.lastName}
                                <p className="fw-light">{act.email}</p>
                            </div>
                            <div className="field date">
                                <span className=" text-start f-l"><p>Obtained the {act.badgeTitle} badge</p></span>
                            </div>
                            {act.dateObtained && (
                                <div className="field date">
                                    <span className="text-muted" >{dayjs(act.dateObtained).fromNow()}  -  {dayjs(act.dateObtained).format('MMM D, YYYY [at] h:mm A')}</span>
                                </div>
                            )}
                        </div>
                    ))}
                    {/* {activityData.map((activity, index) => (
                        <div className="unit" key={index}>
                            {activity.avatar && (
                                <a className="avatar" href="#">
                                    <img
                                        src={activity.avatar}
                                        className="img-responsive"
                                        alt="profile"
                                    />
                                </a>
                            )}
                            <div className="field title">
                                {activity.title}
                            </div>
                            <div className="field date">
                                <span className="f-l">{activity.date}</span>
                                {activity.content && (
                                    <span className="f-r color-success">5 min ago</span>
                                )}
                            </div>
                            {activity.content && (
                                <div className="field">
                                    <p className="color-default decor-success">
                                        {activity.content}
                                    </p>
                                </div>
                            )}
                            {activity.photos && (
                                <div className="field photo">
                                    {activity.photos.map((photo, photoIndex) => (
                                        <img key={photoIndex} src={photo} alt="profile" />
                                    ))}
                                </div>
                            )}
                            {activity.photos && (
                                <div className="field photo">
                                    <img
                                        src={activity.photo}
                                        className="img-responsive"
                                        alt="profile"
                                    />
                                </div>
                            )}
                            <div className="field btn-group-xs f-l">
                                <button type="button" className="btn btn-lg-xs btn-xs-like">
                                    Like
                                </button>
                                <button type="button" className="btn btn-lg-xs btn-xs-love">
                                    Love
                                </button>
                                {activity.content && (
                                    <button type="button" className="btn btn-lg-xs btn-xs-msg">
                                        Message
                                    </button>
                                )}
                            </div>
                        </div>
                    ))} */}
                </div>
            </div>
        </div>
    );
}

export default Activities;