import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
 


function VerifyUserPage() {
  // Extract userId from URL using useParams
  const [ queryParameters ] = useSearchParams();
  const [ userId, setUserId ] = useState("");
  const [ isLoading , setIsLoading ] = useState(true);
  const navigate = useNavigate();

  

  useEffect(() => {

    setIsLoading(true);
    setUserId(queryParameters.get("userId"));
 
    // Make API request to verify user
    fetch('https://knightrodex-49dcc2a6c1ae.herokuapp.com/api/verifyuser', {
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
          setIsLoading(false);
          console.log('User verified successfully:', data);

          // wait 1.5 seconds before redirecting
          setTimeout(() => {
            navigate('/');
          }, 2000);
        }
      })
      .catch((error) => {
        console.error('API request failed:', error);
        // Handle error in UI if needed
      });
  }, [userId]); // Include userId in the dependency array to run the effect when userId changes

  return (
    <div className="text-center" style={{ marginTop: '50vh', transform: 'translateY(-50%)' }}>
      {(isLoading) ? <h2>Verifying Email ...</h2> : <h2>Email verified, redirecting ...</h2>}
    </div>
  );
}

export default VerifyUserPage;
