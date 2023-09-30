const { Router, json } = require("express");
const router = Router();
const { signUp, login, refreshToken, getAuthUser } = require("./users.controller");
const { verifyToken } = require("../middlewares/auth")

router.post("/signup", json(), signUp);
router.post('/login', json(), login);
router.post('/refresh_token', json(), refreshToken);

router.get('/user', verifyToken, getAuthUser);

module.exports = router;
