const request = require("supertest");
const { app, client } = require("../server");

describe("POST /api/searchemail", () => 
{
    const invalidJWT = "asdj;flkj";
    let validJWT = ""; // Set in beforeAll
    const invalidObjectId = "asdfasdk;ljf";
    const userId = "65690c2c00e7dd5b317fab9e";
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
            requesterUserId: userId,
            partialEmail: "a",
            jwtToken: invalidJWT
        }

        try
        {
            const response = await request(app)
                .post("/api/searchemail")
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
        const invalidToken = {
            requesterUserId: invalidObjectId,
            partialEmail: "a",
            jwtToken: validJWT
        }

        try
        {
            const response = await request(app)
                .post("/api/searchemail")
                .send(invalidToken)
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

    test("User DNE", async () =>
    {
        const invalidUser = {
            requesterUserId: invalidUserId,
            partialEmail: "a",
            jwtToken: validJWT
        }

        try
        {
            const response = await request(app)
                .post("/api/searchemail")
                .send(invalidUser)
                .expect('Content-Type', /json/);

            expect(response.body).toHaveProperty("jwtToken", "");
            expect(response.body).toHaveProperty("error", "Requesting User not found");
        }
        catch (error)
        {
            console.log(error.toString());
            throw error;
        }
    });

    test("Successfully Search Users with Email", async () =>
    {
        const validUser = {
            requesterUserId: userId,
            partialEmail: "a",
            jwtToken: validJWT
        }

        try
        {
            const response = await request(app)
                .post("/api/searchemail")
                .send(validUser)
                .expect('Content-Type', /json/);

            expect(response.body).not.toHaveProperty("jwtToken", "");
            expect(response.body).toHaveProperty("error", "");

            // Ensure Requester is not contained in the response
            expect(response.body.result).not.toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    userId: validUser.requesterUserId
                  })
                ])
              );
        }
        catch (error)
        {
            console.log(error.toString());
            throw error;
        }
    });
});