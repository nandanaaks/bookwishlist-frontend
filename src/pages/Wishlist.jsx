import React, { useEffect, useState } from "react";
import { getAllBooksAPI, updateBookAPI } from "../services/allAPIs";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Stack,
} from "@mui/material";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  // ✅ Fetch Wishlist Books
  const fetchWishlist = async () => {
    const res = await getAllBooksAPI();
    if (res.status >= 200 && res.status < 300) {
      setWishlist(res.data.filter((b) => b.status === "Wishlist"));
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // ✅ Handle "Start Reading"
  const handleStartReading = async (book) => {
    const updated = { ...book, status: "Reading", pagesRead: 0 };
    await updateBookAPI(book.id, updated);
    fetchWishlist(); // Refresh after update
  };

  // ✅ Handle "Remove from Wishlist"
  const handleRemoveFromWishlist = async (book) => {
    const updated = { ...book, status: "Not Started" }; // or "Available"
    await updateBookAPI(book.id, updated);
    fetchWishlist(); // Refresh after update
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3} fontWeight={600} textAlign="center">
        💖 My Wishlist
      </Typography>

      <Box display="flex" flexWrap="wrap" justifyContent="flex-start" gap={3}>
        {wishlist.length > 0 ? (
          wishlist.map((book) => (
            <Card
              key={book.id}
              sx={{
                width: 230,
                borderRadius: 3,
                boxShadow: 4,
                backgroundColor: "#fef7e5",
                textAlign: "center",
                transition: "0.3s",
                "&:hover": { transform: "scale(1.03)" },
              }}
            >
              <CardMedia
                component="img"
                height="160"
                image={
                  book.cover ||
                  "https://images.ctfassets.net/h6goo9gw1hh6/5jqrtoLoeneF3n7SArR54N/cac64aae2bda392ff390298799e0cac5/Book-Cover-Design-FB.jpg"
                }
                alt={book.title}
                sx={{
                  py: 1,
                  objectFit: "contain",
                  backgroundColor: "#fff",
                }}
              />

              <CardContent>
                <Typography variant="h6" fontWeight={600}>
                  {book.title}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>
                  {book.author}
                </Typography>

                {/* Buttons for Actions */}
                <Stack direction="row" spacing={1} >
                  <Button
                    variant="contained"
                    color="warning"
                    size="small"
                    onClick={() => handleStartReading(book)}
                    sx={{
                      textTransform: "none",
                      borderRadius: "8px",
                      px: 2,
                      fontWeight: 500,
                    }}
                  >
                    Start Reading
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleRemoveFromWishlist(book)}
                    sx={{
                      textTransform: "none",
                      borderRadius: "8px",
                      px: 2,
                      fontWeight: 500,
                    }}
                  >
                    Remove
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary" mt={3}>
            Your wishlist is empty. Add some books you’d love to read 💫
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default Wishlist;
