const jwt = require("jsonwebtoken");
require("dotenv").config();

const EXPIRATION_TIME = '24h';

exports.createToken = function(id, fn, ln, em)
{
    return _createToken(id, fn, ln, em);
}

_createToken = function(id, fn, ln, em)
{
    try
    {
        const user = {userId:id, firstName:fn, lastName:ln, email:em};

        const jwtToken = jwt.sign(user, process.env.JWT_KEY,
            {
                expiresIn:EXPIRATION_TIME
            });

        return jwtToken;
    }
    catch (error)
    {
        console.log(error.toString())
        return "";
    }
}

exports.isExpired = function(token)
{
    let isError = jwt.verify( token, process.env.JWT_KEY,
        (err, verifiedJwt) =>
    {
        if (err)
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