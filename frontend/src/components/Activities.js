import React, { useEffect, useState } from 'react';
import './Activities.css';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import { AdvancedImage } from '@cloudinary/react';
import { crop } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { Cloudinary } from "@cloudinary/url-gen";

function Activities({ userActivity }) {
    dayjs.extend(relativeTime);

    const cld = new Cloudinary({
        cloud: {
            cloudName: 'knightrodex'
        }
    });
    
    const getPublicID = (link) => {
        const regex = /upload\/(?:v\d+\/)?([^\.]+)/;
        const match = link.match(regex);
        return match[1];
    }

    const configurePfp = (link) => {
        const pfp = cld.image(getPublicID(link));
        pfp.resize(crop().width(800).height(800).gravity(autoGravity()));
        return pfp;
    }

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
                                    <AdvancedImage cldImg={configurePfp(act.profilePicture)} />
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
                </div>
            </div>
        </div>
    );
}

export default Activities;