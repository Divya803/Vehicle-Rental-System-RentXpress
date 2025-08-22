import React, { useState, useEffect } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Button from "../../components/Button/Button";
import Table, { TableRow } from "../../components/Table/Table";
import Modal from "../../components/Modal/Modal";
import AdminCard from "../../components/AdminCard/AdminCard";
import "./OwnerDashboard.css";
import {
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaCar,
  FaCalendarAlt,
  FaDollarSign,
  FaExclamationTriangle,
  FaPlus,
  FaEdit,
  FaEye,
  FaPause,
  FaPlay
} from "react-icons/fa";
import axios from "axios";

// Mock data for vehicles
const mockVehicles = [
  {
    vehicleId: "V001",
    vehicleName: "Toyota Camry 2022",
    category: "Car",
    price: 5000,
    withDriverPrice: 7500,
    status: "approved",
    isAvailable: true,
    description: "Comfortable sedan perfect for city drives and long trips. Features leather seats, GPS navigation, and excellent fuel efficiency."
  },
  {
    vehicleId: "V002",
    vehicleName: "Honda CR-V",
    category: "SUV",
    price: 6500,
    withDriverPrice: 9000,
    status: "approved",
    isAvailable: false,
    description: "Spacious SUV ideal for family trips. Comes with all-wheel drive, premium sound system, and ample cargo space."
  },
  {
    vehicleId: "V003",
    vehicleName: "Ford Transit Van",
    category: "Van",
    price: 8000,
    withDriverPrice: 11000,
    status: "pending",
    isAvailable: true,
    description: "Large van perfect for group transportation or moving cargo. Can accommodate up to 12 passengers comfortably."
  },
  {
    vehicleId: "V004",
    vehicleName: "BMW X5",
    category: "SUV",
    price: 12000,
    withDriverPrice: 15500,
    status: "approved",
    isAvailable: true,
    description: "Luxury SUV with premium features including heated seats, panoramic sunroof, and advanced safety systems."
  },
  {
    vehicleId: "V005",
    vehicleName: "Nissan Leaf",
    category: "Car",
    price: 4500,
    withDriverPrice: 6500,
    status: "rejected",
    isAvailable: false,
    description: "Electric vehicle with zero emissions. Perfect for eco-conscious travelers with a range of 250km per charge.",
    issueDetails: "Vehicle documentation incomplete. Please provide valid registration certificate and insurance papers."
  },
  {
    vehicleId: "V006",
    vehicleName: "Mercedes Sprinter",
    category: "Van",
    price: 10000,
    withDriverPrice: 13500,
    status: "approved",
    isAvailable: true,
    description: "Premium van service for VIP transportation. Features leather interior, climate control, and entertainment system."
  },
  {
    vehicleId: "V007",
    vehicleName: "Yamaha R15",
    category: "Motorcycle",
    price: 2000,
    withDriverPrice: 3000,
    status: "pending",
    isAvailable: true,
    description: "Sports motorcycle perfect for quick city commutes. Excellent fuel efficiency and stylish design."
  },
  {
    vehicleId: "V008",
    vehicleName: "Isuzu D-Max",
    category: "Truck",
    price: 7500,
    withDriverPrice: 10000,
    status: "approved",
    isAvailable: true,
    description: "Reliable pickup truck for cargo transportation. High payload capacity and 4WD capability for all terrains."
  }
];

// Mock data for bookings
const mockBookings = [
  {
    reservationId: "R001",
    vehicle: { vehicleName: "Toyota Camry 2022" },
    user: { firstName: "John", lastName: "Silva" },
    startDate: "2025-08-20",
    endDate: "2025-08-22",
    totalAmount: 10000,
    status: "confirmed"
  },
  {
    reservationId: "R002",
    vehicle: { vehicleName: "BMW X5" },
    user: { firstName: "Sarah", lastName: "Fernando" },
    startDate: "2025-08-18",
    endDate: "2025-08-20",
    totalAmount: 24000,
    status: "completed"
  },
  {
    reservationId: "R003",
    vehicle: { vehicleName: "Honda CR-V" },
    user: { firstName: "Michael", lastName: "Perera" },
    startDate: "2025-08-25",
    endDate: "2025-08-27",
    totalAmount: 13000,
    status: "pending"
  },
  {
    reservationId: "R004",
    vehicle: { vehicleName: "Mercedes Sprinter" },
    user: { firstName: "David", lastName: "Jayawardena" },
    startDate: "2025-08-15",
    endDate: "2025-08-17",
    totalAmount: 20000,
    status: "completed"
  },
  {
    reservationId: "R005",
    vehicle: { vehicleName: "Toyota Camry 2022" },
    user: { firstName: "Lisa", lastName: "Wijesinghe" },
    startDate: "2025-08-10",
    endDate: "2025-08-12",
    totalAmount: 10000,
    status: "completed"
  }
];

const VehicleOwnerDashboard = () => {
  // Use mock data instead of empty arrays
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [bookings, setBookings] = useState(mockBookings);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeVehicles: 0,
    pendingApproval: 0,
    totalEarnings: 0
  });
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({ firstName: "Samantha", lastName: "Perera" });

  // Form state for adding/editing vehicles
  const [vehicleForm, setVehicleForm] = useState({
    vehicleName: "",
    price: "",
    withDriverPrice: "",
    category: "",
    description: "",
    image: null
  });

  useEffect(() => {
    const loadMockData = async () => {
      // Simulate API loading time
      setTimeout(() => {
        // Calculate stats from mock data
        setStats({
          totalVehicles: mockVehicles.length,
          activeVehicles: mockVehicles.filter(v => v.status === 'approved' && v.isAvailable).length,
          pendingApproval: mockVehicles.filter(v => v.status === 'pending').length,
          totalEarnings: mockBookings
            .filter(b => b.status === 'confirmed' || b.status === 'completed')
            .reduce((sum, b) => sum + (b.totalAmount || 0), 0)
        });
        
        setLoading(false);
      }, 1000); // 1 second loading simulation
    };

    loadMockData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <FaCheckCircle style={{ color: "#10B981" }} />;
      case "pending":
        return <FaClock style={{ color: "#F59E0B" }} />;
      case "rejected":
        return <FaTimesCircle style={{ color: "#EF4444" }} />;
      default:
        return <FaExclamationTriangle style={{ color: "#6B7280" }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "#10B981";
      case "pending":
        return "#F59E0B";
      case "rejected":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    
    // Mock adding vehicle
    const newVehicle = {
      vehicleId: `V${String(vehicles.length + 1).padStart(3, '0')}`,
      vehicleName: vehicleForm.vehicleName,
      category: vehicleForm.category,
      price: parseFloat(vehicleForm.price),
      withDriverPrice: parseFloat(vehicleForm.withDriverPrice),
      status: "pending",
      isAvailable: true,
      description: vehicleForm.description || ""
    };

    // Add to vehicles array
    setVehicles([...vehicles, newVehicle]);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      totalVehicles: prev.totalVehicles + 1,
      pendingApproval: prev.pendingApproval + 1
    }));

    alert("Vehicle added successfully! Waiting for admin approval.");
    setIsAddModalOpen(false);
    setVehicleForm({
      vehicleName: "",
      price: "",
      withDriverPrice: "",
      category: "",
      description: "",
      image: null
    });
  };

  const toggleVehicleAvailability = async (vehicleId, currentStatus) => {
    // Mock toggle availability
    const updatedVehicles = vehicles.map(v => 
      v.vehicleId === vehicleId 
        ? { ...v, isAvailable: !currentStatus }
        : v
    );
    
    setVehicles(updatedVehicles);
    
    // Update active vehicles count
    setStats(prev => ({
      ...prev,
      activeVehicles: updatedVehicles.filter(v => v.status === 'approved' && v.isAvailable).length
    }));
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
        <NavigationBar />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
      <NavigationBar />

      {/* Welcome Section */}
      <div className="welcome-section">
        <h1>Welcome back, {userInfo.firstName || "Vehicle Owner"}!</h1>
        <p>Manage your vehicles and track your earnings</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "flex", padding: "0 50px", gap: "20px", marginBottom: "20px" }}>
        <AdminCard>
          <div style={{ display: "flex" }}>
            <div>
              <div className="Dash-card">Total Vehicles</div>
              <div className="count">{stats.totalVehicles}</div>
            </div>
            <div className="user-icon">
              <FaCar />
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <div style={{ display: "flex" }}>
            <div>
              <div className="Dash-card">Active</div>
              <div className="count">{stats.activeVehicles}</div>
            </div>
            <div className="user-icon">
              <FaCheckCircle />
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <div style={{ display: "flex" }}>
            <div>
              <div className="Dash-card">Pending</div>
              <div className="count">{stats.pendingApproval}</div>
            </div>
            <div className="user-icon">
              <FaClock />
            </div>
          </div>
        </AdminCard>

        <AdminCard>
          <div style={{ display: "flex" }}>
            <div>
              <div className="Dash-card">Earnings</div>
              <div className="count">Rs. {stats.totalEarnings.toLocaleString()}</div>
            </div>
            <div className="user-icon">
              <FaDollarSign />
            </div>
          </div>
        </AdminCard>
      </div>

      <div style={{ display: "flex", gap: "20px", padding: "0 50px" }}>
        {/* Vehicles Section */}
        <div className="dashboard-section vehicles-section">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <FaCar style={{ color: "#00A8A8", fontSize: "24px" }} />
              <p style={{ fontSize: "1.75rem", fontWeight: "500", margin: 0 }}>
                My Vehicles
              </p>
            </div>
            <Button
              value="Add Vehicle"
              type="button"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
              }}
              onClick={() => setIsAddModalOpen(true)}
            >
              <FaPlus /> Add Vehicle
            </Button>
          </div>

          <div style={{ height: "400px", overflowY: "auto" }}>
            {vehicles.length > 0 ? (
              <Table hover={true} style={{ fontSize: "1.10rem" }}>
                <TableRow
                  data={[
                    "Vehicle",
                    "Category",
                    "Price/Day",
                    "Status",
                    "Available",
                    "Actions",
                  ]}
                />
                {vehicles.map((vehicle) => (
                  <TableRow
                    key={vehicle.vehicleId}
                    data={[
                      vehicle.vehicleName,
                      vehicle.category,
                      `Rs. ${vehicle.price.toLocaleString()}`,
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {getStatusIcon(vehicle.status)}
                        <span style={{ color: getStatusColor(vehicle.status) }}>
                          {vehicle.status}
                        </span>
                      </div>,
                      vehicle.status === 'approved' ? (
                        <span style={{ 
                          color: vehicle.isAvailable ? "#10B981" : "#EF4444" 
                        }}>
                          {vehicle.isAvailable ? "Yes" : "No"}
                        </span>
                      ) : "N/A",
                      <div style={{ display: "flex", gap: "8px" }}>
                        <Button
                          type="button"
                          value="View"
                          outlined
                          style={{ padding: "6px 12px", fontSize: "0.9rem" }}
                          onClick={() => {
                            setSelectedVehicle(vehicle);
                            setIsDetailsModalOpen(true);
                          }}
                        >
                          <FaEye />
                        </Button>
                        {vehicle.status === 'approved' && (
                          <Button
                            type="button"
                            value={vehicle.isAvailable ? "Pause" : "Activate"}
                            outlined
                            style={{ 
                              padding: "6px 12px", 
                              fontSize: "0.9rem",
                              color: vehicle.isAvailable ? "#F59E0B" : "#10B981"
                            }}
                            onClick={() => toggleVehicleAvailability(
                              vehicle.vehicleId, 
                              vehicle.isAvailable
                            )}
                          >
                            {vehicle.isAvailable ? <FaPause /> : <FaPlay />}
                          </Button>
                        )}
                      </div>,
                    ]}
                  />
                ))}
              </Table>
            ) : (
              <div className="empty-state">
                <FaCar className="empty-state-icon" />
                <p>No vehicles added yet</p>
                <Button
                  value="Add Your First Vehicle"
                  type="button"
                  style={{ marginTop: "10px" }}
                  onClick={() => setIsAddModalOpen(true)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Bookings Section */}
        <div className="dashboard-section bookings-section">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <FaCalendarAlt style={{ color: "#00A8A8", fontSize: "24px" }} />
            <p style={{ fontSize: "1.75rem", fontWeight: "500", margin: 0 }}>
              Recent Bookings
            </p>
          </div>

          <div style={{ height: "400px", overflowY: "auto" }}>
            {bookings.length > 0 ? (
              <Table hover={true} style={{ fontSize: "1.10rem" }}>
                <TableRow
                  data={[
                    "Vehicle",
                    "Customer",
                    "Date Range",
                    "Amount",
                    "Status",
                  ]}
                />
                {bookings.slice(0, 8).map((booking, index) => (
                  <TableRow
                    key={booking.reservationId || index}
                    data={[
                      booking.vehicle?.vehicleName || "N/A",
                      booking.user?.firstName + " " + booking.user?.lastName || "N/A",
                      `${formatDate(booking.startDate)} - ${formatDate(
                        booking.endDate
                      )}`,
                      `Rs. ${booking.totalAmount.toLocaleString()}`,
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {getStatusIcon(booking.status)}
                        <span style={{ color: getStatusColor(booking.status) }}>
                          {booking.status}
                        </span>
                      </div>,
                    ]}
                  />
                ))}
              </Table>
            ) : (
              <div className="empty-state">
                <FaCalendarAlt className="empty-state-icon" />
                <p>No bookings yet</p>
                <p style={{ fontSize: "0.9rem", marginTop: "10px" }}>
                  Bookings will appear here once customers rent your vehicles
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vehicle Details Modal */}
      <Modal
        open={isDetailsModalOpen}
        close={() => setIsDetailsModalOpen(false)}
        footer={false}
      >
        {selectedVehicle && (
          <div style={{ padding: "20px", maxWidth: "600px" }}>
            <h2 style={{ marginBottom: "20px", color: "#333" }}>
              Vehicle Details
            </h2>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <p><strong>Name:</strong> {selectedVehicle.vehicleName}</p>
              <p><strong>Category:</strong> {selectedVehicle.category}</p>
              <p><strong>Price per Day:</strong> Rs. {selectedVehicle.price.toLocaleString()}</p>
              <p><strong>With Driver:</strong> Rs. {selectedVehicle.withDriverPrice.toLocaleString()}</p>
              <p><strong>Status:</strong> 
                <span style={{ color: getStatusColor(selectedVehicle.status), marginLeft: "8px" }}>
                  {selectedVehicle.status}
                </span>
              </p>
              <p><strong>Available:</strong> 
                <span style={{ 
                  color: selectedVehicle.isAvailable ? "#10B981" : "#EF4444",
                  marginLeft: "8px"
                }}>
                  {selectedVehicle.isAvailable ? "Yes" : "No"}
                </span>
              </p>
            </div>

            {selectedVehicle.description && (
              <div style={{ marginTop: "15px" }}>
                <p><strong>Description:</strong></p>
                <p style={{ 
                  backgroundColor: "#f5f5f5", 
                  padding: "10px", 
                  borderRadius: "5px",
                  marginTop: "5px"
                }}>
                  {selectedVehicle.description}
                </p>
              </div>
            )}

            {selectedVehicle.status === 'rejected' && selectedVehicle.issueDetails && (
              <div style={{
                marginTop: "15px",
                backgroundColor: "#FEE2E2",
                border: "1px solid #EF4444",
                borderRadius: "5px",
                padding: "15px"
              }}>
                <p style={{ color: "#EF4444", fontWeight: "bold", margin: "0 0 10px 0" }}>
                  Rejection Reason:
                </p>
                <p style={{ margin: 0, color: "#333" }}>
                  {selectedVehicle.issueDetails}
                </p>
              </div>
            )}

            <div style={{ 
              display: "flex", 
              justifyContent: "flex-end", 
              gap: "10px", 
              marginTop: "20px" 
            }}>
              <Button 
                value="Close" 
                type="button" 
                outlined 
                onClick={() => setIsDetailsModalOpen(false)} 
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Add Vehicle Modal */}
      <Modal
        open={isAddModalOpen}
        close={() => setIsAddModalOpen(false)}
        footer={false}
      >
        <div style={{ padding: "20px", maxWidth: "500px" }}>
          <h2 style={{ marginBottom: "20px", color: "#333" }}>Add New Vehicle</h2>
          
          <form onSubmit={handleAddVehicle}>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Vehicle Name *
              </label>
              <input
                type="text"
                required
                value={vehicleForm.vehicleName}
                onChange={(e) => setVehicleForm({...vehicleForm, vehicleName: e.target.value})}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  fontSize: "1rem"
                }}
                placeholder="Enter vehicle name"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                  Price per Day (Rs) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={vehicleForm.price}
                  onChange={(e) => setVehicleForm({...vehicleForm, price: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    fontSize: "1rem"
                  }}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                  With Driver (Rs) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={vehicleForm.withDriverPrice}
                  onChange={(e) => setVehicleForm({...vehicleForm, withDriverPrice: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    fontSize: "1rem"
                  }}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Category *
              </label>
              <select
                required
                value={vehicleForm.category}
                onChange={(e) => setVehicleForm({...vehicleForm, category: e.target.value})}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  fontSize: "1rem"
                }}
              >
                <option value="">Select category</option>
                <option value="Car">Car</option>
                <option value="Van">Van</option>
                <option value="Bus">Bus</option>
                <option value="Truck">Truck</option>
                <option value="Motorcycle">Motorcycle</option>
                <option value="SUV">SUV</option>
              </select>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Vehicle Image *
              </label>
              <input
                type="file"
                required
                accept="image/*"
                onChange={(e) => setVehicleForm({...vehicleForm, image: e.target.files[0]})}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  fontSize: "1rem"
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Description
              </label>
              <textarea
                value={vehicleForm.description}
                onChange={(e) => setVehicleForm({...vehicleForm, description: e.target.value})}
                style={{
                  width: "100%",
                  height: "100px",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  fontSize: "1rem",
                  resize: "vertical"
                }}
                placeholder="Describe your vehicle (optional)"
              />
            </div>

            <div style={{ 
              display: "flex", 
              justifyContent: "flex-end", 
              gap: "10px" 
            }}>
              <Button 
                value="Cancel" 
                type="button" 
                outlined 
                onClick={() => {
                  setIsAddModalOpen(false);
                  setVehicleForm({
                    vehicleName: "",
                    price: "",
                    withDriverPrice: "",
                    category: "",
                    description: "",
                    image: null
                  });
                }} 
              />
              <Button 
                value="Add Vehicle" 
                type="submit"
              />
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default VehicleOwnerDashboard;