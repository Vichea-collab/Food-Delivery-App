import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { FaUtensils, FaUsers, FaShoppingCart, FaDollarSign } from "react-icons/fa";
import CountUp from "react-countup";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./Dashboard.css";

const Dashboard = () => {
  const { token, admin, url } = useContext(StoreContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    foods: 0,
    orders: 0,
    users: 0,
    income: 0,
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!admin && !token) {
      navigate("/");
    }
  }, [admin, token, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const foodRes = await axios.get(`${url}/api/food/list`);
        const orderRes = await axios.get(`${url}/api/order/list`, {
          headers: { token },
        });
        const userRes = await axios.get(`${url}/api/user/list`, {
          headers: { token },
        });

        const paidOrders = orderRes.data.data.filter((order) => order.payment);
        const dailyIncome = paidOrders.reduce((total, order) => {
          const orderDate = new Date(order.date).toDateString();
          const today = new Date().toDateString();
          return orderDate === today ? total + order.amount : total;
        }, 0);

        // Filter normal (non-admin) users
        const allUsers = Array.isArray(userRes.data.data) ? userRes.data.data : [];
        const normalUsers = allUsers.filter((user) => user.role !== "admin");

        // Generate last 7 days sales chart data
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          const key = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
          const income = paidOrders.reduce((acc, order) => {
            return new Date(order.date).toLocaleDateString() ===
              date.toLocaleDateString()
              ? acc + order.amount
              : acc;
          }, 0);
          return { date: key, income };
        });

        setChartData(last7Days);

        setStats({
          foods: Array.isArray(foodRes.data.data)
            ? foodRes.data.data.length
            : 0,
          orders: Array.isArray(orderRes.data.data)
            ? orderRes.data.data.length
            : 0,
          users: normalUsers.length, // ✅ Only count non-admin users
          income: dailyIncome,
        });
      } catch (error) {
        console.error("Error loading dashboard stats", error);
      }
    };

    if (admin && token) fetchStats();
  }, [admin, token, url]);

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard Overview</h1>

      <div className="dashboard-stats">
        <div className="stat-box yellow">
          <FaUsers className="stat-icon" />
          <div>
            <span className="stat-count">
              <CountUp end={stats.users} duration={1.5} />
            </span>
            <span className="stat-label">Total Users</span>
          </div>
        </div>
        <div className="stat-box blue">
          <FaUtensils className="stat-icon" />
          <div>
            <span className="stat-count">
              <CountUp end={stats.foods} duration={1.5} />
            </span>
            <span className="stat-label">Total Foods</span>
          </div>
        </div>
        <div className="stat-box green">
          <FaShoppingCart className="stat-icon" />
          <div>
            <span className="stat-count">
              <CountUp end={stats.orders} duration={1.5} />
            </span>
            <span className="stat-label">Total Orders</span>
          </div>
        </div>
        <div className="stat-box teal">
          <FaDollarSign className="stat-icon" />
          <div>
            <span className="stat-count">
              <CountUp end={stats.income} duration={1.5} prefix="$" decimals={2} />
            </span>
            <span className="stat-label">Daily Income</span>
          </div>
        </div>
      </div>

      <div className="dashboard-chart">
        <h2>Sales in the Last 7 Days</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="income" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
