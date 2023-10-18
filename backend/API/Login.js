import React, { useState } from 'react';
require('express');
require('mongodb');
// TODO: connect heroku finish steps in B, create client for DB, fix fetches

function Login()
{
  let email;
  let password;
  let bp = require('./Path.js');

  const [message, setMessage] = useState('');

  const app_name = 'knightrodex-49dcc2a6c1ae'
  function buildPath(route)
  {
    if (process.env.NODE_ENV === 'production') 
    {
        return 'https://' + app_name +  '.herokuapp.com/' + route;
    }
    else
    {        
        return 'http://localhost:5000/' + route;
    }
  }

  
  const doLogin = async event => 
  {
      event.preventDefault();

      let obj = {login:email.value,password:password.value};
      let js = JSON.stringify(obj);

      try
      {    
          const response = await fetch(bp.buildPath('API/Login'),
              {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

          let res = JSON.parse(await response.text());

          if( res._id <= 0 )
          {
              setMessage('User/Password combination incorrect');
          }
          else
          {
              let user = {firstName:res.firstName,lastName:res.lastName,_id:res._id}
              localStorage.setItem('user_data', JSON.stringify(user));

              setMessage('');
              window.location.href = '/KnightrodexWeb';
          }
      }
      catch(e)
      {
          alert(e.toString());
          return;
      }    
  };



    return(
      <div id="loginDiv">
        <form onSubmit={doLogin}>
        <span id="inner-title">PLEASE LOG IN</span><br />
        <input type="text" id="loginName" placeholder="Username" 
          ref={(c) => loginName = c} />
        <input type="password" id="loginPassword" placeholder="Password" 
          ref={(c) => loginPassword = c} />
        <input type="submit" id="loginButton" class="buttons" value = "Do It"
          onClick={doLogin} />
        </form>
        <span id="loginResult">{message}</span>
     </div>
    );
};

export default Login;
