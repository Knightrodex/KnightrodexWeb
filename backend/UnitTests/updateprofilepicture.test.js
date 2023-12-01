const request = require("supertest");
const { app, client } = require("../server");
const { ObjectId } = require("mongodb");

describe("POST /api/updateprofilepicture", () => 
{
    const invalidJWT = "asdj;flkj";
    let validJWT = ""; // Set in beforeAll
    const invalidObjectId = "asdfasdk;ljf";
    const userId = "65690c2c00e7dd5b317fab9e";
    let userInfo;

    // Grab valid JWT from login and current userInfo to reset to
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

            userInfo = await client.db('Knightrodex').collection('User').findOne(
                { _id: new ObjectId(userId) }
            );
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
            userId: userId,
            profilePicture: "",
            jwtToken: invalidJWT
        }

        try
        {
            const response = await request(app)
                .post("/api/updateprofilepicture")
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

    test("Invalid ObjectId from User", async () => 
    {
        const invalidUserId = {
            userId: invalidObjectId,
            profilePicture: "",
            jwtToken: validJWT
        }

        try
        {
            const response = await request(app)
                .post("/api/updateprofilepicture")
                .send(invalidUserId)
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

    test("Successfully Update Profile Picture", async () => 
    {
        const validRequest = {
            userId: userId,
            profilePicture: "Unit Test String",
            jwtToken: validJWT
        }

        try
        {
            const response = await request(app)
                .post("/api/updateprofilepicture")
                .send(validRequest)
                .expect('Content-Type', /json/);

            expect(response.body).not.toHaveProperty("jwtToken", "");
            expect(response.body).toHaveProperty("error", "");

            const user = await client.db('Knightrodex').collection('User').findOne(
                { _id: new ObjectId(userId) },
            )

            expect(user.profilePicture).toEqual("Unit Test String");
        }
        catch (error)
        {
            console.log(error.toString());
            throw error;
        }
    });

    afterEach(async () =>
    {
        await client.db('Knightrodex').collection('User').updateOne(
            { _id: new ObjectId(userId) },
            { $set: { "profilePicture": userInfo.profilePicture }}
        )
    });
});