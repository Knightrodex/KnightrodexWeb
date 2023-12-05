const request = require("supertest");
const { app, client } = require("../server");
const { ObjectId } = require("mongodb");

describe("POST /api/followuser", () => 
{
    const invalidJWT = "asdj;flkj";
    let validJWT = ""; // Set in beforeAll
    const invalidObjectId = "asdfasdk;ljf";
    const currUserId = "65690c2c00e7dd5b317fab9e";
    const otherUserId = "6568eee0875a495b0b190a43";
    const unfollowedUserId = "6525c13e21cb5f9f2b270d87";
    const invalidUserId = "655edf42016341dfa0a7e37e";

    // Grab valid JWT from login
    beforeAll(async () => 
    {
        const verifiedUserCredentials = {
            email: "unittestuser@gmail.com",
            password: "UnitTest123"
        }

        try
        {
            const response = await request(app)
                .post("/api/login")
                .send(verifiedUserCredentials)
                .expect('Content-Type', /json/);

            expect(response.body).not.toHaveProperty("jwtToken", "");
            expect(response.body).toHaveProperty("error", "");

            validJWT = response.body.jwtToken;
        }
        catch (error)
        {
            console.log(error.toString());
            throw error;
        }
    });

    test("Invalid JWT", async () =>
    {
        const invalidToken = {
            currentUserId: currUserId,
            otherUserId: otherUserId,
            jwtToken: invalidJWT
        }

        try
        {
            const response = await request(app)
                .post("/api/unfollowuser")
                .send(invalidToken)
                .expect('Content-Type', /json/);

            expect(response.body).toHaveProperty("jwtToken", "");
            expect(response.body).toHaveProperty("error", "JWT is no longer valid");
        }
        catch (error)
        {
            console.log(error.toString());
            throw error;
        }
    });

    test("Invalid ObjectId for Current User", async () => 
    {
        const invalidCurrObject = {
            currentUserId: invalidObjectId,
            otherUserId: otherUserId,
            jwtToken: validJWT
        }

        try
        {
            const response = await request(app)
                .post("/api/unfollowuser")
                .send(invalidCurrObject)
                .expect('Content-Type', /json/);

            expect(response.body).toHaveProperty("jwtToken", "");
            expect(response.body).toHaveProperty("error", "ID is not a valid ObjectId");
        }
        catch (error)
        {
            console.log(error.toString());
            throw error;
        }
    });

    test("Invalid ObjectId for Other User", async () => 
    {
        const invalidOtherObject = {
            currentUserId: currUserId,
            otherUserId: invalidObjectId,
            jwtToken: validJWT
        }

        try
        {
            const response = await request(app)
                .post("/api/unfollowuser")
                .send(invalidOtherObject)
                .expect('Content-Type', /json/);

            expect(response.body).toHaveProperty("jwtToken", "");
            expect(response.body).toHaveProperty("error", "ID is not a valid ObjectId");
        }
        catch (error)
        {
            console.log(error.toString());
            throw error;
        }
    });

    test("UserIds are Equal", async () => 
    {
        const equalIds = {
            currentUserId: currUserId,
            otherUserId: currUserId,
            jwtToken: validJWT
        }

        try
        {
            const response = await request(app)
                .post("/api/unfollowuser")
                .send(equalIds)
                .expect('Content-Type', /json/);

            expect(response.body).toHaveProperty("jwtToken", "");
            expect(response.body).toHaveProperty("error", "Current User cannot Unfollow themself");
        }
        catch (error)
        {
            console.log(error.toString());
            throw error;
        }
    });

    test("Current User DNE", async () => 
    {
        const invalidCurrUser = {
            currentUserId: invalidUserId,
            otherUserId: otherUserId,
            jwtToken: validJWT
        }

        try
        {
            const response = await request(app)
                .post("/api/unfollowuser")
                .send(invalidCurrUser)
                .expect('Content-Type', /json/);

            expect(response.body).toHaveProperty("jwtToken", "");
            expect(response.body).toHaveProperty("error", "User Not Found");
        }
        catch (error)
        {
            console.log(error.toString());
            throw error;
        }
    });

    test("Other User DNE", async () => 
    {
        const invalidOtherUser = {
            currentUserId: currUserId,
            otherUserId: invalidUserId,
            jwtToken: validJWT
        }

        try
        {
            const response = await request(app)
                .post("/api/unfollowuser")
                .send(invalidOtherUser)
                .expect('Content-Type', /json/);

            expect(response.body).toHaveProperty("jwtToken", "");
            expect(response.body).toHaveProperty("error", "User Not Found");
        }
        catch (error)
        {
            console.log(error.toString());
            throw error;
        }
    });

    test("Current User Already Unfollows Other User", async () => 
    {
        const currUserAlreadyUnfollows = {
            currentUserId: currUserId,
            otherUserId: unfollowedUserId,
            jwtToken: validJWT
        }

        try
        {
            const response = await request(app)
                .post("/api/unfollowuser")
                .send(currUserAlreadyUnfollows)
                .expect('Content-Type', /json/);

            expect(response.body).toHaveProperty("error", "Current User is not Following Other User");
            expect(response.body).toHaveProperty("jwtToken", "");
            
        }
        catch (error)
        {
            console.log(error.toString());
            throw error;
        }
    });

    test("Current User Successfully Unfollows Other User", async () => 
    {
        const validRequest = {
            currentUserId: currUserId,
            otherUserId: otherUserId,
            jwtToken: validJWT
        }

        try
        {
            const response = await request(app)
                .post("/api/unfollowuser")
                .send(validRequest)
                .expect('Content-Type', /json/);

            expect(response.body).toHaveProperty("error", "");
            expect(response.body).not.toHaveProperty("jwtToken", "");

            const user = await client.db('Knightrodex').collection('User').findOne(
                { _id: new ObjectId(currUserId) }
            );

            expect(user.usersFollowed).not.toContainEqual(new ObjectId(otherUserId));
        }
        catch (error)
        {
            console.log(error.toString());
            throw error;
        }
    });

    afterAll(async () => 
    {
        await client.db('Knightrodex').collection('User').updateOne(
            { _id: new ObjectId(currUserId) },
            { $push: { "usersFollowed": new ObjectId(otherUserId) } }
        );
    });
});