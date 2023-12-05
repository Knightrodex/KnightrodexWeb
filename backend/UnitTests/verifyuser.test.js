const request = require("supertest");
const { app, client } = require("../server");
const { ObjectId } = require('mongodb');

describe("POST /api/verifyuser", () =>
{
    invalidUserId = "asdjf"
    verifiedUserId = "655edf42016341dfa0a7e37f"
    unverifiedUserId = "6563d3defd1f535586845367"

    test("Invalid ObjectId for User", async () =>
    {
        const invalidUser = {
            userId: invalidUserId
        }

        try
        {
            const response = await request(app)
                .post("/api/verifyuser")
                .send(invalidUser)
                .expect('Content-Type', /json/);

            expect(response.body).toHaveProperty("error", "ID is not a valid ObjectId");
        }
        catch (error)
        {
            console.log(error.toString());
            throw error;
        }
    });

    test("Invalid ObjectId for User", async () =>
    {
        const verifiedUser = {
            userId: verifiedUserId
        }

        try
        {
            const response = await request(app)
                .post("/api/verifyuser")
                .send(verifiedUser)
                .expect('Content-Type', /json/);

            expect(response.body).toHaveProperty("error", "User is already verified.");
        }
        catch (error)
        {
            console.log(error.toString());
            throw error;
        }
    });

    test("Successfully Verify User", async () =>
    {
        const unverifiedUser = {
            userId: unverifiedUserId
        }

        try
        {
            const response = await request(app)
                .post("/api/verifyuser")
                .send(unverifiedUser)
                .expect('Content-Type', /json/);

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
        const response = await client.db('Knightrodex').collection('User').updateOne(
            { _id: new ObjectId(unverifiedUserId) },
            { $set: {"isVerified": false}}
        );

        console.log(response.acknowledged);
    });
});