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
  deleteMultipleNotes,
  getNotesByCategory,
  getNotesByStatus,
  getNoteSummary
} = require("../controller/note.controller.js");

router.post("/", createNote);
router.post("/bulk", createMultipleNotes);
router.get("/", getAllNotes);
router.get("/category/:category", getNotesByCategory);
router.get("/status/:isPinned", getNotesByStatus);
router.get("/:id/summary", getNoteSummary);
router.get("/:id", getNoteById);
router.put("/:id", replaceNote);
router.patch("/:id", updateNote);
router.delete("/bulk", deleteMultipleNotes);
router.delete("/:id", deleteNote);

module.exports = router;
