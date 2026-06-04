const express = require("express");
const router = express.Router();
const { 
  createNote,
  createMultipleNotes,
  getAllNotes,
  getNoteById,
  replaceNote,
  updateNote,
  deleteNote,
  deleteMultipleNotes
} = require("../controller/note.controller.js");

router.post("/", createNote);
router.post("/bulk", createMultipleNotes);
router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.put("/:id", replaceNote);
router.patch("/:id", updateNote);
router.delete("/bulk", deleteMultipleNotes);
router.delete("/:id", deleteNote);

module.exports = router;
