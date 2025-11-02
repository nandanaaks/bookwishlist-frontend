import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";
import AddBookForm from "../components/AddBookForm";
import BookCard from "../components/BookCard";
import EditBookModal from "../components/EditBookModal";
import { getAllBooksAPI } from "../services/allAPIs";

function MyBooks() {
  const [books, setBooks] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  // 📚 Predefined genres for dropdown filter
  const fixedGenres = [
    "All",
    "Romance",
    "Crime",
    "Self-help",
    "Business & economics",
    "Biographies & memoir",
    "Mystery & thriller",
    "Comics",
    "Literature & fiction",
    "Fantasy",
    "Sci-fiction",
    "Manga",
    "Historical fiction",
  ];

  // Fetch books when page loads
  useEffect(() => {
    (async () => {
      const res = await getAllBooksAPI();
      setBooks(res.data);
    })();
  }, []);

  // Add new book (from AddBookForm)
  const handleBookAdded = (newBook) => {
    setBooks((prevBooks) => [...prevBooks, newBook]);
  };

  // Update an existing book locally
  const handleBookUpdated = (updatedBook) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) => (book.id === updatedBook.id ? updatedBook : book))
    );
  };

  // Delete a book
  const handleBookDeleted = (deletedId) => {
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== deletedId));
  };

  // Open edit modal
  const handleEdit = (book) => {
    setSelectedBook(book);
    setEditOpen(true);
  };

  // Filtered list based on search + genre
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenre =
      selectedGenre === "All" ||
      (book.genre && book.genre.toLowerCase() === selectedGenre.toLowerCase());

    return matchesSearch && matchesGenre;
  });

  return (
    <Box sx={{ p: 4, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Title */}
      <Typography
        variant="h4"
        component="h1"
        align="center"
        sx={{ fontWeight: "bold", mb: 3 }}
      >
        📚 My Books
      </Typography>

      {/* Search + Filter + Add */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        sx={{ mb: 3 }}
      >
        {/* Search Field */}
        <TextField
          label="Search by Title or Author"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flex: 1, bgcolor: "white", borderRadius: 1 }}
        />

        {/* Genre Filter */}
        <TextField
          select
          label="Filter by Genre"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          sx={{ width: 220, bgcolor: "white", borderRadius: 1 }}
        >
          {fixedGenres.map((genre, index) => (
            <MenuItem key={index} value={genre}>
              {genre}
            </MenuItem>
          ))}
        </TextField>

        {/* Add Book */}
        <AddBookForm onBookAdded={handleBookAdded} />
      </Stack>

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <Grid container spacing={2}>
          {filteredBooks.map((book) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
              <BookCard
                book={book}
                onBookUpdated={handleBookUpdated}
                onBookDeleted={handleBookDeleted}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ mt: 5 }}
        >
          No books found.
        </Typography>
      )}

      {/* Edit Modal */}
      <EditBookModal
        open={editOpen}
        handleClose={() => setEditOpen(false)}
        book={selectedBook}
        onBookUpdated={handleBookUpdated}
      />
    </Box>
  );
}

export default MyBooks;









