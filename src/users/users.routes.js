const { Router, json } = require("express");
const router = Router();
const { signUp, login } = require("./users.controller");
const { verifyToken } = require("../middlewares/auth")

router.post("/signup", json(), signUp);
router.post('/login', json(), login);

module.exports = router;
