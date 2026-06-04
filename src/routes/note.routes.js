const express = require("express");
const router = express.Router();
const { 
  createNote,
  createMultipleNotes
} = require("../controller/note.controller.js");

router.post("/", createNote);
router.post("/bulk", createMultipleNotes);

module.exports = router;
