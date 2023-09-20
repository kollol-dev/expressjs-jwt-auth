const { Router } = require("express");
const router = Router();

// Fetch all routes
const userRoutes = require('./users/users.routes')

router.use('/v1/users', userRoutes);

module.exports = router;