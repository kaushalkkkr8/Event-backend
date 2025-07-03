const mongo = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const mongoURI = process.env.MONGO;

const connection=mongo
  .connect(mongoURI)
  .then(() => {
    console.log("DB Connected successfully");
  })
  .catch((err) => {
    console.error("error in conection", err);
    console.log("unable to connect with database");
  });
module.exports = {connection};