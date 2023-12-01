const request = require("supertest");
const { app, client } = require("../server");

describe("POST /api/passwordsend", () => 
{
    invalidEmail = "bademail@ucf.edu";
    validEmail = "zszach23@gmail.com";

    test("Email DNE", async () =>
    {
        const invalidEmailRequest = { email: invalidEmail };

        try
        {
            const response = await request(app)
                .post("/api/passwordsend")
                .send(invalidEmailRequest)
                .expect('Content-Type', /json/);

            expect(response.body).toHaveProperty("error", "Error trying to send password");
        }
        catch (error)
        {
            console.log(error.toString());
            throw error;
        }
    });

    test("Successfully Send Email", async () =>
    {
        const validEmailRequest = { email: validEmail };

        try
        {
            const response = await request(app)
                .post("/api/passwordsend")
                .send(validEmailRequest)
                .expect('Content-Type', /json/);

            expect(response.body).toHaveProperty("error", "");
        }
        catch (error)
        {
            console.log(error.toString());
            throw error;
        }
    });
})