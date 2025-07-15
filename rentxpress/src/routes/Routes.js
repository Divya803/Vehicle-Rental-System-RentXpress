
import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";
import HomePage from "../pages/HomePage/HomePage";
import Login from "../pages/Login/Login";
import RentVehicles from "../pages/RentVehicles/RentVehicle";
import Signup from "../pages/Signup/Signup";
import UserDetails from "../pages/UserDetails/UserDetails";
import UserProfile from "../pages/UserProfile/UserProfile";
import Vehicles from "../pages/Vehicles/Vehicles";
import VerifyAccount from "../pages/VerifyAccount/VerifyAccount";
import PostVehicle from "../pages/PostVehicle/PostVehicle";
import PendingVehicle from "../pages/PendingVehicles/PendingVehicles";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/rent-vehicles" element={<RentVehicles />} /> */}
      <Route path="/rent-vehicles/:vehicleId" element={<RentVehicles />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/user-details" element={<UserDetails />} />
      <Route path="/user-profile" element={<UserProfile />} />
      <Route path="/vehicles" element={<Vehicles />} />
      <Route path="/verify-account" element={<VerifyAccount />} />
      <Route path="/post-vehicle" element={<PostVehicle />} />
      <Route path="/pending-vehicle" element={<PendingVehicle />} />
    </Routes>
  );
}

export default AppRoutes;
