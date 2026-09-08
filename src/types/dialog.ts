export type DeleteDialogProps = {
  onClose: () => void;
  onConfirm: () => void;
  deleteLoading?: boolean;
  showDialog: boolean;
  title?: string;
  action?: string;
};
