const request = require("supertest");
const app = require("../server");

describe("POST /api/signup", () =>
{
    test("User with Email Already Exists", async () =>
    {
        const repeatEmail = {
            firstName: "Repeat",
            lastName: "Email",
            email: "zszach23@gmail.com",
            password: "SignUpTest123"
        }

        try
        {
            const response = await request(app)
                .post("/api/signup")
                .send(repeatEmail)
                .expect('Content-Type', /json/);

            expect(response.body).toHaveProperty("userId", "");
            expect(response.body).toHaveProperty("firstName", "");
            expect(response.body).toHaveProperty("lastName", "");
            expect(response.body).toHaveProperty("email", "");
            expect(response.body).toHaveProperty("error", "User with the given email already exists");
        }
        catch (error)
        {
            console.log(error.toString());
            throw error;
        }
    });

    test("User Successfully Signs Up", async () =>
    {
        const validNewUserCredentials = {
            firstName: "New",
            lastName: "User",
            email: "newUser@gmail.com",
            password: "SignUpTest123"
        }

        try
        {
            const response = await request(app)
                .post("/api/signup")
                .send(validNewUserCredentials)
                .expect('Content-Type', /json/);

            expect(response.body).not.toHaveProperty("userId", "");
            expect(response.body).toHaveProperty("firstName", validNewUserCredentials.firstName);
            expect(response.body).toHaveProperty("lastName", validNewUserCredentials.lastName);
            expect(response.body).toHaveProperty("email", validNewUserCredentials.email);
            expect(response.body).toHaveProperty("error", "");
        }
        catch (error)
        {
            console.log(error.toString());
            throw error;
        }
    });
});