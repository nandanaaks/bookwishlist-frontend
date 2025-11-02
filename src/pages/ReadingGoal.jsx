import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  LinearProgress,
  Stack,
  Divider,
} from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { getAllBooksAPI, updateBookAPI } from "../services/allAPIs";

function ReadingGoal() {
  // 🎯 Goal data
  const [goal, setGoal] = useState({
    type: "yearly",
    target: 10,
    completed: 0,
  });

  // 📚 Reading books from backend
  const [readingBooks, setReadingBooks] = useState([]);
  const pageRef = useRef();

  // 📥 Fetch "Reading" books from backend
  const fetchReadingBooks = async () => {
    try {
      const res = await getAllBooksAPI();
      if (res.status >= 200 && res.status < 300) {
        const reading = res.data.filter((b) => b.status === "Reading");
        setReadingBooks(reading);
      }
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  useEffect(() => {
    fetchReadingBooks();
  }, []);

  // Progress calculation
  const progress =
    goal.target > 0 ? Math.min((goal.completed / goal.target) * 100, 100) : 0;

  // Update goal fields
  const handleUpdateGoal = (field, value) => {
    setGoal((prev) => ({ ...prev, [field]: Number(value) }));
  };

  // Reset only the goal fields (not the reading list)
  const handleReset = () => {
    setGoal({ type: "yearly", target: 0, completed: 0 });
  };

  // Update book progress
  const handlePageUpdate = async (id, value) => {
    const book = readingBooks.find((b) => b.id === id);
    if (!book) return;

    const newPagesRead = Math.min(Number(value), book.pages);
    const updatedBook = { ...book, pagesRead: newPagesRead };

    await updateBookAPI(id, updatedBook);
    setReadingBooks((prev) =>
      prev.map((b) => (b.id === id ? updatedBook : b))
    );
  };

  //  Mark book as completed
  const handleMarkAsCompleted = async (id) => {
    const book = readingBooks.find((b) => b.id === id);
    if (!book) return;

    const updatedBook = { ...book, status: "Completed", pagesRead: book.pages };
    await updateBookAPI(id, updatedBook);

    setGoal((g) => ({ ...g, completed: g.completed + 1 }));
    setReadingBooks((prev) => prev.filter((b) => b.id !== id));
  };

  // 📤 Export report to PDF
  const handleExportPDF = () => {
    const input = pageRef.current;
    if (!input) return alert("No content found to export!");

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("ReadingGoal_Report.pdf");
    });
  };

  return (
    <Box sx={{ p: 4 }} ref={pageRef}>
      <Typography variant="h5" mb={2}>
        🎯 Reading Goal Tracker
      </Typography>

      {/* Goal Inputs */}
      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          label="Target"
          type="number"
          value={goal.target}
          onChange={(e) => handleUpdateGoal("target", e.target.value)}
        />
        <TextField
          label="Completed"
          type="number"
          value={goal.completed}
          onChange={(e) => handleUpdateGoal("completed", e.target.value)}
        />
      </Stack>

      {/* Progress Bar */}
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ height: 10, borderRadius: 5 }}
      />
      <Typography mt={1}>
        {goal.completed}/{goal.target} books ({progress.toFixed(1)}%)
      </Typography>

      {/* Buttons */}
      <Stack direction="row" spacing={2} mt={2}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<RestartAltIcon />}
          onClick={handleReset}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          startIcon={<PictureAsPdfIcon />}
          onClick={handleExportPDF}
        >
          Export PDF
        </Button>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* Reading List */}
      <Typography variant="h6" mb={1}>
        📚 Currently Reading
      </Typography>

      {readingBooks.length ? (
        readingBooks.map((b) => {
          const percent = b.pages ? (b.pagesRead / b.pages) * 100 : 0;
          const isCompleted = b.pagesRead >= b.pages;

          return (
            <Box
              key={b.id}
              sx={{
                mb: 1.5,
                p: 2,
                border: "1px solid #ddd",
                borderRadius: 2,
                bgcolor: "#fafafa",
              }}
            >
              <Typography fontWeight="bold">{b.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {b.author}
              </Typography>

              <LinearProgress
                variant="determinate"
                value={percent}
                sx={{ height: 6, borderRadius: 2, mt: 1 }}
              />
              <Typography variant="caption">
                {b.pagesRead}/{b.pages} pages
              </Typography>

              <Stack direction="row" spacing={1} mt={1}>
                <TextField
                  label="Pages Read"
                  type="number"
                  size="small"
                  value={b.pagesRead}
                  onChange={(e) => handlePageUpdate(b.id, e.target.value)}
                  sx={{ width: 120 }}
                />

                <Button
                  variant="contained"
                  size="small"
                  color="success"
                  disabled={!isCompleted}
                  onClick={() => handleMarkAsCompleted(b.id)}
                >
                  Mark Completed
                </Button>
              </Stack>
            </Box>
          );
        })
      ) : (
        <Typography color="text.secondary">
          No books are currently being read.
        </Typography>
      )}
    </Box>
  );
}

export default ReadingGoal;

