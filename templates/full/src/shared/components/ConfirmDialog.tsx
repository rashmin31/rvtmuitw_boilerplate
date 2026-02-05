import type { ReactNode } from "react";
import { AppDialog } from "@shared";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
  children?: ReactNode;
};

export const ConfirmDialog = (props: ConfirmDialogProps) => (
  <AppDialog {...props} />
);
