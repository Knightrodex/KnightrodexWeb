import React, { useEffect } from 'react';
  
function VerifyUserPage() {

    useEffect(() => {
        // TODO - replace with actual userID
        const userId = 'your_actual_user_id';

        // Make API request to verify user
        fetch('/api/verifyuser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        })
        .then(response => response.json())
        .then(data => {
            // Handle the API response
            if (data.error) {
                console.error('Error verifying user:', data.error);
                // Handle error in UI if needed
            } else {
                console.log('User verified successfully:', data);
                // Update your UI or perform any other actions on successful verification
            }
        })
        .catch(error => {
            console.error('API request failed:', error);
            // Handle error in UI if needed
        });
    }, []); // Empty dependency array to run the effect only once when the component mounts

    return (
        <div className="text-center" style={{ marginTop: '50vh', transform: 'translateY(-50%)' }}>
            <h2>Verifying Email....</h2>
        </div>
    );

}

export default VerifyUserPage;
