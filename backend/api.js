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
        text: 'Click this link to verify your email!'
      }

      sgMail
        .send(msg)
        .then(() => 
        {
          console.log('Verification Email Sent!');
        })
        .catch((error) =>
        {
          response.error = error.toString();
          return false;
        });

      return true;
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

    async function isUserFollowed(requesterUserId, targetUserId)
    {
      try
      {
        const requester = await userCollection.findOne({ _id: new ObjectId(requesterUserId)});
        if (requester && requester.usersFollowed)
        {
          const usersFollowedStrings = requester.usersFollowed.map(objId => objId.toString());
          return usersFollowedStrings.includes(targetUserId.toString());
        }
        else
        {
          return false;
        }
      }
      catch (error)
      {
        console.error("Error checking if user is followed:", error);
        return false;
      }
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

        // User DNE
        if (user == null)
        {
          response.error = 'Invalid credentials';
          res.status(400).json(response);
          return;
        }
        // User not Verified
        else if (!user.isVerified)
        {
          response.error = 'User is not verified';
          res.status(500).json(response);
          return;
        }

        response.jwtToken = token.createToken(user._id, user.firstName, user.lastName, user.email);
        res.status(200).json(response);
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
        // outgoing: userID, first name, last name, email

        const { firstName, lastName, email, password } = req.body;

        let response = { userId:'', firstName:'', lastName:'', email:'', error:'' };

        const newUser = { password:password, email:email, badgesObtained:[], 
                          firstName:firstName, lastName:lastName, profilePicture:'', 
                          usersFollowed:[], dateCreated:(new Date()), resetCode:0, isVerified:false };

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
          const result = await userCollection.insertOne(newUser);
          const emailStatus = verifyEmail(email, response, res);

          if (emailStatus == false)
          {
            res.status(500).json(response);
            return;
          }

          response.userId = result.insertedId;
          response.firstName = firstName;
          response.lastName = lastName;
          response.email = email;

          res.status(200).json(response);
        }
        catch (e)
        {
          response.error = e.toString();
          res.status(500).json(response);
        }
    });

    app.post('/api/verifyuser', async (req, res) =>
    {
      // incoming: userId
      // outgoing: response if verify user updated or not

      const { userId } = req.body;
      let response = { error:'' }

      try
      {
        if (!isValidId(userId, response, res))
        {
          return;
        }

        const user = await userCollection.findOne({ _id: new ObjectId(userId) });

        if (user.isVerified)
        {
          response.error('User is already verified.');
          res.status(500).json(response);
        }
        else
        {
          userCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: {"isVerified": true }});
        }

        res.status(200).json(response);
      }
      catch (e)
      {
        response.error = e.toString();
        res.status(500).json(response);
      }      
    })

    app.post('/api/passwordsend', async (req, res) => 
    {
      // incoming email
      // outgoing: sends newCode and updates resetCode field for user in db

      const { email } = req.body;
      let response = { error:'' }

      try
      {
        // Ensure user with the given email exists in database
        const user = await userCollection.findOne({ email:email });

        if (user == null)
        {
          response.error = 'Error trying to send password';
          res.status(500).json(response);
          return;
        }
      }
      catch (error)
      {
        response.error = error.toString();
        res.status(500).json(response);
        return;
      }

      const min = 100001;
      const max = 999999;
      const newCode = Math.floor(Math.random() * (max - min + 1)) + min;

      const msg = {
        to: email, // Change to your recipient
        from: 'knightrodex@outlook.com', // Change to your verified sender
        subject: 'Knightrodex Reset Password',
        text: 'Type this code into the website to reset your passsword! ' + newCode,
        html: 'Type this code into the website to reset your passsword! ' + newCode,
      }

      userCollection.updateOne(
        { email: email },
        { $set: {"resetCode": newCode }});

      sgMail
        .send(msg)
        .then(() => 
        {
          console.log('Reset Code Sent!')
          res.status(200).json(response);
        })
        .catch((error) => 
        {
          response.error = error.toString();
          res.status(400).json(response);
        })
    })

    app.post('/api/passwordupdate', async (req, res) => 
    {
      // incoming: email, userReset, new password
      // outgoing: updates password

      const { email, userReset, newPassword } = req.body;
      let response = { error:'' }

      try 
      {
        const user = await userCollection.findOne({ email:email});
        
        // User not found
        if (!user)
        {
          response.error= 'User Not Found';
          return res.status(404).json(response);
        }
        // User entered incorrect reset code
        else if (userReset != user.resetCode)
        {
          response.error = 'Incorrect Reset Code';
          return res.status(404).json(response);
        }

        // Update password in database
        userCollection.updateOne(
          { email: email },
          { $set: {"password": newPassword }});

        res.status(200).json(response);
        return;
      }
      catch (error)
      {
        response.error = error.toString();
        res.status(500).json(response);
      }
    })

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
        userId:'',
        firstName:'',
        lastName:'',
        profilePicture:'',
        usersFollowed:[],
        dateCreated:'',
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
            location: badgeInfo.location,
            coordinates: badgeInfo.coordinates,
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
      // incoming: requester user id, email (partial)
      // outgoing: all user info whose email matches partial email

      const { requesterUserId, partialEmail, jwtToken } = req.body;

      let response = { result:[], jwtToken:'', error:'' };

      if (isTokenExpired(jwtToken, response, res))
      {
        return;
      }

      if (!isValidId(requesterUserId, response, res))
      {
        return;
      }

      try 
      {
        response.jwtToken = token.refresh(jwtToken);

        const result = await userCollection.find({ email:{$regex:`${partialEmail}`, $options:'i'} }).toArray();

        for (const user of result)
        {
          // Exclude requester from search result
          if (user._id == requesterUserId)
          {
            continue;
          }

          const userResult = 
          {
            userId: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePicture: user.profilePicture,
            isFollowed: await isUserFollowed(requesterUserId, user._id)
          };

          response.result.push(userResult);
        }
        
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

      if (isTokenExpired(jwtToken, response, res))
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
            const badgeInfo = await badgeCollection.findOne({ _id:new ObjectId(badgeCollected.badgeId) });
            const activityInfo = {firstName:followedUser.firstName, lastName:followedUser.lastName, profilePicture:followedUser.profilePicture,
                                  badgeId:badgeCollected.badgeId, badgeTitle:badgeInfo.title,
                                  dateObtained:badgeCollected.dateObtained};
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

    app.post('/api/uploadprofilepicture', async (req, res) =>
    {
      // incoming: userId, pfp link
      // outgoing: error

      const { userId, profilePicture, jwtToken } = req.body;
      let response = { jwtToken:'', error:'' };

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

        userCollection.updateOne(
          { _id:new ObjectId(userId) },
          { $set: {'profilePicture':profilePicture} }
        );

        res.status(200).json(response);
      }
      catch (error)
      {
        response.error = error.toString();
        res.status(500).json(response);
      }
    }); 
}