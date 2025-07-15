import React from 'react';
import "./VehicleCard.css";

const VehicleCard = ({ children }) => {
  return (
    <div className='card'>
      {children}
    </div>
  );
};

export default VehicleCard;
