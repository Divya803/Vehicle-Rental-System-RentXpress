import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
  const navigate = useNavigate();

  const handleTryAgain = () => {
    navigate(-1); 
  };

  const handleGoHome = () => {
    navigate('/'); 
  };

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
        <div style={{ fontSize: '48px', color: '#ffa502', marginBottom: '20px' }}>⚠️</div>
        <h2 style={{ color: '#ffa502', marginBottom: '20px' }}>Payment Cancelled</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Your payment was cancelled. No charges were made to your account.
          You can try again or return to browse other vehicles.
        </p>
        
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button
            onClick={handleTryAgain}
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
            Try Again
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

export default PaymentCancel;