import React, { useState } from 'react';
import '../styles/Dashboard/Dashboard.css';
import ListOfUsers from '../components/ListOfUsers';
import ListOfClubs from '../components/ListOfClubs';
import Sidebar from '../components/Sidebar';
import ListOfStudentLifeM from '../components/ListOfStudentLifeM';
import EventCalendar from '../components/EventCalendar';

import { Box } from "@chakra-ui/react"

import Header from '../components/Header';


const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("users");

  console.log(activeSection);

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
      default:
        return <div>Welcome to the Dashboard!</div>;
    }
  };

  return (

    <>
    
    <div style={{ display: 'flex' }}>
      
      {/* Sidebar */}
      <Sidebar setActiveSection={setActiveSection} activeSection={activeSection} />

{/* Main Content */}
{/* Main Content */}
<div
  style={{
    marginLeft: '250px',
    paddingLeft: '4px',
    paddingRight: '5px',
    paddingTop: '5px',
    paddingBottom: '5px',
    width: 'calc(100% - 250px)',
    height: '100vh',
    overflowY: 'auto',
  }}
>
  <Header />
  <div style={{ padding: '20px' }}>
    {renderContent()}
  </div>
</div>

      </div>
   
    </>
  );
};

export default Dashboard;
