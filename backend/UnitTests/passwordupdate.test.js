const request = require("supertest");
const { app, client } = require("../server");

describe("POST /api/passwordupdate", () => 
{
    invalidEmail = "bademail@ucf.edu";
    validEmail = "passwordUpdatereset@ucf.edu";
    validResetCode = 305915;
    oldPassword = "DoNotChange123"

    test("Email DNE", async () =>
    {
        const invalidEmailRequest = {
            email: invalidEmail,
            userReset: 123456,
            newPassword: "newPassword" };

        try
        {
            const response = await request(app)
                .post("/api/passwordupdate")
                .send(invalidEmailRequest)
                .expect('Content-Type', /json/);

            expect(response.body).toHaveProperty("error", "User Not Found");
        }
        catch (error)
        {
            console.log(error.toString());
            throw error;
        }
    });

    test("Incorrect Reset Code", async () =>
    {
        const invalidCodeRequest = {
            email: validEmail,
            userReset: 123456,
            newPassword: "newPassword" };

        try
        {
            const response = await request(app)
                .post("/api/passwordupdate")
                .send(invalidCodeRequest)
                .expect('Content-Type', /json/);

            expect(response.body).toHaveProperty("error", "Incorrect Reset Code");
        }
        catch (error)
        {
            console.log(error.toString());
            throw error;
        }
    });

    test("Successfully Update Password", async () =>
    {
        const validUpdateRequest = { 
            email: validEmail,
            userReset: validResetCode,
            newPassword: "newPassword" };

        try
        {
            const response = await request(app)
                .post("/api/passwordupdate")
                .send(validUpdateRequest)
                .expect('Content-Type', /json/);

            expect(response.body).toHaveProperty("error", "");

            const user = await client.db('Knightrodex').collection('User').findOne(
                { email: validEmail}
            );

            expect(user.password).toBe("newPassword");
        }
        catch (error)
        {
            console.log(error.toString());
            throw error;
        }
    });

    afterAll(async () =>
    {
        const response = await client.db('Knightrodex').collection('User').updateOne(
            { email: validEmail},
            {$set: { "password": oldPassword }}
        );

        console.log(response.acknowledged);
    })
})