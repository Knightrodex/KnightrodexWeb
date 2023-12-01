const request = require("supertest");
const { app, client } = require("../server");

describe("POST /api/showuserprofile", () =>
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
            userId: userId,
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

    test("Invalid ObjectId from User", async () => 
    {
        const invalidUserId = {
            userId: invalidObjectId,
            jwtToken: validJWT
        }

        try
        {
            const response = await request(app)
                .post("/api/showuserprofile")
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

    test("User DNE", async () => {
        const invalidUser = {
            userId: invalidUserId,
            jwtToken: validJWT
        }

        try
        {
            const response = await request(app)
                .post("/api/showuserprofile")
                .send(invalidUser)
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

    test("Succesfully Show User Profile", async () =>
    {
        const validUser = {
            userId: userId,
            jwtToken: validJWT
        }

        try
        {
            const response = await request(app)
                .post("/api/showuserprofile")
                .send(validUser)
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
});