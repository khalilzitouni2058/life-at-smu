import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CButton,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormInput,
  CFormTextarea,
  CModalFooter,
} from "@coreui/react";
import { FaPlus } from "react-icons/fa";
import ClubCard from "./ClubCard";
import "../styles/Dashboard/ListOfClubs.css";

function ListOfClubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [clubName, setClubName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [email, setEmail] = useState("");
  const [selectedClub, setSelectedClub] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const handleEditClick = (club) => {
    setSelectedClub(club);
    setEditModalVisible(true);
  };
  const handleDeleteClub = (clubId) => {
    axios
      .delete(`http://localhost:8000/api/clubs/${clubId}`)
      .then(() => fetchClubs())
      .catch((err) => console.error("Error deleting club:", err));
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = () => {
    axios
      .get("http://localhost:8000/api/clubs")
      .then((response) => {
        const fetchedClubs = Array.isArray(response.data.clubs)
          ? response.data.clubs
          : [];
        setClubs(fetchedClubs);
      })
      .catch((error) => {
        console.error("Error fetching clubs:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAddClub = () => {
    const newClub = {
      clubName,
      email,
      profilePicture,
    };

    axios
      .post("http://localhost:8000/api/admin-create", newClub)
      .then(() => {
        setVisible(false);
        setClubName("");
        setEmail("");
        setProfilePicture("");
        fetchClubs();
      })
      .catch((error) => {
        console.error("Error adding club:", error);
      });
  };

  return (
    <div className="clubs-container">
      {/* Header */}
      <div className="clubs-header">
        <h2 className="clubs-title">Clubs</h2>
        <div className="action-buttons">
          <button
            className="Btn add-club-animated"
            onClick={() => setVisible(true)}
          >
            <div className="add-sign">
              <svg viewBox="0 0 512 512">
                <path d="M256 112c8.8 0 16 7.2 16 16v112h112c8.8 0 16 7.2 16 16s-7.2 16-16 16H272v112c0 8.8-7.2 16-16 16s-16-7.2-16-16V272H128c-8.8 0-16-7.2-16-16s7.2-16 16-16h112V128c0-8.8 7.2-16 16-16z" />
              </svg>
            </div>
            <div className="text">Add Club</div>
          </button>

          <button
            className="Btn edit-btn"
            onClick={() => setEditMode((prev) => !prev)}
          >
            <div className="sign">
              <svg viewBox="0 0 512 512">
                <path d="M290.74,93.24l128,128L142.94,497.05a48,48,0,0,1-21.34,12.58l-111.25,31a16,16,0,0,1-19.46-19.46l31-111.25a48,48,0,0,1,12.58-21.34L290.74,93.24m45.25-45.25L342.63,41a56,56,0,0,1,79.2,0l49.15,49.15a56,56,0,0,1,0,79.2l-27.94,27.94-128-128Z" />
              </svg>
            </div>
            <div className="text">Edit</div>
          </button>
        </div>
      </div>

      {/* Modal */}
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Add a New Club</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              label="Club Name"
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
              className="mb-3"
            />
            <CFormInput
              type="email"
              label="Club Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-3"
              required
            />
            <CFormInput
              type="text"
              label="Profile Picture URL"
              value={profilePicture}
              onChange={(e) => setProfilePicture(e.target.value)}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleAddClub}>
            Add Club
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Content */}
      {loading ? (
        <div className="spinner-container">
          <span>Loading...</span>
        </div>
      ) : (
        <div className="clubs-grid">
          {clubs.length > 0 ? (
            clubs.map((club) => (
              <div key={club.id} className="club-grid-item">
                <ClubCard
                  club={club}
                  editMode={editMode}
                  onDelete={() => handleDeleteClub(club._id)}
                />
              </div>
            ))
          ) : (
            <p>No clubs available</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ListOfClubs;
