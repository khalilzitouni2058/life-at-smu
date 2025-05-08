
import React from 'react';
import {
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CSidebarNav,
  CNavGroup,
  CNavTitle,
  CButton,
} from '@coreui/react';

import CIcon from '@coreui/icons-react';
import { cilUser, cilGroup, cilCalendar } from '@coreui/icons';
import '@coreui/coreui/dist/css/coreui.min.css';
import "../styles/Dashboard/Sidebar.css"

const Sidebar = ({ setActiveSection, activeSection }) => {

  const handleNavigation = (section) => {
    console.log(`Navigating to ${section}`);
    setActiveSection(section);
  };

  return (
    <CSidebar className="border-end" style={{
      position: 'fixed',
      minHeight: '100vh', 
      height: '100%',
      width: '254px',
    }}>
      {/* Sidebar Header */}
      <CSidebarHeader style={{ padding: 20, marginBottom: '20px' }}>
        <img 
          src="https://www.smu.tn/storage/app/media/logos/LOGO_SMU_2023_FINAL.png"
          alt="Sidebar Logo"
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
          }}
        />

      </CSidebarHeader>

      <CSidebarNav>
        <CNavTitle>WELCOME TO YOUR DASHBOARD</CNavTitle>

        {/* Users */}
        <CButton
          className={`sidebar-button ${activeSection === 'users' ? 'active' : ''}`}
          onClick={() => handleNavigation('users')}
        >
          <CIcon icon={cilUser} className="me-2" /> Users
        </CButton>

        {/* Clubs */}
        <CButton
          className={`sidebar-button ${activeSection === 'clubs' ? 'active' : ''}`}
          onClick={() => handleNavigation('clubs')}
        >
          <CIcon icon={cilGroup} className="me-2" /> Clubs
        </CButton>

        {/* Student Life Members */}
        <CButton
          className={`sidebar-button ${activeSection === 'Student Life Members' ? 'active' : ''}`}
          onClick={() => handleNavigation('Student Life Members')}
        >
          <CIcon icon={cilGroup} className="me-2" /> Student Life Members
        </CButton>

        {/* Events */}
        <CButton
          className={`sidebar-button ${activeSection === 'Events' ? 'active' : ''}`}
          onClick={() => handleNavigation('Events')}
        >
          <CIcon icon={cilCalendar} className="me-2" /> Events
        </CButton>
      </CSidebarNav>


    </CSidebar>
  );
};

export default Sidebar;