import React, { useContext, useEffect, useState } from "react";
import "./Login.css";
import { toast } from "react-toastify";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Login = ({ url }) => {
  const navigate = useNavigate();
  const { admin, setAdmin, token, setToken } = useContext(StoreContext);
  const [data, setData] = useState({ email: "", password: "" });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${url}/api/user/login`, data);

      if (res.data.success) {
        const { token, role, userId } = res.data;

        if (role === "admin") {
          // ✅ Store credentials
          setToken(token);
          setAdmin(true);
          localStorage.setItem("token", token);
          localStorage.setItem("admin", true);
          localStorage.setItem("userId", userId); // 🔑 Needed for deletion and dashboard access

          toast.success("Login Successfully");
          navigate("/dashboard");
        } else {
          toast.error("Access denied: You are not an admin.");
        }
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Server error. Please try again.");
    }
  };

  useEffect(() => {
    if (admin && token) {
      navigate("/dashboard"); // ✅ Already logged in
    }
  }, [admin, token, navigate]);

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>Admin Login</h2>
        </div>
        <div className="login-popup-inputs">
          <input
            name="email"
            type="email"
            placeholder="Your email"
            value={data.email}
            onChange={onChangeHandler}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Your password"
            value={data.password}
            onChange={onChangeHandler}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
