import React from 'react';
import {
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CSidebarNav,
  CSidebarToggler,
  CNavGroup,
  CNavTitle,
  CButton,
} from '@coreui/react';
import "../styles/Dashboard/Sidebar.css"

import CIcon from '@coreui/icons-react';
import { cilUser, cilGroup, cilCalendar } from '@coreui/icons';
import '@coreui/coreui/dist/css/coreui.min.css';

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
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand>Dashboard</CSidebarBrand>
      </CSidebarHeader>

      <CSidebarNav>
        <CNavTitle>WELCOME TO YOUR DASHBOARD</CNavTitle>

        {/* Users */}
        <CButton
          active={activeSection === 'users'}
          onClick={() => handleNavigation('users')}
          style={{
            padding: '8px 12px',
            width: 'auto',
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px'
          }}
         
        >
          <CIcon icon={cilUser} className="me-2" /> Users
        </CButton>

        {/* Clubs */}
        <CButton

          active={activeSection === 'clubs'}
          onClick={() => handleNavigation('clubs')}
          style={{
            padding: '8px 12px',
            width: 'auto',
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px'
          }}
        >
          <CIcon icon={cilGroup} className="me-2" /> Clubs{' '}
        </CButton>

        {/* Student Life Members */}
        <CNavGroup
          toggler={
            <span className="d-flex align-items-center">
              <CIcon icon={cilGroup} className="me-2" />
              Student Life Members
            </span>
          }
        >
          <CButton
            component="button"
            active={activeSection === 'Student Life Members'}
            onClick={() => handleNavigation('Student Life Members')}
            style={{
              padding: '8px 12px',
              width: 'auto',
              display: 'flex',
              alignItems: 'center',
              marginBottom: '10px'
            }}
          >
            Members
          </CButton>
          <CButton
            component="button"
            active={activeSection === 'Student Life Members'}
            onClick={() => handleNavigation('Student Life Members')}
            style={{
              padding: '8px 12px',
              width: 'auto',
              display: 'flex',
              alignItems: 'center',
              marginBottom: '10px'
            }}
          >
            Officers
          </CButton>
        </CNavGroup>

        {/* Events */}
        <CButton
          component="button"
          active={activeSection === 'Events'}
          onClick={() => handleNavigation('Events')}
          style={{
            padding: '8px 12px',
            width: 'auto',
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
            
          }}
        >
          <CIcon icon={cilCalendar} className="me-2" /> Events
        </CButton>
      </CSidebarNav>

      {/* Sidebar Footer */}
      <CSidebarHeader className="border-top">
        <CSidebarToggler />
      </CSidebarHeader>
    </CSidebar>
  );
};

export default Sidebar;
