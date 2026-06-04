const express = require("express");
const router = express.Router();
const { 
  createNote,
  createMultipleNotes,
  getAllNotes,
  getNoteById,
  replaceNote
} = require("../controller/note.controller.js");

router.post("/", createNote);
router.post("/bulk", createMultipleNotes);
router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.put("/:id", replaceNote);

module.exports = router;
