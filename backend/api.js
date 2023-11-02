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

    // TO-DO: Return correct values
    app.post('/api/showuserprofile', async (req, res) => 
    {
      // incoming: userId
      // outgoing: userId, first/last name, pfp, usersFollowing, badges collected

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

    app.post('/api/searchemail', async (req, res) => 
    {
      // incoming: email (partial)
      // outgoing: all user info whose email matches partial email

      const partialEmail = req.body.email;

      const db = client.db('Knightrodex');
      const collection = db.collection('User');

      let response = {result: [], error: ''};

      try 
      {
        const result = await collection.find({ email: { $regex: `${partialEmail}`, $options: 'i'}}).toArray();
        response.result = result;
        res.status(200).json(response);
      }
      catch (error) 
      {
        response.error = error.toString();
        res.status(500).json(response);
      }
    });

    app.post('/api/followuser', async (req, res) => 
    {
      // incoming: currentUserId, otherUserId
      // outgoing: success boolean

      const { currentUserId, otherUserId } = req.body;

      let response = {success: false, error: ''};

      // Verify User IDs are valid ObjectIds
      if (!ObjectId.isValid(currentUserId))
      {
        response.error = 'currentUserId is not a valid ObjectId';
        res.status(500).json(response);
        return;
      }
      else if (!ObjectId.isValid(otherUserId))
      {
        response.error = 'otherUserId is not a valid ObjectId';
        res.status(500).json(response);
        return;
      }

      // Ensure user does not try to follow themself
      if (currentUserId === otherUserId)
      {
        response.error = 'currentUserId cannot equal otherUserId';
        res.status(500).json(response);
        return;
      }

      const db = client.db('Knightrodex');
      const userCollection = db.collection('User');

      // Find both users in the collection
      const currentUser = await userCollection.findOne({ _id: new ObjectId(currentUserId) });
      const otherUser = await userCollection.findOne({ _id: new ObjectId(otherUserId) });

      // Verify both users exist in database
      if (currentUser == null)
      {
        response.error = 'Current User Not Found';
        res.status(500).json(response);
        return;
      }
      else if (otherUser == null)
      {
        response.error = 'Other User Not Found'
        res.status(500).json(response);
        return;
      }

      try
      {
        // If current user is not following other user, add other user to current user's usersFollowed list
        if (currentUser.usersFollowed.some(userId => userId.equals(otherUserId)))
        {
          response.error = 'Current User Already Follows Other User';
          res.status(200).json(response);
        }
        else
        {
          userCollection.updateOne(
            { _id: new ObjectId(currentUserId) },
            { $push: {"usersFollowed": new ObjectId(otherUserId)}}
          );

          response.success = true;
          res.status(200).json(response);
        }
      }
      catch (error)
      {
        response.error = error.toString();
        res.status(500).json(response);
      }
      
    });

    app.post('/api/unfollowuser', async (req, res) => 
    {
      // incoming: currentUserId, otherUserId
      // outgoing: success boolean

      const { currentUserId, otherUserId } = req.body;

      let response = {success: false, error: ''};

      // Verify User IDs are valid ObjectIds
      if (!ObjectId.isValid(currentUserId))
      {
        response.error = 'currentUserId is not a valid ObjectId';
        res.status(500).json(response);
        return;
      }
      else if (!ObjectId.isValid(otherUserId))
      {
        response.error = 'otherUserId is not a valid ObjectId';
        res.status(500).json(response);
        return;
      }

      // Ensure user does not try to unfollow themself
      if (currentUserId === otherUserId)
      {
        response.error = 'currentUserId cannot equal otherUserId';
        res.status(500).json(response);
        return;
      }

      const db = client.db('Knightrodex');
      const userCollection = db.collection('User');

      // Find both users in the collection
      const currentUser = await userCollection.findOne({ _id: new ObjectId(currentUserId) });
      const otherUser = await userCollection.findOne({ _id: new ObjectId(otherUserId) });

      // Verify both users exist in database
      if (currentUser == null)
      {
        response.error = 'Current User Not Found';
        res.status(500).json(response);
        return;
      }
      else if (otherUser == null)
      {
        response.error = 'Other User Not Found'
        res.status(500).json(response);
        return;
      }

      try
      {
        // If current user is not following other user, add other user to current user's usersFollowed list
        if (currentUser.usersFollowed.some(userId => userId.equals(otherUserId)))
        {
          userCollection.updateOne(
            { _id: new ObjectId(currentUserId) },
            { $pull: {"usersFollowed": new ObjectId(otherUserId)}}
          );

          response.success = true;
          res.status(200).json(response);
        }
        else
        {
          response.error = 'Current User is not Following Other User';
          res.status(200).json(response);
        }
      }
      catch (error)
      {
        response.error = error.toString();
        res.status(500).json(response);
      }
      
    });

    app.post('/api/gethints', async (req, res) => 
    {
      // incoming: userId
      // outgoing: array of hints for badges user does not have

      const userId = req.body.userId;

      let response = {hints: [], error: ''};

      // Verify userId is a valid ObjectId
      if (!ObjectId.isValid(userId))
      {
        response.error = 'userId is not a valid ObjectId';
        res.status(500).json(response);
        return;
      }

      const db = client.db('Knightrodex');
      const userCollection = db.collection('User');
      const user = await userCollection.findOne({_id: new ObjectId(userId)});
      const badgeCollection = db.collection('Badge');
      const allBadges = await badgeCollection.find().toArray(); // Return all badges in collection as array

      // Verify User exists in database
      if (user == null)
      {
        response.error = 'User Not Found';
        res.status(404).json(response);
        return;
      }

      try
      {
        // Iterate through all the badges in the Badge collection
        for (const badge of allBadges)
        {
          // If the user does not have the badge, add the badge's hint to the response
          if (!user.badgesObtained.some(userBadge => userBadge.badgeId.equals(badge._id)))
          {
            response.hints.push(badge.hint);
          }
        };

          res.status(200).json(response);
      }
      catch (error)
      {
        response.error = error.toString();
        res.status(500).json(response);
      }

    });

    app.post('/api/getactivity', async (req, res) => 
    {
      const userId = req.body.userId;

      let response = {activity: [], error: ''};

      // Verify userId is valid ObjectId
      if (!ObjectId.isValid(userId))
      {
        response.error = 'userId is not a valid ObjectId';
        res.status(500).json(response);
        return;
      }

      const db = client.db('Knightrodex');
      const userCollection = db.collection('User');
      const currUser = await userCollection.findOne({ _id: new ObjectId(userId) });

      if (currUser == null)
      {
        response.error = 'User Not Found';
        res.status(500).json(response);
        return;
      }

      try
      {
        // Iterate through all followed users
        for (const followedUserId of currUser.usersFollowed) 
        {
          // Verify followedUserId is a valid ObjectId
          if (!ObjectId.isValid(followedUserId))
          {
            response.error = 'Followed User ID not a valid ObjectId'
            res.status(500).json(response);
            return;
          }

          const followedUser = await userCollection.findOne({ _id: followedUserId });

          // Verify Followed User is in database
          if (followedUser == null)
          {
            response.error = 'Followed User Not Found';
            res.status(500).json(response);
            return;
          }

          // Iterate through the followed user's badges and add data to the activity list
          for (const badgeCollected of followedUser.badgesObtained)
          {
            const activityInfo = {firstName: followedUser.firstName, lastName: followedUser.lastName,
                                  badgeId: badgeCollected.badgeId, dateObtained: badgeCollected.dateObtained};
            response.activity.push(activityInfo);
          };

          // Sort the data based on the date the badge was obtained (reverse chronological order)
          response.activity.sort((a, b) =>
          {
            return b.dateObtained - a.dateObtained;
          })
        };

        res.status(200).json(response);

      }
      catch (error)
      {
        response.error = error.toString();
        res.status(500).json(response);
      }

    });
}