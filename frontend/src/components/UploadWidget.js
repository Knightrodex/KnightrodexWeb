import { useEffect, useRef } from "react";
import axios from 'axios';
import { response } from "express";

const UploadWidget = () => {
    const cloudinaryRef = useRef();
    const widgetRef = useRef();

    useEffect(() => {
        cloudinaryRef.current = window.cloudinary;
        widgetRef.current = cloudinaryRef.current.createUploadWidget({
            cloudName: 'knightrodex',
            uploadPreset: 'uw3wr3ru'
        }, function(error, result) {
            console.log(result);

            // if (result.info.secure_url !== null) {
            //     axios.post('https://knightrodex-49dcc2a6c1ae.herokuapp.com/api/updateprofilepicture', {
            //         userId: uId, 
            //         profilePicture: result.info.secure_url, 
            //         jwtToken: jwt
            //     })
            //         .then((response) => {
            //             console.log(response);
            //         })
            //         .catch(err => {
            //             console.log(err);
            //         });
            // }

        });
    }, []);

    return (
        <button onClick={() => widgetRef.current.open()}>
            Upload
        </button>
    );
}
 
export default UploadWidget;