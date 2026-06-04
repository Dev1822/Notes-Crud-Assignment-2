const express = require("express");
const router = express.Router();
const { 
  createNote,
  createMultipleNotes,
  getAllNotes
} = require("../controller/note.controller.js");

router.post("/", createNote);
router.post("/bulk", createMultipleNotes);
router.get("/", getAllNotes);

module.exports = router;
