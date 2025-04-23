import React, { useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardImage,
  CCardText,
  CCardTitle,
} from "@coreui/react";
import { FaTrashAlt } from "react-icons/fa";
import ClubDetails from "./ClubDetails"; // ✅ Import your modal
import "../styles/Dashboard/ClubCard.css";

function ClubCard({ club, editMode, onDelete }) {
  const [showDetails, setShowDetails] = useState(false);

  const handleViewDetails = () => {
    setShowDetails(true);
  };

  return (
    <>
      {/* Main Club Card */}
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
            onClick={handleViewDetails}
            className="card-view-details"
          >
            View Details
          </CButton>
        </CCardBody>
      </CCard>

      {/* ClubDetails Modal */}
      {showDetails && (
        <ClubDetails
          visible={showDetails}
          onClose={() => setShowDetails(false)}
          club={club}
          events={club.events || []} // Or empty if you don't have events attached
        />
      )}
    </>
  );
}

export default ClubCard;
