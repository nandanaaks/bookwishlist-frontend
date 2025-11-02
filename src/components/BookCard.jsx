import React, { useState } from "react";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
  Modal,
  Chip,
  LinearProgress,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Swal from "sweetalert2";
import { deleteBookAPI, updateBookAPI } from "../services/allAPIs";
import EditBookModal from "./EditBookModal";

function BookCard({ book, onBookUpdated, onBookDeleted }) {
  const [openDetails, setOpenDetails] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  // ✅ Ensure default status is "To Read"
  const currentStatus = book.status || "To Read";

  // ✅ Delete with confirmation
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete this book?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, delete it",
    });

    if (result.isConfirmed) {
      await deleteBookAPI(book.id);
      onBookDeleted(book.id);
      Swal.fire("Deleted!", "The book has been removed.", "success");
    }
  };

  // ✅ Toggle Wishlist
  const handleWishlistToggle = async () => {
    setOpenDetails(false);
    let updated;

    if (currentStatus === "To Read") {
      updated = { ...book, status: "Wishlist" };
      await updateBookAPI(book.id, updated);
      Swal.fire("Added!", `${book.title} added to Wishlist.`, "success");
    } else if (currentStatus === "Wishlist") {
      updated = { ...book, status: "To Read" };
      await updateBookAPI(book.id, updated);
      Swal.fire("Removed!", `${book.title} removed from Wishlist.`, "info");
    } else {
      Swal.fire("Note", "Only 'To Read' books can be added to Wishlist.", "info");
      return;
    }

    onBookUpdated(updated);
  };

  // ✅ Start Reading
  const handleStartReading = async () => {
    if (currentStatus === "Reading") {
      Swal.fire("Already reading this book!", "", "info");
      return;
    }

    const updated = { ...book, status: "Reading", pagesRead: 0 };
    await updateBookAPI(book.id, updated);
    onBookUpdated(updated);
    Swal.fire("Started!", `${book.title} moved to Reading.`, "success");
  };

  // ✅ Progress bar
  const progress =
    currentStatus === "Reading" && book.pages > 0
      ? Math.min((book.pagesRead / book.pages) * 100, 100)
      : currentStatus === "Completed"
      ? 100
      : 0;

  // ✅ Color for each status
  const getChipColor = (status) => {
    switch (status) {
      case "Completed":
        return "#22e629";
      case "Reading":
        return "#ec7f18";
      case "Wishlist":
        return "#ec2984";
      case "To Read":
      default:
        return "#90caf9";
    }
  };

  return (
    <>
      <Card
        sx={{
          position: "relative",
          width: 240,
          height: 320,
          backgroundColor: "#f5f7fa",
          borderRadius: 2,
          boxShadow: 2,
          m: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transition: "transform 0.2s",
          "&:hover": { transform: "scale(1.02)" },
        }}
      >
        {/* ✅ Always show chip, even for "To Read" */}
        <Chip
          label={currentStatus}
          size="small"
          sx={{
            position: "absolute",
            top: 6,
            right: 6,
            zIndex: 2,
            color: "#000",
            backgroundColor: getChipColor(currentStatus),
            fontWeight: 600,
          }}
        />

        {/* Book Info */}
        <CardActionArea onClick={() => setOpenDetails(true)}>
          <CardMedia
            component="img"
            height="140"
            image={
              book.cover ||
              "https://images.ctfassets.net/h6goo9gw1hh6/5jqrtoLoeneF3n7SArR54N/cac64aae2bda392ff390298799e0cac5/Book-Cover-Design-FB.jpg"
            }
            alt={book.title}
            sx={{
              objectFit: "contain",
              backgroundColor: "#e8e8e8",
              borderRadius: "6px",
              py: 1,
            }}
          />
          <CardContent sx={{ textAlign: "center", p: 1 }}>
            <Typography variant="subtitle1" fontWeight={600} noWrap>
              {book.title}
            </Typography>
            <Typography variant="caption" color="secondary" noWrap>
              {book.author}
            </Typography>

            {book.genre && (
              <Typography
                variant="caption"
                sx={{ display: "block", mt: 0.3, color: "#555" }}
                noWrap
              >
                📚 {book.genre}
              </Typography>
            )}

            {(currentStatus === "Reading" || currentStatus === "Completed") && (
              <Box mt={1}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    "& .MuiLinearProgress-bar": {
                      backgroundColor:
                        progress === 100 ? "#4caf50" : "#0a8ee6ff",
                    },
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {book.pagesRead}/{book.pages}
                </Typography>
              </Box>
            )}
          </CardContent>
        </CardActionArea>

        {/* Bottom Buttons */}
        <Box display="flex" justifyContent="center" alignItems="center" pb={1} gap={1}>
          {(currentStatus === "To Read" || currentStatus === "Wishlist") && (
            <Button
              size="small"
              color="success"
              variant="outlined"
              onClick={handleStartReading}
            >
              Start Reading
            </Button>
          )}

          <IconButton color="primary" size="small" onClick={() => setOpenEdit(true)}>
            <EditIcon fontSize="small" />
          </IconButton>

          <IconButton color="error" size="small" onClick={handleDelete}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Card>

      {/* Edit Modal */}
      <EditBookModal
        open={openEdit}
        handleClose={() => setOpenEdit(false)}
        book={book}
        onBookUpdated={(updatedBook) => {
          onBookUpdated(updatedBook);
          setOpenEdit(false);
        }}
      />

      {/* Details Modal */}
      <Modal open={openDetails} onClose={() => setOpenDetails(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 340,
            maxHeight: "90vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 2,
            textAlign: "center",
          }}
        >
          <img
            src={
              book.cover ||
              "https://images.ctfassets.net/h6goo9gw1hh6/5jqrtoLoeneF3n7SArR54N/cac64aae2bda392ff390298799e0cac5/Book-Cover-Design-FB.jpg"
            }
            alt={book.title}
            style={{
              width: "100%",
              height: "160px",
              objectFit: "contain",
              borderRadius: "8px",
            }}
          />
          <Typography variant="h6" fontWeight={600} mt={1}>
            {book.title}
          </Typography>
          <Typography color="text.secondary">{book.author}</Typography>

          {book.genre && (
            <Typography fontSize={14} mt={0.5} color="text.secondary">
              📚 Genre: {book.genre}
            </Typography>
          )}

          <Typography fontSize={14} mt={1}>
            📖 {book.pages} pages
          </Typography>
          <Typography fontSize={13} mt={1}>
            {book.summary || "No summary available."}
          </Typography>

          {/* ❤️ Wishlist Toggle */}
          <Box mt={2}>
            <IconButton
              color="error"
              onClick={handleWishlistToggle}
              title={
                currentStatus === "Wishlist"
                  ? "Remove from Wishlist"
                  : "Add to Wishlist"
              }
            >
              {currentStatus === "Wishlist" ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default BookCard;




