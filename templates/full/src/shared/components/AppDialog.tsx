import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@mui/material";
import type { ReactNode } from "react";
import { AppButton } from "@shared";

type AppDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  onClose?: () => void;
  onConfirm?: () => void;
  children?: ReactNode;
};

export const AppDialog = ({
  open,
  title,
  description,
  confirmLabel = "Close",
  onClose,
  onConfirm,
  children
}: AppDialogProps) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      {description && <Typography>{description}</Typography>}
      {children}
    </DialogContent>
    <DialogActions>
      <AppButton onClick={onConfirm ?? onClose}>{confirmLabel}</AppButton>
    </DialogActions>
  </Dialog>
);
