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
  getNoteSummary,
  getNotesByFilter,
  getPinnedNotes,
  getNotesByCategoryQuery,
  getNotesByDateRange,
  getPaginatedNotes
} = require("../controller/note.controller.js");

router.post("/", createNote);
router.post("/bulk", createMultipleNotes);
router.get("/", getAllNotes);
router.get("/filter", getNotesByFilter);
router.get("/filter/pinned", getPinnedNotes);
router.get("/filter/category", getNotesByCategoryQuery);
router.get("/filter/date-range", getNotesByDateRange);
router.get("/paginate", getPaginatedNotes);
router.get("/category/:category", getNotesByCategory);
router.get("/status/:isPinned", getNotesByStatus);
router.get("/:id/summary", getNoteSummary);
router.get("/:id", getNoteById);
router.put("/:id", replaceNote);
router.patch("/:id", updateNote);
router.delete("/bulk", deleteMultipleNotes);
router.delete("/:id", deleteNote);

module.exports = router;
