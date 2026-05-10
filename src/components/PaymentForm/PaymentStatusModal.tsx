import { Modal, Box, Typography, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import PendingIcon from "@mui/icons-material/Pending";

interface PaymentStatusModalProps {
  open: boolean;
  status: "success" | "pending" | "failure" | null;
  onClose: () => void;
}

const PaymentStatusModal = ({
  open,
  status,
  onClose,
}: PaymentStatusModalProps) => {
  const getStatusContent = () => {
    switch (status) {
      case "success":
        return {
          icon: (
            <CheckCircleIcon sx={{ fontSize: 60, color: "success.main" }} />
          ),
          title: "Payment Successful",
          message: "Your payment has been processed successfully.",
        };
      case "pending":
        return {
          icon: <PendingIcon sx={{ fontSize: 60, color: "warning.main" }} />,
          title: "Payment Pending",
          message: "Your payment is being processed. Please wait.",
        };
      case "failure":
        return {
          icon: <ErrorIcon sx={{ fontSize: 60, color: "error.main" }} />,
          title: "Payment Failed",
          message:
            "Sorry, your payment could not be processed. Please try again.",
        };
      default:
        return null;
    }
  };

  const content = getStatusContent();

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          textAlign: "center",
        }}
      >
        {content && (
          <>
            {content.icon}
            <Typography variant="h5" sx={{ mt: 2 }}>
              {content.title}
            </Typography>
            <Typography sx={{ mt: 2 }}>{content.message}</Typography>
            <Button variant="contained" onClick={onClose} sx={{ mt: 3 }}>
              Close
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default PaymentStatusModal;
