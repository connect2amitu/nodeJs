const express = require("express");
const router = express.Router();

//define methods for routes
const home = require("./user/home");


//Define routes here
router.use("/", home);


module.exports = router;
