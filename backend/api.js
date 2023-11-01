const { ObjectId } = require('mongodb');
require('express');
require('mongodb');

exports.setApp = function ( app, client ) 
{
    app.post('/api/login', async (req, res) => 
    {
      // incoming: login, password
      // outgoing: id, firstName, lastName, error
    
      let error = '';
    
      const { email, password } = req.body;
    
      const db = client.db('Knightrodex');
      const results = await db.collection('User').find({email:email,password:password}).toArray();
    
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

    app.post('/api/signup', async (req, res) =>
    {
        // incoming: first name, last name, email, password
        // outgoing: userID, first name, last name

        let error = '';
        let newId = null;

        const {firstName, lastName, email, password} = req.body;

        const newUser = {password:password, email:email, badgesObtained:[], 
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

    app.post('/api/addbadge', async (req, res) => 
    {
      // incoming: userId, badgeId
      // outgoing: badgeId, dateObtained, uniqueNumber

      let response = {badgeId: null, dateObtained: null, uniqueNumber: null, error: ''};

      const { userId, badgeId } = req.body;

      if (!ObjectId.isValid(userId))
      {
        response.error = 'userId is not a valid ObjectId'
        res.status(500).json(response);
        return;
      }

      if (!ObjectId.isValid(badgeId))
      {
        response.error = 'badgeId is not a valid ObjectId'
        res.status(500).json(response);
        return;
      }
      
      try 
      {
          const db = client.db('Knightrodex');
          const badgeCollection = db.collection('Badge');
          const userCollection = db.collection('User');

          const badgeInfo = await badgeCollection.findOne({ _id: new ObjectId(badgeId) });
          const userInfo = await userCollection.findOne({ _id: new ObjectId(userId) });

          // Verify User and Badge exist in database
          if (badgeInfo == null)
          {
            response.error = 'Badge not Found';
            res.status(404).json(response);
            return;
          }
          else if (userInfo == null)
          {
            response.error = 'User not found';
            res.status(404).json(response);
            return;
          }

          // Verify badge hasn't been collected to its limit
          if (badgeInfo.numObtained < badgeInfo.limit)
          {
            const badgeToAdd = {badgeId: new ObjectId(badgeId), dateObtained: new Date(), uniqueNumber: (badgeInfo.numObtained + 1)};

            // Ensure User does not add a badge they already have
            if (userInfo.badgesObtained.some(badge => badge.badgeId.equals(badgeToAdd.badgeId)))
            {
              response.error = 'User already has Badge';
              res.status(200).json(response);
              return;
            }

            // Update response values
            response.badgeId = badgeToAdd.badgeId;
            response.dateObtained = badgeToAdd.dateObtained;
            response.uniqueNumber = badgeToAdd.uniqueNumber;
            
            // Add badge to user's badge collection list
            userCollection.updateOne(
              { _id: new ObjectId(userId) },
              { $push: {"badgesObtained": badgeToAdd }});

            // Increment the numObtained for the given badge
            badgeCollection.updateOne(
              { _id: new ObjectId(badgeId) },
              { $set: {"numObtained": (badgeInfo.numObtained + 1)}});

              res.status(200).json(response);
          }
          else
          {
            response.error = 'Badge collection limit exceeded';
            res.status(200).json(response);
          }
        }
        catch (error)
        {
          response.error = error.toString();
          res.status(500).json(response);
        }
    });

    app.post('/api/showuserprofile', async (req, res) => 
    {
      const userId  = req.body._id;
      let error = '';

      // Verify userId is a valid ObjectId
      if (!ObjectId.isValid(userId))
      {
        res.status(500).json({error: 'userId is not a valid ObjectId'});
        return;
      }

      const db = client.db('Knightrodex');
      const userCollection = db.collection('User');
      const user = await userCollection.findOne({ _id: new ObjectId(userId) });

      if (user == null) 
      {
        res.status(404).json({error: 'userId not found'})
        return;
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

    app.post('/api/searchemail', async (req, res) => 
    {
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
        res.status(500).json({ error: error.toString()});
      }
    });

    app.post('/api/followuser', async (req, res) => 
    {
      const { currentUserId, otherUserId } = req.body;

      // Verify User IDs are valid ObjectIds
      if (!ObjectId.isValid(currentUserId))
      {
        res.status(500).json({error: 'currentUser is not a valid ObjectId'});
        return;
      }
      else if (!ObjectId.isValid(otherUserId))
      {
        res.status(500).json({error: 'otherUser is not a valid ObjectId'});
        return;
      }

      const db = client.db('Knightrodex');
      const userCollection = db.collection('User');

      // Find both users in the collection
      const currentUser = await userCollection.findOne({ _id: new ObjectId(currentUser) });
      const otherUser = await userCollection.findOne({ _id: new ObjectId(otherUser) });

      // Verify both users exist in database
      if (currentUser == null)
      {
        res.status(500).json({error: 'Current User Not Found'});
        return;
      }
      else if (otherUser == null)
      {
        res.status(500).json({error: 'Other User Not Found'});
        return;
      }

      // If current user is not following other user, add other user to current user's usersFollowed list
      if (currentUser.usersFollowed.includes(new ObjectId(otherUser)))
      {
        res.status(200).json({message: 'Current User Already Follows Other User'});
      }
      else
      {
        const userToAdd = {_id: new ObjectId(otherUserId)};
        userCollection.updateOne(
          { _id: new ObjectId(currentUserId) },
          { $push: {"usersFollowed": userToAdd}}
        );
      }



      // if statements to check if current user exists
      // if statement to check if other user exists
      // add other user to current user an then return 200
      // else return fail

    });
}