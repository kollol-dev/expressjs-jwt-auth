const { Router, json } = require("express");
const router = Router();
const { signUp } = require("./users.controller");


router.post("/signup", json(), signUp);

module.exports = router;
