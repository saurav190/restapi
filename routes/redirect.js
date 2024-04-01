const express = require("express");
const router = express.Router();

router.get("/redirect", (req, res) => {
  res.send("successfully redirected");
});
router.get("/demoredirect", (req, res) => {
  res.status(301).redirect("/redirect/redirect");
});

module.exports = router;
