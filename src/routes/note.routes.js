const express = require("express");
const router = express.Router();
const { 
  createNote,
  createBulkNotes 
} = require("../controller/note.controller.js");

router.post("/bulk", createBulkNotes);
router.post("/", createNote);

module.exports = router;
