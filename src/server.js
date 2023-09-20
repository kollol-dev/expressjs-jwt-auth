require("dotenv").config({ path: `${__dirname}/../.env` });
const express = require('express')
const server = express()
const port = process.env.PORT || 3000;

const routes = require('./routes')

server.get("/health", (req, res) => {
  res.send("Healthy!");
});

server.use('/', routes)

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})