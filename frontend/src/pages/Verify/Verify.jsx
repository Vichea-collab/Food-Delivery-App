import React, { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext'; // 🔍 check path
import axios from 'axios';
import { toast } from 'react-toastify';
import './Verify.css';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url } = useContext(StoreContext); // ✅ won't fail unless StoreContext is null
  const navigate = useNavigate();

  const verifyPayment = async () => {
    try {
      const response = await axios.post(`${url}/api/order/verify`, {
        success,
        orderId,
      });
      console.log("Verify API response:", response.data);
      if (response.data.success) {
        toast.success("Order Placed Successfully");
        navigate("/myorders");
      } else {
        toast.error("Something went wrong");
        navigate("/");
      }
    } catch (err) {
      console.error("Verification error:", err);
      toast.error("Error verifying order");
      navigate("/");
    }
  };

  useEffect(() => {
    console.log("🔍 Verifying:", { success, orderId });
    verifyPayment();
  }, []);

  return (
    <div className='verify'>
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
