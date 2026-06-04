const mongoose = require("mongoose");
const Notes = require("../model/note.model.js");

const createNote = async (req, res) => {
  try {
    const { title, content, category, isPinned } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
        data: null
      });
    }

    const newNote = new Notes({
      title,
      content,
      category,
      isPinned
    });

    await newNote.save();

    return res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: {}
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null
    });
  }
};

const createBulkNotes = async (req, res) => {
  try {
    const { notes } = req.body;
    if (!notes || !Array.isArray(notes) || notes.length === 0) {
      return res.status(400).json({ success: false, message: "notes array is required and cannot be empty", data: null });
    }
    const created = await Notes.insertMany(notes);
    return res.status(201).json({ success: true, message: `${created.length} notes created successfully`, data: [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", data: null });
  }
};

const getAllNotes = async (req, res) => {
  try {
    const notes = await Notes.find();
    return res.status(200).json({ success: true, message: "Notes fetched successfully", count: notes.length, data: notes });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", data: null });
  }
};

const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid note ID", data: null });
    const note = await Notes.findById(id);
    if (!note) return res.status(404).json({ success: false, message: "Note not found", data: null });
    return res.status(200).json({ success: true, message: "Note fetched successfully", data: note });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", data: null });
  }
};

const replaceNote = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid note ID", data: null });
    const updated = await Notes.findByIdAndUpdate(id, req.body, { new: true, overwrite: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: "Note not found", data: null });
    return res.status(200).json({ success: true, message: "Note replaced successfully", data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", data: null });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid note ID", data: null });
    if (Object.keys(req.body).length === 0) return res.status(400).json({ success: false, message: "No fields provided to update", data: null });
    const updated = await Notes.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: "Note not found", data: null });
    return res.status(200).json({ success: true, message: "Note updated successfully", data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", data: null });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid note ID", data: null });
    const deleted = await Notes.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Note not found", data: null });
    return res.status(200).json({ success: true, message: "Note deleted successfully", data: null });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", data: null });
  }
};

const deleteBulkNotes = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: "ids array is required and cannot be empty", data: null });
    }
    const result = await Notes.deleteMany({ _id: { $in: ids } });
    return res.status(200).json({ success: true, message: `${result.deletedCount} notes deleted successfully`, data: null });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", data: null });
  }
};

const getNotesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const allowed = ["work", "personal", "study"];
    if (!allowed.includes(category)) {
      return res.status(400).json({ success: false, message: "Invalid category. Allowed: work, personal, study", data: null });
    }
    const notes = await Notes.find({ category });
    if (notes.length === 0) {
      return res.status(404).json({ success: false, message: `No notes found for category: ${category}`, data: null });
    }
    return res.status(200).json({ success: true, message: `Notes fetched for category: ${category}`, count: notes.length, data: notes });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", data: null });
  }
};

const getNotesByStatus = async (req, res) => {
  try {
    const { isPinned } = req.params;
    if (isPinned !== "true" && isPinned !== "false") {
      return res.status(400).json({ success: false, message: "isPinned must be true or false", data: null });
    }
    const pinned = isPinned === "true";
    const notes = await Notes.find({ isPinned: pinned });
    const message = pinned ? "Fetched all pinned notes" : "Fetched all unpinned notes";
    return res.status(200).json({ success: true, message, count: notes.length, data: notes });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", data: null });
  }
};

const getNoteSummary = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid note ID", data: null });
    const note = await Notes.findById(id).select("title category isPinned createdAt");
    if (!note) return res.status(404).json({ success: false, message: "Note not found", data: null });
    return res.status(200).json({ success: true, message: "Note summary fetched successfully", data: note });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", data: null });
  }
};

const filterNotes = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.isPinned !== undefined) filter.isPinned = req.query.isPinned === "true";
    const notes = await Notes.find(filter);
    return res.status(200).json({ success: true, message: "Notes fetched successfully", count: notes.length, data: notes });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", data: null });
  }
};

const getPinnedNotes = async (req, res) => {
  try {
    const filter = { isPinned: true };
    if (req.query.category) filter.category = req.query.category;
    const notes = await Notes.find(filter);
    return res.status(200).json({ success: true, message: "Pinned notes fetched successfully", count: notes.length, data: notes });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", data: null });
  }
};

const filterByCategory = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ success: false, message: "Query param 'name' is required", data: null });
    const notes = await Notes.find({ category: name });
    return res.status(200).json({ success: true, message: `Notes filtered by category: ${name}`, count: notes.length, data: notes });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", data: null });
  }
};

const filterByDateRange = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) return res.status(400).json({ success: false, message: "Both 'from' and 'to' query params are required", data: null });
    const notes = await Notes.find({
      createdAt: {
        $gte: new Date(from),
        $lte: new Date(to)
      }
    });
    return res.status(200).json({ success: true, message: `Notes fetched between ${from} and ${to}`, count: notes.length, data: notes });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", data: null });
  }
};

module.exports = {
  filterByDateRange,
  filterByCategory,
  getPinnedNotes,
  filterNotes,
  getNoteSummary,
  getNotesByStatus,
  getNotesByCategory,
  deleteBulkNotes,
  deleteNote,
  updateNote,
  replaceNote,
  getNoteById,
  getAllNotes,
  createBulkNotes,
  createNote
};
