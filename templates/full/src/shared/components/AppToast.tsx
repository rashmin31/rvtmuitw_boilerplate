import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import type { PropsWithChildren } from "react";

type Toast = { message: string; severity?: "success" | "error" | "info" | "warning" };

type ToastContextValue = {
  showToast: (toast: Toast) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const AppToastProvider = ({ children }: PropsWithChildren) => {
  const [toast, setToast] = useState<Toast | null>(null);
  const showToast = useCallback((nextToast: Toast) => setToast(nextToast), []);
  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {toast ? (
          <Alert severity={toast.severity ?? "info"} onClose={() => setToast(null)}>
            {toast.message}
          </Alert>
        ) : null}
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within AppToastProvider");
  }
  return context;
};
