import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CRow,
  CCol,
  CContainer,
  CSpinner,
} from "@coreui/react";
import axios from "axios";
import CountUp from "react-countup";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaFacebookF, FaInstagram, FaUsers, FaCalendarAlt, FaUserShield, FaUserPlus } from "react-icons/fa";

function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const [users, officers, events, fb, insta] = await Promise.all([
        axios.get("http://localhost:8000/api/stats/users", getConfig()),
        axios.get("http://localhost:8000/api/stats/officers", getConfig()),
        axios.get("http://localhost:8000/api/stats/events", getConfig()),
        axios.get("http://localhost:8000/api/stats/social/facebook", getConfig()),
        axios.get("http://localhost:8000/api/stats/social/instagram", getConfig()),
      ]);
      setStats({
        users: users.data,
        officers: officers.data,
        events: events.data,
        facebook: fb.data,
        instagram: insta.data,
      });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const getConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  if (loading || !stats) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  return (
    <CContainer fluid className="py-4" backgroundColor="#f7f9fc">
      <h2 className="mb-4 fw-bold text-dark">📊 Dashboard Overview</h2>

      <CRow className="mb-4 g-4">
        <CCol md={3}><StatCard icon={<FaUsers />} title="Total Users" value={stats.users.totalUsers} color="#6f42c1" /></CCol>
        <CCol md={3}><StatCard icon={<FaUserPlus />} title="New Users (7d)" value={stats.users.newUsers} color="#20c997" /></CCol>
        <CCol md={3}><StatCard icon={<FaUserShield />} title="Officers" value={stats.officers.officerCount} color="#fd7e14" /></CCol>
        <CCol md={3}><StatCard icon={<FaCalendarAlt />} title="Upcoming Events" value={stats.events.upcoming} color="#0d6efd" /></CCol>
      </CRow>

      <CRow className="mb-5 g-4">
        <CCol md={6}>
          <div className="bg-white rounded shadow p-4 h-100">
            <h5 className="mb-3 fw-semibold text-primary">📈 Event Participation</h5>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.events.participationStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="participants" fill="#4e73df" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CCol>
        <CCol md={6}>
          <div className="bg-white rounded shadow p-4 h-100">
            <h5 className="mb-3 fw-semibold text-danger">📣 Instagram Top Posts</h5>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.instagram.topPosts}>
                <XAxis dataKey="title" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="likes" stroke="#e83e8c" strokeWidth={2} />
                <Line type="monotone" dataKey="shares" stroke="#6610f2" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CCol>
      </CRow>

      <CRow className="g-4">
        <CCol md={6}><StatCard icon={<FaFacebookF />} title="Facebook Reach" value={stats.facebook.reach} color="#3b5998" /></CCol>
        <CCol md={6}><StatCard icon={<FaInstagram />} title="Instagram Followers" value={stats.instagram.followers} color="#d63384" /></CCol>
      </CRow>
    </CContainer>
  );
}

const StatCard = ({ title, value, icon, color }) => (
  <CCard
    className="shadow-sm h-100 border-0"
    style={{ borderRadius: "1rem", transition: "transform 0.3s", cursor: "pointer" }}
    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
  >
    <CCardBody className="d-flex flex-column align-items-start justify-content-center gap-2">
      <div
        className="d-flex align-items-center justify-content-center rounded-circle shadow"
        style={{ backgroundColor: color, width: "50px", height: "50px", color: "#fff", fontSize: "20px" }}
      >
        {icon}
      </div>
      <CCardTitle className="text-muted small fw-semibold text-uppercase">
        {title}
      </CCardTitle>
      <CCardText className="fs-3 fw-bold text-dark">
        <CountUp end={value} duration={1.8} separator="," />
      </CCardText>
    </CCardBody>
  </CCard>
);

export default Statistics;