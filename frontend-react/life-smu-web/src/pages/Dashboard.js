import React, { useState } from 'react';
import '../styles/Dashboard/Dashboard.css';
import logo from '../assets/logo.png'
import ListOfUsers from '../components/ListOfUsers';


const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('addItem'); 

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
 
  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return( 
          <>
            <div className={`content ${isSidebarOpen ? 'open' : ''}`}> Users</div>;
            <ListOfUsers isSidebarOpen={isSidebarOpen}/>
          </>
        )
      default:
        return( 
            <>
              <div className={`content ${isSidebarOpen ? 'open' : ''}`}> Users</div>;
              <ListOfUsers isSidebarOpen={isSidebarOpen}/>
            </>
          )
    }
  };

  return (
    <div className={`dashboard ${isSidebarOpen ? 'open' : ''}`}>
      <button className={`toggle-btn ${isSidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}>
      {isSidebarOpen ? '✖' : '☰'}
      </button>
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
        </ul>
      </div>

      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
