import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import * as React from "react";

export default function CustomAlert({
  open,
  message,
  severity,
  onClose,
}: {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
  onClose: () => void;
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
