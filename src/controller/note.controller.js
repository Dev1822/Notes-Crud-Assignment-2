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

const createMultipleNotes = async (req, res) => {
  try {
    const { notes } = req.body;
    
    if (!notes || !Array.isArray(notes) || notes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "notes array is required and cannot be empty",
        data: null
      });
    }

    await Notes.insertMany(notes);

    return res.status(201).json({
      success: true,
      message: `${notes.length} notes created successfully`,
      data: []
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null
    });
  }
};

const getAllNotes = async (req, res) => {
  try {
    const notes = await Notes.find();

    return res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      count: notes.length,
      data: notes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null
    });
  }
};

const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
        data: null
      });
    }

    const note = await Notes.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note fetched successfully",
      data: note
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null
    });
  }
};

const replaceNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
        data: null
      });
    }

    const updatedNote = await Notes.findByIdAndUpdate(
      id,
      req.body,
      { new: true, overwrite: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note replaced successfully",
      data: updatedNote
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null
    });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided to update",
        data: null
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
        data: null
      });
    }

    const updatedNote = await Notes.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: updatedNote
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
        data: null
      });
    }

    const deletedNote = await Notes.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null
    });
  }
};

const deleteMultipleNotes = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "ids array is required and cannot be empty",
        data: null
      });
    }

    await Notes.deleteMany({ _id: { $in: ids } });

    return res.status(200).json({
      success: true,
      message: `${ids.length} notes deleted successfully`,
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null
    });
  }
};

const getNotesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const allowedCategories = ["work", "personal", "study"];

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category. Allowed: work, personal, study",
        data: null
      });
    }

    const notes = await Notes.find({ category });

    if (!notes || notes.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No notes found for category: ${category}`,
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: `Notes fetched for category: ${category}`,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null
    });
  }
};

const getNotesByStatus = async (req, res) => {
  try {
    const { isPinned } = req.params;

    if (isPinned !== "true" && isPinned !== "false") {
      return res.status(400).json({
        success: false,
        message: "isPinned must be true or false",
        data: null
      });
    }

    const pinned = isPinned === "true";
    const notes = await Notes.find({ isPinned: pinned });

    return res.status(200).json({
      success: true,
      message: `Fetched all ${pinned ? "pinned" : "unpinned"} notes`,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null
    });
  }
};

const getNoteSummary = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
        data: null
      });
    }

    const note = await Notes.findById(id).select("title category isPinned createdAt");

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note summary fetched successfully",
      data: note
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null
    });
  }
};

const getNotesByFilter = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.isPinned !== undefined) filter.isPinned = req.query.isPinned === "true";

    const notes = await Notes.find(filter);

    return res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      count: notes.length,
      data: notes
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      data: null
    });
  }
};

module.exports = {
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
  getNotesByFilter
};
