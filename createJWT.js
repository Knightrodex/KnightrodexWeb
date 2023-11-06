const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.createToken = function(id, fn, ln, em)
{
    return _createToken(id, fn, ln, em);
}

_createToken = function(id, fn, ln, em)
{
    let response = {accessToken:'', error:''};
    try
    {
        const expiration = new Date();
        const user = {userId:id, firstName:fn, lastName:ln, email:em};

        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn:'24h'
            });

        response.accessToken = accessToken;
    }
    catch (error)
    {
        response.error = error.toString();
    }

    return response;
}

exports.isExpired = function(token)
{
    let isError = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, error, verifiedJwt =>
    {
        if (error)
        {
            return true;
        }
        else
        {
            return false;
        }
    });

    return isError;
}

exports.refresh = function(token)
{
    let ud = jwt.decode(token, {complete:true});

    let userId = ud.payload.id;
    let firstName = ud.payload.firstName;
    let lastName = ud.payload.lastName;
    let email = ud.payload.email;

    return _createToken(userId, firstName, lastName, email);
}