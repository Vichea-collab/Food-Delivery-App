import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import "./User.css";
import { useNavigate } from "react-router-dom";

const User = () => {
  const { token, admin, url } = useContext(StoreContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "" });

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${url}/api/user/list`, {
        headers: { token },
      });
      if (res.data.success) {
        const filteredUsers = res.data.data.filter((user) => user.role !== "admin");
        setUsers(filteredUsers);
      } else {
        toast.error("Failed to load users");
      }
    } catch (err) {
      toast.error("Error loading users");
    }
  };

  const deleteUser = async (userIdToDelete) => {
  try {
    const res = await axios.post(`${url}/api/user/delete`, {
      id: userIdToDelete,
      userId: localStorage.getItem("userId"), // match backend expectation
    }, {
      headers: { token },
    });

    if (res.data.success) {
      toast.success(res.data.message);
      fetchUsers();
    } else {
      toast.error(res.data.message);
    }
  } catch (err) {
    toast.error("Error deleting user");
  }
};


  const addUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/api/user/register`, newUser);
      if (res.data.success) {
        toast.success("User created successfully");
        setNewUser({ name: "", email: "", password: "" });
        fetchUsers();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("Error creating user");
    }
  };

  useEffect(() => {
    if (!admin && !token) {
      toast.error("Please Login First");
      navigate("/");
    }
    fetchUsers();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All User List</p>

      <form className="user-form" onSubmit={addUser}>
        <input type="text" placeholder="Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required />
        <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />
        <input type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
        <button type="submit">Add User</button>
      </form>

      <div className="list-table">
        <div className="list-table-format title">
          <b>Name</b>
          <b>Email</b>
          <b>Role</b>
          <b>Action</b>
        </div>
        {users.map((user, index) => (
          <div key={index} className="list-table-format">
            <p>{user.name}</p>
            <p>{user.email}</p>
            <p>{user.role}</p>
            <p onClick={() => deleteUser(user._id)} className="cursor">
              X
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default User;
