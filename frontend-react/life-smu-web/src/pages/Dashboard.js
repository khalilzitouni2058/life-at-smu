import React, { useState, useEffect } from 'react';
import '../styles/Dashboard/Dashboard.css';
import ListOfUsers from '../components/ListOfUsers';
import ListOfClubs from '../components/ListOfClubs';
import Sidebar from '../components/Sidebar';
import ListOfStudentLifeM from '../components/ListOfStudentLifeM';
import EventCalendar from '../components/EventCalendar';
import { Toaster, toaster } from "../components/ui/toaster";
import Statistics from "../components/Statistics";
import Header from '../components/Header';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("users");

  useEffect(() => {
    toaster.create({
      description: "Logged in successfully",
      type: "success",
    })
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case "users":
        return <ListOfUsers />;
      case "clubs":
        return <ListOfClubs />;
      case "Student Life Members":
        return <ListOfStudentLifeM />;
      case "Events":
        return <EventCalendar />;
      case "Dashboard":
        return <Statistics />;
      default:
        return <div>Welcome to the Dashboard!</div>;
    }
  };

  return (
    <>
      <Toaster />
      <div style={{ display: 'flex' }}>
        
        {/* Sidebar */}
        <Sidebar setActiveSection={setActiveSection} activeSection={activeSection} />

        {/* Main Content */}
        <div
          style={{
            marginLeft: '250px',
            padding: '20px',
            width: 'calc(100% - 250px)',
            minHeight: '100vh',
            overflowY: 'auto',
          }}
        >
          <Header setActiveSection={setActiveSection} activeSection={activeSection} />
          
          <div style={{ marginTop: '20px' }}>
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
