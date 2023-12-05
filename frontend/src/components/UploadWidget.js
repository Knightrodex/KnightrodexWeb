import { useEffect, useRef } from "react";
import axios from 'axios';

const UploadWidget = (props) => {
    const cloudinaryRef = useRef();
    const widgetRef = useRef();

    useEffect(() => {
        cloudinaryRef.current = window.cloudinary;
        widgetRef.current = cloudinaryRef.current.createUploadWidget({
            cloudName: 'knightrodex',
            uploadPreset: 'uw3wr3ru'
        }, function(error, result) {
            if (result.info.secure_url != null) {
                axios.post('https://knightrodex-49dcc2a6c1ae.herokuapp.com/api/updateprofilepicture', {
                    userId: props.uId, 
                    profilePicture: result.info.secure_url, 
                    jwtToken: props.jwt
                })
                    .then((response) => {
                        window.location.reload();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        })
    }) 

    return (
        <button type="button" className="btn btn-outline-dark" data-mdb-ripple-color="dark" style={{ zIndex: '1' }} onClick={() => widgetRef.current.open()}>
            Edit Picture
        </button>
    );
}
 
export default UploadWidget;