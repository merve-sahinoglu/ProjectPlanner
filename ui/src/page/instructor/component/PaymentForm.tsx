import { useState } from "react";
import { useTranslation } from "react-i18next";
import Dictionary from "../../../helpers/translation/dictionary/dictionary";
import { Payment } from "../types/payment";

interface PaymentFormProps {
  instructorId: string;
  onSave: (payment: Payment) => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ instructorId, onSave, onCancel }) => {
  const { t } = useTranslation();
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
      <h2>{t(Dictionary.Instructor.Payment.DESCRIPTION)}</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder={t(Dictionary.Instructor.Payment.AMOUNT)}
      />
      <button onClick={handleSubmit}>{t(Dictionary.Button.SAVE)}</button>
      <button onClick={onCancel}>{t(Dictionary.Button.CANCEL)}</button>
    </div>
  );
};

export default PaymentForm;