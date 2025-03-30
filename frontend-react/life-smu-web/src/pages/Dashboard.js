import React, { useState } from 'react';
import '../styles/Dashboard/Dashboard.css';
import logo from '../assets/logo.png'
import ListOfUsers from '../components/ListOfUsers';
import ListOfClubs from '../components/ListOfClubs';
import { Box, Heading ,Flex} from '@chakra-ui/react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ListOfStudentLifeM from '../components/ListOfStudentLifeM';
import EventCalendar from '../components/EventCalendar';


const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("users");

  console.log(activeSection)
 
  const renderContent = () => {
    switch (activeSection) {
      case "users":
        return <ListOfUsers />;
      case "clubs":
        return <ListOfClubs />;
      case "Student Life Members":
        return <ListOfStudentLifeM/>;
      case "Events":
        return <EventCalendar/>;
      default:
        return <div>Welcome to the Dashboard!</div>;
    }
  };

  return (
    <>
     
   <Header />
   <Flex>
      {/* Sidebar */}
      <Sidebar onSelectSection={setActiveSection} />
      
      {/* Main Content */}
      <Box ml="250px" p={6} flex="1">
        
        {renderContent()}
      </Box>
    </Flex>
       {/**
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`} >
        <div className={`header ${isSidebarOpen ? 'open' : ''}`} >
          <img src={logo} alt='logo' style={{width: "80px",height: "80px",objectFit: "cover", borderRadius: "4px"}}/>
          <h2 style={{ marginTop:"50px" }}> Dashboard</h2>
        </div>
        <ul>
          
          
          <li
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            Users
          </li>
          <li
            className={activeTab === 'clubs' ? 'active' : ''}
            onClick={() => setActiveTab('clubs')}
          >
            Clubs
          </li>
        </ul>
      </div>
 */}
 {/**
      <div className="main-content">
        {renderContent()}
      </div>
      */}
    
  
    </>
  );
  
};


export default Dashboard;
