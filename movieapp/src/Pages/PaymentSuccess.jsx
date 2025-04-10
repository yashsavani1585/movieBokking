// Frontend: PaymentSuccess.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/my-tickets");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container text-center mt-5">
      <h2>✅ Payment Successful!</h2>
      <p>Redirecting to your tickets...</p>
    </div>
  );
};

export default PaymentSuccess;