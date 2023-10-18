require('express');
require('mongodb');

// TODO: connect heroku finish steps in B, create client for DB, fix fetches
exports.setApp = function ( app, client ) 
{
    app.post('/api/login', async (req, res, next) => 
    {
      // incoming: login, password
      // outgoing: id, firstName, lastName, error
    
     let error = '';
    
      const { email, password } = req.body;
    
      const db = client.db('Knightrodex');
      const results = await db.collection('User').find({email:email,password:password}).toArray();
    
      let id = -1;
      let em = '';
      let fn = '';
      let ln = '';
      
      if( results.length > 0 )
      {
        em = results[0].email;
        id = results[0]._id;
        fn = results[0].firstName;
        ln = results[0].lastName;
      }
    
      let ret = { _id:id, email: em, firstName:fn, lastName:ln, error:''};
      res.status(200).json(ret);
    });

    app.post('/api/signup', async (req, res, next) =>
    {
        // incoming: first name, last name, email, password
        // outgoing: first name, last name, UserID

        let error = '';

        const {firstName, lastName, email, password} = req.body;
        const newUser = {password:password, email:email, badgesObtained:null, 
                         firstName:firstName, lastName:lastName, profilePicture:null, 
                         usersFollowed:null, dateCreated:(new Date())};

        try
        {
          const db = client.db('Knightrodex');
          var result = db.collection('User').insertOne(newUser);
          console.log("UserID: " + result.insertedId);
        }
        catch (e)
        {
          error = e.toString();
        }

        var ret = {firstName:firstName, lastName:lastName, userID:result.insertedId, error:error};
        res.status(200).json(ret);
        
    })
}