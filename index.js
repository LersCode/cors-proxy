require("dotenv").config("./.env");
const express = require("express");
const cors = require("cors");
const needle = require("needle");
const bodyParser = require("body-parser");

//Set variables
const PORT = process.env.PORT || 5000;
const CORS_HEADER = process.env.CORS_HEADER || "";
const BASE_URL = process.env.BASE_URL || "http://localhost:8080";
const ENABLE_LOGGING = process.env.ENABLE_LOGGING == "true" || false;

const app = express();
//Use Bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Set CORS-Header
app.use(
  cors({
    origin: CORS_HEADER,
  })
);
app.all("/*", async (req, res) => {
  logging(req.url);
  try {
    const apiRes = await needle(req.method, BASE_URL + req.url, req.body);
    res.status(200).json(apiRes.body);
    logging("Proxy-Status 200");
  } catch (error) {
    res.status(500).json(error);
    logging("Proxy-Status 500");
  }
});

app.listen(PORT, () => console.log("Server running on port " + PORT));

//functions
function logging(string) {
  if (ENABLE_LOGGING) {
    console.log("<" + getTimestamp() + "> " + string);
  }
}

function getTimestamp() {
  const date = new Date();
  return (
    date.getDate() +
    "." +
    (date.getMonth() + 1) +
    "." +
    date.getFullYear() +
    "/" +
    date.getHours() +
    ":" +
    date.getMinutes()
  );
}
