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
    
      let id = null;
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
        let newId = null;

        const {firstName, lastName, email, password} = req.body;

        const hashPassword = md5(password);

        const newUser = {password:hashPassword, email:email, badgesObtained:[], 
                         firstName:firstName, lastName:lastName, profilePicture:null, 
                         usersFollowed:[], dateCreated:(new Date())};

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

    app.post('/api/addbadge', async (req, res, next) => 
    {
      // incoming: userId, badgeId
      // outgoing: badgeId, dateObtained, uniqueNumber

      const { userId, badgeId } = req.body;

      if (!ObjectId.isValid(userId))
      {
        res.status(500).json({error:"userId is not a valid ObjectId"});
        return;
      }

      if (!ObjectId.isValid(badgeId))
      {
        res.status(500).json({error:"badgeId is not a valid ObjectId"});
        return;
      }
      
      try 
      {
          const db = client.db('Knightrodex');
          const badgeCollection = db.collection('Badge');
          const userCollection = db.collection('User');

          const badgeInfo = await badgeCollection.findOne({ _id: new ObjectId(badgeId) });
          const userInfo = await userCollection.findOne({ _id: new ObjectId(userId) });

          if (badgeInfo == null)
          {
            res.status(404).json({error: "Badge not found"});
            return;
          }

          if (userInfo == null)
          {
            res.status(404).json({error: "User not found"})
            return;
          }

          if (badgeInfo.numObtained < badgeInfo.limit)
          {
            // increment badge count in the badge collection then add to badgeToAdd
            const badgeToAdd = {badgeId: new ObjectId(badgeId), dateObtained: new Date(), uniqueNumber: 1}; // CHANGE UNIQUE NUMBER
            userCollection.updateOne(
              { _id: new ObjectId(userId) },
              { $push: {"badgesObtained": badgeToAdd }})
              
              // Increment badge's numObtained

              res.status(200).json(badgeToAdd);
          }
          else
          {
            res.status(200).json({ error: 'Badge limit exceeded'});
          }
        }
        catch (error)
        {
          res.status(500).json({error: error.toString()});
        }
    });

    app.post('/api/showuserprofile', async (req, res) => {
      const userId  = req.body._id;
      let error = '';

      const db = client.db('Knightrodex');
      const userCollection = db.collection('User');
      const user = await userCollection.findOne({ _id: new ObjectId(userId) }); // does this need to be swapped?
      console.log(userId);

      if (!user) {
        error = 'User Not Found';
      }

      
      const response = {
        userId: user?._id || null,
        firstName: user?.firstName || null,
        lastName: user?.lastName || null,
        profilePicture: user?.profilePicture || null,
        usersFollowed: user?.usersFollowed || [],
        badgesInfo: user?.badgesInfo || [],
        collectedBadges: user?.collectedBadges || [],
        error: error
      };

      res.status(200).json(response);
    })

    app.post('/api/searchemail', async (req, res) => {
      const db = client.db('Knightrodex');
      const collection = db.collection('User');
      const partialEmail = req.body.email;

      try 
      {
        const result = await collection.find({ email: { $regex: `${partialEmail}`, $options: 'i'}}).toArray();
        res.json(result);
      }
      catch (error) 
      {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error'});
      }
    })
}