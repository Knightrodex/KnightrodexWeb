const request = require("supertest");
const { app, client } = require("../server");

describe("POST /api/login", () =>
{
    test("Invalid User Credentials", async () =>
    {
        const invalidUserCred = {
            email: "bademail@gmail.com",
            password: "SignUpTest123"
        }

        try
        {
            const response = await request(app)
                .post("/api/login")
                .send(invalidUserCred)
                .expect('Content-Type', /json/);

            expect(response.body).toHaveProperty("jwtToken", "");
            expect(response.body).toHaveProperty("error", "Invalid credentials");
        }
        catch (error)
        {
            console.log(error.toString());
            throw error;
        }
    });

    test("Unverified User", async () =>
    {
        const unverifiedUserCredentials = {
            email: "unverifieduser@ucf.edu",
            password: "SignUpTest123"
        }

        try
        {
            const response = await request(app)
                .post("/api/login")
                .send(unverifiedUserCredentials)
                .expect('Content-Type', /json/);

            expect(response.body).toHaveProperty("jwtToken", "");
            expect(response.body).toHaveProperty("error", "User is not verified");
        }
        catch (error)
        {
            console.log(error.toString());
            throw error;
        }
    });

    test("Verified User Successful Login", async () =>
    {
        const verifiedUserCredentials = {
            email: "zszach23@gmail.com",
            password: "SignUpTest123"
        }

        try
        {
            const response = await request(app)
                .post("/api/login")
                .send(verifiedUserCredentials)
                .expect('Content-Type', /json/);

            expect(response.body.jwtToken).not.toBe("");
            expect(response.body).toHaveProperty("error", "");
        }
        catch (error)
        {
            console.log(error.toString());
            throw error;
        }
    });
});