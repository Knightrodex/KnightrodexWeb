import React from 'react';
//import 'bootstrap/dist/css/bootstrap.css';
import './Activities.css';

function Activities() {
    const activityData = [
        {
            avatar: "https://bootdey.com/img/Content/avatar/avatar6.png",
            title: "Alexander Herthic started following Katya Angintiew",
            date: "Today 6:15 pm - 22.03 2015",
        },
        {
            avatar: "https://bootdey.com/img/Content/avatar/avatar1.png",
            title: "Katya Angintiew posted a new blog",
            date: "Today 5:60 pm - 12.06.2016",
        },
        {
            avatar: "https://bootdey.com/img/Content/avatar/avatar2.png",
            title: "Alexander Herthic posted message on Monica Smith site",
            date: "Today 2:10 pm - 12.06.2015",
            content:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. Over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        },
        {
            title: "Katya Angintiew add 1 photo on Monica Smith site",
            date: "Today 5:60 pm - 12.06.2016",
            photos: [
                "https://www.bootdey.com/image/266x200/",
                "https://www.bootdey.com/image/266x200/",
                "https://www.bootdey.com/image/266x200/",
            ],
        },
        {
            avatar: "https://bootdey.com/img/Content/avatar/avatar4.png",
            title: "Alexander Herthic posted message on Monica Smith site",
            date: "Today 2:10 pm - 12.06.2015",
            content:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. Over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        },
        {
            avatar: "https://bootdey.com/img/Content/avatar/avatar1.png",
            title: "Katya Angintiew posted a new blog",
            date: "Today 5:60 pm - 12.06.2016",
        },
        {
            avatar: "https://bootdey.com/img/Content/avatar/avatar2.png",
            title: "Alexander Herthic started following Katya Angintiew",
            date: "Today 6:15 pm - 22.03 2015",
        },
        {
            avatar: "https://bootdey.com/img/Content/avatar/avatar3.png",
            title: "Katya Angintiew posted a new blog",
            date: "Today 5:60 pm - 12.06.2016",
        },
        {
            avatar: "https://bootdey.com/img/Content/avatar/avatar4.png",
            title: "Alexander Herthic posted message on Monica Smith site",
            date: "Today 2:10 pm - 12.06.2015",
            content:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. Over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        },
        {
            avatar: "https://bootdey.com/img/Content/avatar/avatar1.png",
            title: "Alexander Herthic posted message on Monica Smith site",
            date: "Today 2:10 pm - 12.06.2015",
            content:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s. Over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        },
        {
            avatar: "https://bootdey.com/img/Content/avatar/avatar4.png",
            title: "Katya Angintiew posted a new blog",
            date: "Today 5:60 pm - 12.06.2016",
        },
        {
            avatar: "https://bootdey.com/img/Content/avatar/avatar5.png",
            title: "Katya Angintiew posted a new blog",
            date: "Today 5:60 pm - 12.06.2016",
        },

    ];

    return (
        <div className="container bootstrap snippets bootdeys custom-body">
            <div className="col-md-12 col-right">
                <div
                    className="col-inside-lg decor-default activities"
                    id="activities"
                    style={{ overflowY: "hidden", outline: "none" }}
                    tabIndex={5003}
                >
                    <h6>Activities</h6>
                    {activityData.map((activity, index) => (
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
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Activities;