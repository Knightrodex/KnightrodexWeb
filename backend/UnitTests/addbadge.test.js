const request = require("supertest");
const { app, client } = require("../server");
const { ObjectId } = require("mongodb");

describe("POST /api/addbadge", () =>
{
    const invalidJWT = "asdj;flkj";
    let validJWT = ""; // Set in beforeAll
    const invalidObjectId = "asdfasdk;ljf";
    const userId = "65690c2c00e7dd5b317fab9e";
    const existingBadgeId = "6525c17340c12123447b2b86"
    const badgeId = "6567b3b6e9d4d35c05a71708";
    let badgeToAddInfo; // Track what the badge has before tests

    // Grab valid JWT from login and current badge info to reset to
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

            badgeToAddInfo = await client.db('Knightrodex').collection('Badge').findOne(
                { _id: new ObjectId(badgeId) }
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
            badgeId: badgeId,
            jwtToken: invalidJWT
        }

        try
        {
            const response = await request(app)
                .post("/api/addbadge")
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

    test("Invalid ObjectId for User", async () =>
    {
        const invalidUserId = {
            userId: invalidObjectId,
            badgeId: badgeId,
            jwtToken: validJWT
        }

        try
        {
            const response = await request(app)
                .post("/api/addbadge")
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

    test("Invalid ObjectId for Badge", async () =>
    {
        const invalidBadgeId = {
            userId: userId,
            badgeId: invalidObjectId,
            jwtToken: validJWT
        }

        try
        {
            const response = await request(app)
                .post("/api/addbadge")
                .send(invalidBadgeId)
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

    test("Badge DNE", async () =>
    {
        // BadgeId gets userId
        const invalidBadgeId = {
            userId: userId,
            badgeId: userId,
            jwtToken: validJWT
        }

        try
        {
            const response = await request(app)
                .post("/api/addbadge")
                .send(invalidBadgeId)
                .expect('Content-Type', /json/);

            expect(response.body).toHaveProperty("jwtToken", "");
            expect(response.body).toHaveProperty("error", "Badge not Found");
        }
        catch (error)
        {
            console.log(error.toString());
            throw error;
        }
    });

    test("User DNE", async () =>
    {
        // UserId gets BadgeId
        const invalidUserId = {
            userId: badgeId,
            badgeId: badgeId,
            jwtToken: validJWT
        }

        try
        {
            const response = await request(app)
                .post("/api/addbadge")
                .send(invalidUserId)
                .expect('Content-Type', /json/);

            expect(response.body).toHaveProperty("jwtToken", "");
            expect(response.body).toHaveProperty("error", "User not Found");
        }
        catch (error)
        {
            console.log(error.toString());
            throw error;
        }
    });

    test("Badge Collected to Limit", async () =>
    {
        const validRequest = {
            userId: userId,
            badgeId: badgeId,
            jwtToken: validJWT
        }

        try
        {
            // Modify badge's numObtained to the limit
            const updateNumObtained = await client.db('Knightrodex').collection('Badge').updateOne(
                { _id: new ObjectId(badgeId) },
                { $set: { "numObtained": badgeToAddInfo.limit }}
            )

            const response = await request(app)
                .post("/api/addbadge")
                .send(validRequest)
                .expect('Content-Type', /json/);

            expect(response.body).toHaveProperty("jwtToken", "");
            expect(response.body).toHaveProperty("error", "Badge collected to limit");
        }
        catch (error)
        {
            console.log(error.toString());
            throw error;
        }
    });

    test("User Already Has Badge", async () =>
    {
        // UserId gets BadgeId
        const validRequest = {
            userId: userId,
            badgeId: existingBadgeId,
            jwtToken: validJWT
        }

        try
        {
            const response = await request(app)
                .post("/api/addbadge")
                .send(validRequest)
                .expect('Content-Type', /json/);

            expect(response.body).toHaveProperty("jwtToken", "");
            expect(response.body).toHaveProperty("error", "User already has Badge");
        }
        catch (error)
        {
            console.log(error.toString());
            throw error;
        }
    });

    test("User Successfully Adds Badge", async () =>
    {
        // UserId gets BadgeId
        const validRequest = {
            userId: userId,
            badgeId: badgeId,
            jwtToken: validJWT
        }

        try
        {
            const response = await request(app)
                .post("/api/addbadge")
                .send(validRequest)
                .expect('Content-Type', /json/);

            expect(response.body).not.toHaveProperty("jwtToken", "");
            expect(response.body).toHaveProperty("error", "");
        }
        catch (error)
        {
            console.log(error.toString());
            throw error;
        }
    });

    afterEach(async () => 
    {
        // Reset BadgeToAdd info
        await client.db('Knightrodex').collection('Badge').updateOne(
            { _id: new ObjectId(badgeId) },
            { $set: { "numObtained": badgeToAddInfo.numObtained} }
        )

        // Remove Badge from User's badgesObtained
        await client.db('Knightrodex').collection('User').updateOne(
            { _id: new ObjectId(userId) },
            { $pull: { "badgesObtained": { badgeId: new ObjectId(badgeId) }}}
        )
    });
});