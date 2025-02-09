import { useState } from "react";
import { Payment } from "../types/payment";

interface PaymentFormProps {
  instructorId: string;
  onSave: (payment: Payment) => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ instructorId, onSave, onCancel }) => {
  const [amount, setAmount] = useState(0);

  const handleSubmit = () => {
    const payment: Payment = {
      id: crypto.randomUUID(),
      instructorId,
      amount,
      date: new Date().toISOString(),
    };
    onSave(payment);
  };

  return (
    <div>
      <h2>Make Payment</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Amount"
      />
      <button onClick={handleSubmit}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default PaymentForm;