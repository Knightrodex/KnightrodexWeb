import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
 


function VerifyUserPage() {
  // Extract userId from URL using useParams
  const { userId } = useParams();
  const navigate = useNavigate();

  console.log("userId-- " + userId); //isdgbfibsdjkbfksbksdbjksdbkbdkj------------------------

  useEffect(() => {
    // Make API request to verify user
    fetch('/api/verifyuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the API response
        if (data.error) {
          console.error('Error verifying user:', data.error);
          // Handle error in UI if needed
        } else {
          console.log('User verified successfully:', data);
        
          // Update your UI or perform any other actions on successful verification
          navigate('/HomePage');

        }
      })
      .catch((error) => {
        console.error('API request failed:', error);
        // Handle error in UI if needed
      });
  }, [userId]); // Include userId in the dependency array to run the effect when userId changes

  return (
    <div className="text-center" style={{ marginTop: '50vh', transform: 'translateY(-50%)' }}>
      <h2>Verifying Email....</h2>
    </div>
  );
}

export default VerifyUserPage;
