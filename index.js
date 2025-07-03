const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
dotenv.config();
const { connection } = require("./db.connect");

const app = express();


app.use(
  cors({
    origin: [
  "http://localhost:5173",
  "https://event-frontend-six-kappa.vercel.app","https://event-frontend-2.vercel.app/"
    ],

    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],

    // optionsSuccessStatus: 200,
  })
);


app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const authRoutes = require("./Routes/authRoute");
const eventRoutes = require("./Routes/eventRoutes");

const PORT = process.env.PORT || 3030;
app.get("/", (req, res) => {
  res.send("HELLO! express is working");
});

app.use("/auth", authRoutes);
app.use("/event", eventRoutes);

app.listen(PORT, () => {
  console.log("App is running on port", PORT);
});

module.exports = app;
