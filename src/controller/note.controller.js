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

module.exports = {
  createNote,
  createMultipleNotes,
  getAllNotes
};
