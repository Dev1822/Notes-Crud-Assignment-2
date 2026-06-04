const express = require("express");
const router = express.Router();
const { createNote } = require("../controller/note.controller.js");

router.post("/", createNote);

module.exports = router;
