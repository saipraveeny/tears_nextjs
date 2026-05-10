import { useState } from "react";
import {
  Button,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { usePhonePePayment } from "../../hooks/usePhonePePayment";
import PaymentStatusModal from "./PaymentStatusModal";
import styles from "./PaymentForm.module.css";

interface PaymentFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  landmark: string;
  paymentMethod: "upi" | "card" | "netbanking";
}

export const PaymentForm = () => {
  const [formData, setFormData] = useState<PaymentFormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    landmark: "",
    paymentMethod: "upi",
  });
  const [showModal, setShowModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "success" | "pending" | "failure" | null
  >(null);

  const { initiatePayment } = usePhonePePayment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await initiatePayment(formData);
      setPaymentStatus(response.status);
      setShowModal(true);
    } catch (error) {
      setPaymentStatus("failure");
      setShowModal(true);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <TextField
          label="First Name"
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
          required
        />
        <TextField
          label="Middle Name"
          value={formData.middleName}
          onChange={(e) =>
            setFormData({ ...formData, middleName: e.target.value })
          }
        />
        <TextField
          label="Last Name"
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
          required
        />
        <TextField
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <TextField
          label="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
        <TextField
          label="Address"
          multiline
          rows={3}
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          required
        />
        <TextField
          label="Landmark"
          value={formData.landmark}
          onChange={(e) =>
            setFormData({ ...formData, landmark: e.target.value })
          }
        />

        <FormControl component="fieldset">
          <RadioGroup
            value={formData.paymentMethod}
            onChange={(e) =>
              setFormData({
                ...formData,
                paymentMethod: e.target
                  .value as PaymentFormData["paymentMethod"],
              })
            }
          >
            <FormControlLabel value="upi" control={<Radio />} label="UPI" />
            <FormControlLabel value="card" control={<Radio />} label="Card" />
            <FormControlLabel
              value="netbanking"
              control={<Radio />}
              label="Net Banking"
            />
          </RadioGroup>
        </FormControl>

        <Button type="submit" variant="contained" color="primary">
          Proceed to Payment
        </Button>
      </form>

      <PaymentStatusModal
        open={showModal}
        status={paymentStatus}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};
