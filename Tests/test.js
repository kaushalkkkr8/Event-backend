const request = require("supertest");
const app = require("../index"); // or app.js

let token;
let eventId;

describe("Auth + Event Route Tests", () => {
  const userData = {
    name: "Kaushal",
    email: "kaushal@example.com",
    password: "123456"
  };

  // -------- AUTH TESTS --------
  describe("Auth Routes", () => {
    test("POST /auth/signUp - should register a new user", async () => {
      const res = await request(app).post("/auth/signUp").send(userData);
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("signUp successful");
    });

    test("POST /auth/logIn - should log in user and return token", async () => {
      const res = await request(app).post("/auth/logIn").send({
        email: userData.email,
        password: userData.password
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
      token = res.body.token;
    });

    test("GET /auth/userProfile - should fail without token", async () => {
      const res = await request(app).get("/auth/userProfile");
      expect(res.statusCode).toBe(409);
      expect(res.body.message).toBe("Please send token");
    });
  });

  // -------- EVENT TESTS --------
  describe("Event Routes", () => {
    test("POST /event - should create an event", async () => {
      const res = await request(app)
        .post("/event")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Test Event",
          about:"Test aboot",
          description: "Event for test",
          date: "2025-07-20",
          location: "Online"
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.newEvent.title).toBe("Test Event");
      eventId = res.body.newEvent._id;
    });

    test("GET /event - should return all events", async () => {
      const res = await request(app)
        .get("/event")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.events).toBeInstanceOf(Array);
    });

    test("GET /event/:id - should return specific event", async () => {
      const res = await request(app)
        .get(`/event/${eventId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.event._id).toBe(eventId);
    });

  });
});
