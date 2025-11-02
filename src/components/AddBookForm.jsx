import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Modal,
  Stack,
} from "@mui/material";
import { addBookAPI } from "../services/allAPIs";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 420 },
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

// ✅ All Available Genres
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

function AddBookForm({ onBookAdded }) {
  const [open, setOpen] = useState(false);
  const [bookDetails, setBookDetails] = useState({
    title: "",
    author: "",
    genre: "",
    pages: "",
    pagesRead: 0,
    status: "",
    summary: "",
    cover: "",
    addedDate: new Date().toISOString(),
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !bookDetails.title ||
      !bookDetails.author ||
      !bookDetails.pages ||
      !bookDetails.genre
    ) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await addBookAPI(bookDetails);

      if (res.status >= 200 && res.status < 300) {
        onBookAdded(res.data);
        setBookDetails({
          title: "",
          author: "",
          genre: "",
          pages: "",
          pagesRead: 0,
          status: "To Read",
          summary: "",
          cover: "",
          addedDate: new Date().toISOString(),
        });
        setError("");
        setOpen(false);
      } else {
        setError("Failed to add book. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Error occurred while adding the book.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Add Button */}
      <Button
        variant="contained"
        startIcon={<LibraryAddIcon />}
        onClick={() => setOpen(true)}
        sx={{
          backgroundColor: "#1565c0",
          textTransform: "none",
          borderRadius: 3,
          px: 3,
          py: 1,
          "&:hover": { backgroundColor: "#0d47a1" },
        }}
      >
        Add Book
      </Button>

      {/* Add Book Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box component="form" onSubmit={handleSubmit} sx={modalStyle}>
          <Typography
            variant="h6"
            textAlign="center"
            fontWeight="bold"
            mb={2}
            color="primary"
          >
            Add New Book 📘
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Title"
              fullWidth
              required
              value={bookDetails.title}
              onChange={(e) =>
                setBookDetails({ ...bookDetails, title: e.target.value })
              }
            />

            <TextField
              label="Author"
              fullWidth
              required
              value={bookDetails.author}
              onChange={(e) =>
                setBookDetails({ ...bookDetails, author: e.target.value })
              }
            />

            {/* ✅ Genre Dropdown */}
            <TextField
              select
              label="Genre"
              fullWidth
              required
              value={bookDetails.genre}
              onChange={(e) =>
                setBookDetails({ ...bookDetails, genre: e.target.value })
              }
            >
              {genres.map((genre, index) => (
                <MenuItem key={index} value={genre}>
                  {genre}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Total Pages"
              type="number"
              fullWidth
              required
              value={bookDetails.pages}
              onChange={(e) =>
                setBookDetails({ ...bookDetails, pages: e.target.value })
              }
            />

            <TextField
              label="Summary / Description"
              multiline
              rows={3}
              fullWidth
              value={bookDetails.summary}
              onChange={(e) =>
                setBookDetails({ ...bookDetails, summary: e.target.value })
              }
            />

            <TextField
              label="Cover Image URL"
              fullWidth
              placeholder="https://example.com/cover.jpg"
              value={bookDetails.cover}
              onChange={(e) =>
                setBookDetails({ ...bookDetails, cover: e.target.value })
              }
            />

            <TextField
              select
              label="Status"
              fullWidth
              value={bookDetails.status}
              onChange={(e) =>
                setBookDetails({ ...bookDetails, status: e.target.value })
              }
            >
              <MenuItem value="Reading">Reading</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Wishlist">Wishlist</MenuItem>
            </TextField>

            {error && (
              <Typography color="error" textAlign="center">
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={loading}
              sx={{
                textTransform: "none",
                borderRadius: 3,
                mt: 1,
              }}
            >
              {loading ? "Adding..." : "Add Book"}
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}

export default AddBookForm;
