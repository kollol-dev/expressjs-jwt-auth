const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");

const myEnv = dotenv.config({ path: `${__dirname}/../.env` });
dotenvExpand.expand(dotenv);
const express = require("express");
var cors = require("cors");
const server = express();
const port = process.env.PORT || 3000;
require("./bootstrap");

const routes = require("./routes");

var cors_options = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

server.use(cors(cors_options));

server.get("/health", (req, res) => {
  res.send("Healthy!");
});

server.use("/", routes);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
