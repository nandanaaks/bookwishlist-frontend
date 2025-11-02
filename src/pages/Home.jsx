import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  LinearProgress,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
import { getAllBooksAPI } from "../services/allAPIs";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import { FcReading } from "react-icons/fc";

function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 📚 Fetch all books from backend
  const fetchBooks = async () => {
    try {
      const res = await getAllBooksAPI();
      if (res.status >= 200 && res.status < 300) {
        setBooks(res.data || []);
      }
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🕒 Fetch on mount and when window regains focus
  useEffect(() => {
    fetchBooks();
    // Auto refresh when user comes back to tab
    window.addEventListener("focus", fetchBooks);
    return () => window.removeEventListener("focus", fetchBooks);
  }, []);

  // 📊 Stats
  const total = books.length;
  const completed = books.filter((b) => b.status === "Completed").length;
  const readingBooks = books.filter((b) => b.status === "Reading");
  const wishlist = books.filter((b) => b.status === "Wishlist").length;

  return (
    <Box sx={{ mt: 6, px: { xs: 2, md: 8 } }}>
      {/* Title */}
      <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
        Welcome to{" "}
        <span style={{ color: "#463edaff", fontWeight: "bold" }}>Librispace</span>{" "}
        📚
      </Typography>

      {/* Stats Section */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 2,
          mt: 3,
        }}
      >
        {[
          {
            label: "Total Books",
            value: total,
            icon: <MenuBookIcon fontSize="large" color="primary" />,
          },
          {
            label: "Completed",
            value: completed,
            icon: <CheckCircleIcon fontSize="large" color="success" />,
          },
          {
            label: "Reading",
            value: readingBooks.length,
            icon: <BookmarkIcon fontSize="large" color="warning" />,
          },
          {
            label: "Wishlist",
            value: wishlist,
            icon: <FavoriteBorderIcon fontSize="large" color="error" />,
          },
        ].map((item) => (
          <Paper
            key={item.label}
            elevation={4}
            sx={{
              flex: "1 1 200px",
              maxWidth: 250,
              p: 3,
              borderRadius: 4,
              textAlign: "center",
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            <Stack alignItems="center" spacing={1}>
              {item.icon}
              <Typography variant="h6">{item.label}</Typography>
              <Typography variant="h5" fontWeight="bold">
                {item.value}
              </Typography>
            </Stack>
          </Paper>
        ))}
      </Box>

      {/* Add Book Button */}
      <Box textAlign="center" mt={5}>
        <Button
          startIcon={<LibraryAddIcon />}
          variant="contained"
          component={Link}
          to="/mybooks"
          sx={{
            px: 4,
            py: 1,
            backgroundColor: "#1565c0",
            borderRadius: 3,
            fontSize: "1rem",
            textTransform: "none",
          }}
        >
          Add Book
        </Button>
      </Box>

      {/* Currently Reading Section */}
      <Box my={2}>
        <Typography
          variant="h5"
          fontWeight="600"
          mt={1}
          sx={{ color: "#4F46E5" }}
        >
          <FcReading /> Currently Reading
        </Typography>

        {loading ? (
          <Typography color="text.secondary" mt={2}>
            Loading your books...
          </Typography>
        ) : readingBooks.length ? (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-start",
              gap: 3,
              mt: 2,
            }}
          >
            {readingBooks.map((b) => (
              <Box
                key={b.id}
                sx={{
                  flex: "1 1 calc(50% - 16px)",
                  minWidth: "300px",
                  maxWidth: "600px",
                  p: 2,
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  bgcolor: "#fafafa",
                  boxShadow: 1,
                  transition: "0.2s",
                  "&:hover": { boxShadow: 3 },
                }}
              >
                <Typography fontWeight="bold" noWrap>
                  {b.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {b.author}
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={b.pages ? (b.pagesRead / b.pages) * 100 : 0}
                  sx={{ height: 6, borderRadius: 2, mt: 1 }}
                />

                <Typography
                  variant="caption"
                  sx={{ mt: 1, display: "block", textAlign: "right" }}
                >
                  {b.pagesRead}/{b.pages} pages
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography textAlign="center" color="text.secondary" mt={3}>
            No books are currently being read.
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default Home;





