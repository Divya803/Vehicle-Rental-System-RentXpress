import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import HomeNavigationBar from "../../components/NavigationBar/NavigationBar";
import "./HomePage.css";
import Car from "../../assets/Car.png";
import Button from "../../components/Button/Button";

const HomePage = () => {
  return (
    <div className="home-page-container">
      <HomeNavigationBar />
      <div className="home-content">
        <div className="left-section">
          <div className="heading">ELEVATE YOUR RIDE</div>
          <div className="description">
            Welcome to RentXpress. Your trusted partner for convenient and hassle-free vehicle rentals.
            Explore our wide range of vehicles and enjoy a seamless booking experience, whether you're traveling for business or leisure!
          </div>
          <div className="btn">
            <Link to="/login">
              <Button value="Login" style={{ fontSize: "16px", width: "100px" }} />
            </Link>
          </div>
        </div>
        <div className="right-section"></div>
        <img src={Car} className="car-img" alt="Car" />
      </div>
    </div>
  );
};

export default HomePage;
