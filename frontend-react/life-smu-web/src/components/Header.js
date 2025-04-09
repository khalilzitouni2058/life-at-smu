import React from 'react';
import {
  CHeader,
  CContainer,
  CHeaderBrand,
} from '@coreui/react';
import '../styles/Dashboard/Header.css'; 

function Header() {
  return (
    <CHeader  className="custom-header ">
      <CContainer fluid>
        <CHeaderBrand>Header </CHeaderBrand>
      </CContainer>
    </CHeader>
  );
}

export default Header;
