import React from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardImage,
  CCardText,
  CCardTitle,
} from "@coreui/react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard/ClubCard.css";
import { FaTrashAlt } from "react-icons/fa";

function ClubCard({ club, editMode, onDelete }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/clubs/${club.id}`, { state: { club } });
  };

  return (
    <CCard className="club-card">
      {editMode && (
        <button className="delete-btn" onClick={onDelete}>
          <FaTrashAlt className="delete-icon-inner" />
        </button>
      )}

      <CCardImage
        orientation="top"
        src={club.profilePicture || "/images/default.jpg"}
        className="club-card-image"
      />
      <CCardBody>
        <CCardTitle className="club-card-title">{club.clubName}</CCardTitle>
        <CButton
          color="primary"
          onClick={handleClick}
          className="card-view-details"
        >
          View Details
        </CButton>
      </CCardBody>
    </CCard>
  );
}

export default ClubCard;
