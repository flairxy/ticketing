import request from "supertest";
import { app } from "../../app";

it("fails when an email that doens't exist is supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({ email: "user@example.com", password: "password" })
    .expect(400);
});

it("fails when an invalid password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "user@example.com", password: "password" })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({ email: "user@example.com", password: "passwordx" })
    .expect(400);
});

it("responds with a cookie when given valid credentials", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "user@example.com", password: "password" })
    .expect(201);

  let response = await request(app)
    .post("/api/users/signin")
    .send({ email: "user@example.com", password: "password" })
    .expect(200);

    expect(response.get("Set-Cookie")).toBeDefined();
});
