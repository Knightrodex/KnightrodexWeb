const { ObjectId } = require('mongodb');
var md5 = require('./md5')
require('express');
require('mongodb');

exports.setApp = function ( app, client ) 
{
    app.post('/api/login', async (req, res, next) => 
    {
      // incoming: login, password
      // outgoing: id, firstName, lastName, error
    
      let error = '';
    
      const { email, password } = req.body;
      let hashPassword = md5(password);
    
      const db = client.db('Knightrodex');
      const results = await db.collection('User').find({email:email,password:hashPassword}).toArray();
    
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
      else
      {
        error = 'Invalid credentials';
      }
    
      let ret = { _id:id, email: em, firstName:fn, lastName:ln, error:error};
      res.status(200).json(ret);
    });

    app.post('/api/signup', async (req, res, next) =>
    {
        // incoming: first name, last name, email, password
        // outgoing: userID, first name, last name

        let error = '';
        let newId = -1;

        const {firstName, lastName, email, password} = req.body;

        const hashPassword = md5(password);

        const newUser = {password:hashPassword, email:email, badgesObtained:[], 
                         firstName:firstName, lastName:lastName, profilePicture:null, 
                         usersFollowed:null, dateCreated:(new Date())};

        try
        {
          const db = client.db('Knightrodex');

          const existingUser = await db.collection('User').find({email:email}).toArray();
          if (existingUser.length > 0)
          {
            error = 'User with the given email already exists';
          }
          else
          {
            const result = await db.collection('User').insertOne(newUser);
            newId = result.insertedId;
          }
        }
        catch (e)
        {
          error = e.toString();
        }

        let ret = {_id:newId, firstName:firstName, lastName:lastName, error:error};
        res.status(200).json(ret);
    });

    app.post('/api/badge', async (req, res, next) => {
      const { userId, badgeId } = req.body;
      console.log(req.body);
      console.log(userId);
      console.log(badgeId);
      const db = client.db('Knightrodex');
      const badgeInfo = await db.collection('Badge').find({ _id: new ObjectId(badgeId) }).toArray();
      console.log(badgeInfo);

      const userCollection = db.collection('User');

      try {
        // Assuming you have a 'badges' collection
          if (badgeInfo)
          {
            const badgeToAdd = {badgeId: new ObjectId(badgeId), dateObtained: new Date(), uniqueNumber: 1};
            const userInfo = await db.collection('User').find({ _id: new ObjectId(userId) }).toArray();
            console.log(userInfo);
            userCollection.updateOne(
              { _id: new ObjectId(userId) },
              { $push: {"badgesObtained": badgeToAdd }})

              res.json(badgeInfo);
          }
          else
          {
            res.status(404).json({ message: 'Badge not found'});
          }
        }
        catch (error){
          console.error(error);
          res.status(500).json({error: 'Internal server error'});
        }
    });
}