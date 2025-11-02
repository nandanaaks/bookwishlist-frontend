import React, { useState, useEffect } from "react";
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
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { getAllBooksAPI, updateBookAPI } from "../services/allAPIs";

function ReadingGoal() {
  const [goal, setGoal] = useState({ target: 10, completed: 0 });
  const [readingBooks, setReadingBooks] = useState([]);

  // 📥 Fetch Reading books
  useEffect(() => {
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
    fetchReadingBooks();
  }, []);

  const progress =
    goal.target > 0 ? Math.min((goal.completed / goal.target) * 100, 100) : 0;

  // Reset goal fields
  const handleReset = () => setGoal({ target: 0, completed: 0 });

  // 📤 Export report to PDF (only jsPDF)
  const handleExportPDF = () => {
    const pdf = new jsPDF();
    const lines = [
      "Reading Goal Report",
      "",
      `Target: ${goal.target}`,
      `Completed: ${goal.completed}`,
      `Progress: ${progress.toFixed(1)}%`,
      "",
      "Currently Reading:",
    ];

    if (readingBooks.length === 0) {
      lines.push("No books are currently being read.");
    } else {
      readingBooks.forEach((b, i) => {
        lines.push(`${i + 1}. ${b.title} by ${b.author}`);
        lines.push(`   ${b.pagesRead}/${b.pages} pages`);
      });
    }

    pdf.setFontSize(12);
    pdf.text(lines, 14, 20); // jsPDF auto-spaces each line
    pdf.save("ReadingGoal_Report.pdf");
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" mb={2}>
        🎯 Reading Goal Tracker
      </Typography>

      {/* Goal Inputs */}
      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          label="Target"
          type="number"
          value={goal.target}
          onChange={(e) => setGoal({ ...goal, target: +e.target.value })}
        />
        <TextField
          label="Completed"
          type="number"
          value={goal.completed}
          onChange={(e) => setGoal({ ...goal, completed: +e.target.value })}
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
        readingBooks.map((b) => (
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
              value={(b.pagesRead / b.pages) * 100}
              sx={{ height: 6, borderRadius: 2, mt: 1 }}
            />
            <Typography variant="caption">
              {b.pagesRead}/{b.pages} pages
            </Typography>
          </Box>
        ))
      ) : (
        <Typography color="text.secondary">
          No books are currently being read.
        </Typography>
      )}
    </Box>
  );
}

export default ReadingGoal;


