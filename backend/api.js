const { ObjectId } = require('mongodb');
require('express');
require('mongodb');
const token = require('../createJWT');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SG_API_KEY);

// Status Codes:
// 200: Ok
// 400: ID is not a valid ObjectId
// 400: Invalid Login Credentials
// 404: ID not found in database
// 500: Badge has been collected to limit
// 500: User already has badge in account
// 500: User tries to follow/unfollow themself
// 500: User already follows other user
// 500: User is already not following other user
// 500: Internal Server Error

exports.setApp = function( app, client ) 
{
    const db = client.db('Knightrodex');
    const userCollection = db.collection('User');
    const badgeCollection = db.collection('Badge');

    // Check if a given id is a valid ObjectId
    // Sends Error 400: ID is not a valid ObjectId with whatever response given
    function isValidId(id, response, res)
    {
      if (!ObjectId.isValid(id))
      {
        response.error = "ID is not a valid ObjectId";
        res.status(400).json(response);
        return false;
      }

      return true;
    }

    // Use email verification with SendGrid API
    function verifyEmail(email, response, res)
    {
      const msg = {
        to: email, // Change to your recipient
        from: 'knightrodex@outlook.com', // Change to your verified sender
        subject: 'Knightrodex Verify Email',
        text: 'Click this link to verify your email! ',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      }
      sgMail
        .send(msg)
        .then(() => 
        {
          console.log('Verification Email Sent!')
          res.status(200).json(response);
        })
        .catch((error) => 
        {
          response.error = error.toString();
          res.status(400).json(response);
        })
    }

    // check if a given JWT is expired
    function isTokenExpired(jwtToken, response, res)
    {
      if (token.isExpired(jwtToken))
      {
        response.error = 'JWT is no longer valid';
        res.status(500).json(response);
        return true;
      }

      return false;
    }

    app.post('/api/login', async (req, res) => 
    {
      // incoming: login, password (hashed)
      // outgoing: id, firstName, lastName, error
    
      const { email, password } = req.body;

      let response = { jwtToken:'', error:'' }

      try
      {
        const user = await userCollection.findOne({ email:email, password:password });

        // User with given credentials exists
        if(user != null)
        {
          response = token.createToken(user._id, user.firstName, user.lastName, user.email);
          res.status(200).json(response);
        }
        // Error 400: Invalid Credentials
        else
        {
          response.error = 'Invalid credentials';
          res.status(400).json(response);
        }
      }
      catch (error)
      {
        response.error = error.toString();
        res.status(500).json(response);
      }
    });

    app.post('/api/signup', async (req, res) => 
    {
        // incoming: first name, last name, email, password
        // outgoing: userID, first name, last name

        const { firstName, lastName, email, password } = req.body;

        let response = { accessToken:'', error:'' };

        const newUser = { password:password, email:email, badgesObtained:[], 
                          firstName:firstName, lastName:lastName, profilePicture:null, 
                          usersFollowed:[], dateCreated:(new Date()) };

        try
        {
          const existingUser = await userCollection.findOne({ email:email });

          // Error 404: User with given email already exists
          if (existingUser != null)
          {
            response.error = 'User with the given email already exists';
            res.status(404).json(response);
          }
          // Insert new user into the database
          else
          {
            const result = await userCollection.insertOne(newUser);
            response = token.createToken(result._id, result.firstName, result.lastName, result.email);
            verifyEmail(email, response, res);
            res.status(200).json(response);
          }
        }
        catch (e)
        {
          response.error = e.toString();
          res.status(500).json(response);
        }
    });

    app.post('/api/addbadge', async (req, res) => 
    {
      // incoming: userId, badgeId
      // outgoing: badgeId, dateObtained, uniqueNumber

      let response = {badgeInfo:{}, dateObtained:'', uniqueNumber:-1, jwtToken:'', error:''};

      const { userId, badgeId, jwtToken } = req.body;

      if (isTokenExpired(jwtToken, response, res))
      {
        return;
      }

      // Verify IDs are valid ObjectIds
      if (!isValidId(userId, response, res) || !isValidId(badgeId, response, res))
      {
        return;
      }
      
      try 
      {
          response.jwtToken = token.refresh(jwtToken);

          const badgeInfo = await badgeCollection.findOne({ _id:new ObjectId(badgeId) });
          const userInfo = await userCollection.findOne({ _id:new ObjectId(userId) });

          // Error 404: ID not found in database
          if (badgeInfo == null)
          {
            response.error = 'Badge not Found';
            res.status(404).json(response);
            return;
          }
          else if (userInfo == null)
          {
            response.error = 'User not Found';
            res.status(404).json(response);
            return;
          }

          // Verify badge hasn't been collected to its limit
          if (badgeInfo.numObtained < badgeInfo.limit)
          {
            const badgeToAdd = {badgeId:(new ObjectId(badgeId)), dateObtained:(new Date()), uniqueNumber:(badgeInfo.numObtained + 1)};

            // Ensure User does not add a badge they already have
            if (userInfo.badgesObtained.some(badge => badge.badgeId.equals(badgeToAdd.badgeId)))
            {
              response.error = 'User already has Badge';
              res.status(500).json(response);
              return;
            }

            // Update response values
            response.badgeInfo = badgeInfo;
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
            response.error = 'Badge collected to limit';
            res.status(500).json(response);
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
      // incoming: userId
      // outgoing: userId, first/last name, pfp, usersFollowing, info about badges collected

      const {userId, jwtToken }  = req.body;
      
      let response = {
        userId:null,
        firstName:'',
        lastName:'',
        profilePicture:'',
        usersFollowed:[],
        dateCreated:null,
        badgesCollected:[],
        jwtToken:'',
        error:''
      }

      if (isTokenExpired(jwtToken, response, res))
      {
        return;
      }

      if (!isValidId(userId, response, res))
      {
        return;
      }

      try
      {
        response.jwtToken = token.refresh(jwtToken);

        const user = await userCollection.findOne({ _id: new ObjectId(userId) });

        if (user == null) 
        {
          response.error = 'User ' + userId + ' Not Found';
          res.status(404).json(response);
          return;
        }

        response.userId = user._id;
        response.firstName = user.firstName;
        response.lastName = user.lastName;
        response.profilePicture = user.profilePicture;
        response.usersFollowed = user.usersFollowed;
        response.dateCreated = user.dateCreated;

        // Iterate through all of the user's collected badges
        for (const badgeCollected of user.badgesObtained)
        {
          if (!isValidId(badgeCollected.badgeId, response, res))
          {
            return;
          }

          const badgeInfo = await badgeCollection.findOne({ _id: badgeCollected.badgeId });

          // Verify badge is in database
          if (badgeInfo == null)
          {
            response.error = 'Badge ' + badgeId + ' Not Found';
            res.status(404).json(response);
            return;
          }

          // Add any relevant information about the badge
          const badgeCollectedInfo = {
            _id: badgeInfo._id,
            title: badgeInfo.title,
            location: badgeInfo.collection,
            dateCreated: badgeInfo.dateCreated,
            dateExpired: badgeInfo.dateExpired,
            description: badgeInfo.description,
            limit: badgeInfo.limit,
            badgeImage: badgeInfo.image,
            dateObtained: badgeCollected.dateObtained,
            uniqueNumber: badgeCollected.uniqueNumber
          }

          response.badgesCollected.push(badgeCollectedInfo);
        }

        res.status(200).json(response);
      }
      catch (error)
      {
        response.error = error.toString();
        res.status(500).json(response);
      }
    });

    app.post('/api/searchemail', async (req, res) => 
    {
      // incoming: email (partial)
      // outgoing: all user info whose email matches partial email

      const { partialEmail, jwtToken } = req.body.email;

      let response = { result:[], jwtToken:'', error:'' };

      if (isTokenExpired(jwtToken, response, res))
      {
        return;
      }

      try 
      {
        response.jwtToken = token.refresh(jwtToken);
        const result = await userCollection.find({ email:{$regex:`${partialEmail}`, $options:'i'} }).toArray();
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

      const { currentUserId, otherUserId, jwtToken } = req.body;

      let response = { jwtToken:'', error:'' };

      if (isTokenExpired(jwtToken, response, res))
      {
        return;
      }

      if (!isValidId(currentUserId, response, res) || !isValidId(otherUserId, response, res))
      {
        return;
      }

      // Ensure user does not try to follow themself
      if (currentUserId === otherUserId)
      {
        response.error = 'Current User cannot try to follow themself';
        res.status(500).json(response);
        return;
      }

      try
      {
        response.jwtToken = token.refresh(jwtToken);

        // Find both users in the collection
        const currentUser = await userCollection.findOne({ _id: new ObjectId(currentUserId) });
        const otherUser = await userCollection.findOne({ _id: new ObjectId(otherUserId) });

        // Verify both users exist in database
        if (currentUser == null)
        {
          response.error = 'User ' + currentUserId + ' Not Found';
          res.status(404).json(response);
          return;
        }
        else if (otherUser == null)
        {
          response.error = 'User ' + otherUserId + ' Not Found';
          res.status(404).json(response);
          return;
        }

        // If current user is not following other user, add other user to current user's usersFollowed list
        if (currentUser.usersFollowed.some(userId => userId.equals(otherUserId)))
        {
          response.error = 'User ' + currentUserId + 'Already Follows User ' + otherUserId;
          res.status(500).json(response);
        }
        else
        {
          userCollection.updateOne(
            { _id: new ObjectId(currentUserId) },
            { $push: {"usersFollowed": new ObjectId(otherUserId)}}
          );

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

      const { currentUserId, otherUserId, jwtToken } = req.body;

      let response = { jwtToken:'', error: '' };

      if (isTokenExpired(jwtToken))
      {
        return;
      }

      if (!isValidId(currentUserId, response, res) || !isValidId(otherUserId, response, res))
      {
        return;
      }

      // Ensure user does not try to unfollow themself
      if (currentUserId === otherUserId)
      {
        response.error = 'Current User cannot Unfollow themself';
        res.status(500).json(response);
        return;
      }

      try
      {
        response.jwtToken = token.refresh(jwtToken);

        // Find both users in the collection
        const currentUser = await userCollection.findOne({ _id: new ObjectId(currentUserId) });
        const otherUser = await userCollection.findOne({ _id: new ObjectId(otherUserId) });

        // Verify both users exist in database
        if (currentUser == null)
        {
          response.error = 'User ' + currentUserId + ' Not Found';
          res.status(404).json(response);
          return;
        }
        else if (otherUser == null)
        {
          response.error = 'User ' + otherUserId + ' Not Found';
          res.status(404).json(response);
          return;
        }

        // If current user is not following other user, add other user to current user's usersFollowed list
        if (currentUser.usersFollowed.some(userId => userId.equals(otherUserId)))
        {
          userCollection.updateOne(
            { _id: new ObjectId(currentUserId) },
            { $pull: {"usersFollowed": new ObjectId(otherUserId)}}
          );

          res.status(200).json(response);
        }
        else
        {
          response.error = 'Current User is not Following Other User';
          res.status(500).json(response);
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

      const { userId, jwtToken } = req.body;

      let response = { hints:[], jwtToken:'', error:''};

      if (isTokenExpired(jwtToken))
      {
        return;
      }

      if (!isValidId(userId, response, res))
      {
        return;
      }

      try
      {
        response.jwtToken = token.refresh(jwtToken);

        const user = await userCollection.findOne({_id: new ObjectId(userId)});
        const allBadges = await badgeCollection.find().toArray(); // Return all badges in collection as array

        // Verify User exists in database
        if (user == null)
        {
          response.error = 'User ' + userId + ' Not Found';
          res.status(404).json(response);
          return;
        }

        // Iterate through all the badges in the Badge collection
        for (const badge of allBadges)
        {
          // If the user does not have the badge, add the badge's hint to the response
          if (!user.badgesObtained.some(userBadge => userBadge.badgeId.equals(badge._id)))
          {
            response.hints.push(badge.hint);
          }
        }

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
      // incoming: userId
      // outgoing: list of objects (name, badge, time) sorted in reverse chronological order

      const { userId, jwtToken } = req.body;

      let response = { activity:[], jwtToken:'', error:'' };

      if (isTokenExpired(jwtToken))
      {
        return;
      }

      if (!isValidId(userId, response, res))
      {
        return;
      }

      try
      {
        response.jwtToken = token.refresh(jwtToken);

        const currUser = await userCollection.findOne({ _id:new ObjectId(userId) });

        if (currUser == null)
        {
          response.error = 'User ' + userId + ' Not Found';
          res.status(500).json(response);
          return;
        }

        // Iterate through all followed users
        for (const followedUserId of currUser.usersFollowed) 
        {
          if (!isValidId(followedUserId, response, res))
          {
            return;
          }

          const followedUser = await userCollection.findOne({ _id: followedUserId });

          // Verify Followed User is in database
          if (followedUser == null)
          {
            response.error = 'User ' + followedUserId + ' Not Found';
            res.status(404).json(response);
            return;
          }

          // Iterate through the followed user's badges and add data to the activity list
          for (const badgeCollected of followedUser.badgesObtained)
          {
            const activityInfo = {firstName: followedUser.firstName, lastName: followedUser.lastName,
                                  badgeId: badgeCollected.badgeId, dateObtained: badgeCollected.dateObtained};
            response.activity.push(activityInfo);
          };
        }

        // Sort the data based on the date the badge was obtained (reverse chronological order)
        response.activity.sort((a, b) =>
        {
          return b.dateObtained - a.dateObtained;
        })

        res.status(200).json(response);

      }
      catch (error)
      {
        response.error = error.toString();
        res.status(500).json(response);
      }

    });
}