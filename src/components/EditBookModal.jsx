import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  LinearProgress,
} from "@mui/material";
import { updateBookAPI } from "../services/allAPIs";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

const genres = [
  "Romance",
  "Crime",
  "Self-help",
  "Business & Economics",
  "Biographies & Memoir",
  "Mystery & Thriller",
  "Comics",
  "Literature & Fiction",
  "Fantasy",
  "Sci-fiction",
  "Manga",
  "Historical Fiction",
];

function EditBookModal({ open, handleClose, book, onBookUpdated }) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    pages: "",
    pagesRead: "",
    cover: "",
    summary: "",
    status: "",
  });

  useEffect(() => {
    if (book) setFormData(book);
  }, [book]);

  // ✅ Handle input changes with auto logic for pagesRead based on status
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...formData, [name]: value };

    // ✅ Auto-update pagesRead based on status change
    if (name === "status") {
      if (value === "Completed") {
        updated.pagesRead = updated.pages; // full
      } else if (value === "Reading") {
        updated.pagesRead = Math.max(1, Number(updated.pagesRead)); // at least 1
      } else if (value === "To Read") {
        updated.pagesRead = 0; // reset
      }
    }

    // ✅ If pages changed and status is Completed, sync pagesRead
    if (name === "pages" && formData.status === "Completed") {
      updated.pagesRead = value;
    }

    setFormData(updated);
  };

  // ✅ Calculate progress
  const progress =
    formData.pages > 0
      ? Math.min((formData.pagesRead / formData.pages) * 100, 100)
      : 0;

  // ✅ Save handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    let newStatus = formData.status;

    // Auto adjust if pages match
    if (Number(formData.pagesRead) >= Number(formData.pages)) {
      newStatus = "Completed";
    } else if (Number(formData.pagesRead) > 0) {
      newStatus = "Reading";
    } else {
      newStatus = "To Read";
    }

    const updatedBook = { ...formData, status: newStatus };

    await updateBookAPI(book.id, updatedBook);
    onBookUpdated(updatedBook);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" textAlign="center" mb={2}>
          ✏️ Edit Book
        </Typography>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            label="Author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            select
            label="Genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            fullWidth
            required
          >
            {genres.map((g, i) => (
              <MenuItem key={i} value={g}>
                {g}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Total Pages"
            name="pages"
            type="number"
            value={formData.pages}
            onChange={handleChange}
            fullWidth
            inputProps={{ min: 1 }}
          />

          <TextField
            label="Pages Read"
            name="pagesRead"
            type="number"
            value={formData.pagesRead}
            onChange={handleChange}
            fullWidth
            inputProps={{ min: 0, max: formData.pages }}
          />

          {formData.pages > 0 && (
            <Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: progress === 100 ? "#4caf50" : "#1976d2",
                  },
                }}
              />
              <Typography variant="caption">
                {Math.round(progress)}% complete
              </Typography>
            </Box>
          )}

          <TextField
            label="Cover Image URL"
            name="cover"
            value={formData.cover}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Summary"
            name="summary"
            multiline
            rows={3}
            value={formData.summary}
            onChange={handleChange}
            fullWidth
          />

          {/* ✅ Simplified Status Dropdown */}
          <TextField
            select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="To Read">To Read</MenuItem>
            <MenuItem value="Reading">Reading</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button
              onClick={handleClose}
              color="error"
              variant="outlined"
              sx={{ width: "48%" }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ width: "48%" }}
            >
              Save Changes
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}

export default EditBookModal;

