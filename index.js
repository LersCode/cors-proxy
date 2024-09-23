// Required
require("dotenv").config("./.env");

// Imports
import logging from "./src/functions/logging.js";

const express = require("express");
const cors = require("cors");
const needle = require("needle");
const bodyParser = require("body-parser");

//Set variables
const PORT = process.env.PORT || 5000;
const CORS_HEADER = process.env.CORS_HEADER || "";
const BASE_URL = process.env.BASE_URLL || "http://localhost:8080";
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
/**
 * INTERCEPTORS
 */

// All requests
app.all("/*", async (req, res) => {
  logging(ENABLE_LOGGING, `request_url ${req.url}`, STATUS_INFO);
  try {
    const apiRes = await needle(req.method, BASE_URL + req.url, req.body);
    res.status(200).send(apiRes.body);
    logging("Proxy-Status 200");
  } catch (error) {
    res.status(500).json(error);
    logging(ENABLE_LOGGING, "Proxy-Status 500", STATUS_WARNING);
    logging(ENABLE_LOGGING, `Proxy-Error ${error}`, STATUS_ERROR);
  }
});

app.listen(PORT, () => console.log("Server running on port " + PORT));
