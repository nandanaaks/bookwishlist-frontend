import React from "react";
import { Typography, Box } from "@mui/material";

function PageNotFound() {
  return (
    <Box textAlign="center" p={5}>
      <Typography variant="h4">404 - Page Not Found</Typography>
      <Typography variant="body1">Oops! Looks like you’re lost 📖</Typography>
    </Box>
  );
}

export default PageNotFound;
