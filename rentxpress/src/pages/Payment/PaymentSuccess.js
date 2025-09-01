import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Extract session_id from URL parameters
        const urlParams = new URLSearchParams(location.search);
        const sessionId = urlParams.get('session_id');

        if (sessionId) {
          // Verify payment status with backend
          const response = await axios.get(`http://localhost:5000/api/payments/verify-session/${sessionId}`);
          setPaymentStatus(response.data);
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setPaymentStatus({ status: 'error' });
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [location]);

  const handleGoHome = () => {
    navigate('/'); 
  };

  const handleViewReservations = () => {
    navigate('/reservations');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div>Processing payment...</div>
        <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          Please wait while we confirm your payment
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        {paymentStatus?.status === 'error' ? (
          <>
            <div style={{ fontSize: '48px', color: '#ff4757', marginBottom: '20px' }}>❌</div>
            <h2 style={{ color: '#ff4757', marginBottom: '20px' }}>Payment Verification Failed</h2>
            <p style={{ color: '#666', marginBottom: '30px' }}>
              There was an issue verifying your payment. Please contact support if the amount was charged.
            </p>
          </>
        ) : (
          <>
            <div style={{ fontSize: '48px', color: '#2ed573', marginBottom: '20px' }}>✅</div>
            <h2 style={{ color: '#2ed573', marginBottom: '20px' }}>Payment Successful!</h2>
            <p style={{ color: '#666', marginBottom: '30px' }}>
              Thank you for your payment. Your vehicle reservation has been confirmed.
            </p>
          </>
        )}
        
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button
            onClick={handleViewReservations}
            style={{
              backgroundColor: '#3742fa',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            View Reservations
          </button>
          <button
            onClick={handleGoHome}
            style={{
              backgroundColor: '#747d8c',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;