"use client";

import { useCallback, useState } from "react";

export function useAlert() {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error" | "info" | "warning">("info");

  const showAlert = useCallback((message: string, severity: "success" | "error" | "info" | "warning") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  }, []);

  const handleAlertClose = useCallback(() => {
    setAlertOpen(false);
  }, []);

  return {
    alertOpen,
    alertMessage,
    alertSeverity,
    showAlert,
    handleAlertClose,
  };
}
