import React, { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import Modal from "../../components/Modal/Modal";
import Button from "../../components/Button/Button";
import Table, { TableRow } from "../../components/Table/Table";
import "./UserDetails.css";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import axios from "axios";
import { message } from "antd";

export default function Users() {
  const [userList, setUserList] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users`);
      setUserList(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      messageApi.error("Failed to fetch users ❌");
    }
  };

  const confirmDeleteUser = (userId) => {
    setUserToDelete(userId);
    setIsDeleteModalOpen(true);
  };

  const deleteUser = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userToDelete}`);
      setUserList(userList.filter((user) => user.userId !== userToDelete));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      messageApi.success("User deleted successfully");
    } catch (error) {
      console.error("Failed to delete user:", error);
      messageApi.error("Failed to delete user");
    }
  };

  return (
    <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
      {contextHolder}
      <NavigationBar />
      <div>
        <Table hover={true} style={{ marginTop: "15px", textAlign: "center" }}>
          <TableRow
            data={["First Name", "Last Name", "Email", "Role", "Contact", "NIC", "Delete"]}
            classes={["col1", "col2", "col3", "col4", "col5", "col6", "col7"]}
          />
          {userList.map((user) => (
            <TableRow
              key={user.userId}
              classes={["col1", "col2", "col3", "col4", "col5", "col6", "col7"]}
              data={[
                <span className="centered-cell">{user.firstName}</span>,
                <span className="centered-cell">{user.lastName}</span>,
                <span className="centered-cell">{user.email}</span>,
                <span className="centered-cell">{user.role}</span>,
                <span className="centered-cell">{user.phoneNo}</span>,
                <span className="centered-cell">{user.nic || "-"}</span>,
                <span className="centered-cell">
                  <RiDeleteBin6Line
                    onClick={() => confirmDeleteUser(user.userId)}
                    style={{
                      cursor: "pointer",
                      fontSize: "20px",
                      color: "red",
                    }}
                  />
                </span>,
              ]}
            />
          ))}
        </Table>

        {isDeleteModalOpen && (
          <Modal open={isDeleteModalOpen} close={() => setIsDeleteModalOpen(false)}>
            <div style={{ width: "300px", margin: "auto", textAlign: "center", fontSize: "18px" }}>
              <h4>Do you confirm to delete this user?</h4>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginTop: "20px",
                }}
              >
                <Button type="button" style={{ width: "110px" }} onClick={deleteUser} value="Yes" />
                <Button
                  type="button"
                  style={{ width: "110px" }}
                  onClick={() => setIsDeleteModalOpen(false)}
                  value="No"
                  red
                />
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
