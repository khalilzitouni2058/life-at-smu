import React from "react";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardImage,
  CCardText,
  CListGroup,
  CListGroupItem
} from "@coreui/react";

function ClubDetails({ visible, onClose, club }) {
  if (!club) return null;

  return (
    <CModal visible={visible} onClose={onClose} size="lg" scrollable>
      <CModalHeader>
        <CModalTitle>{club.clubName}</CModalTitle>
      </CModalHeader>

      <CModalBody>
        <CCard className="border-0 shadow-sm p-3" style={{ background: "#f9f9f9", borderRadius: "1rem" }}>
          <CRow className="align-items-center">
            {/* Club Image */}
            <CCol md={4} className="text-center">
              <CCardImage
                src={club.profilePicture || "/images/default.jpg"}
                alt={club.clubName}
                style={{ width: "100%", borderRadius: "1rem", objectFit: "cover", maxHeight: "250px" }}
              />
            </CCol>

            {/* Club Info */}
            <CCol md={8}>
              <h5 className="text-primary fw-bold">About the Club</h5>
              <p className="text-muted" style={{ fontStyle: "italic" }}>
                {club.clubDescription || "This club has not provided a description yet, but it's part of something exciting."}
              </p>
              <ul className="list-unstyled mb-0">
                <li><strong>Email:</strong> <span className="text-muted">{club.email}</span></li>
                <li><strong>Category:</strong> <span className="text-muted">{club.category || "Uncategorized"}</span></li>
              </ul>
            </CCol>
          </CRow>
        </CCard>

        {/* Divider */}
        <hr className="my-4" />

        {/* Board Members Section */}
        <h5 className="text-primary mb-3 fw-bold">🎓 Meet the Board</h5>
        {club.boardMembers && club.boardMembers.length > 0 ? (
          <CListGroup flush>
            {club.boardMembers.map((member, index) => (
              <CListGroupItem key={index} className="py-3 px-4 bg-white mb-2 rounded shadow-sm d-flex align-items-start gap-3">
                <img
                  src={member.user.picture || "/images/default-user.jpg"}
                  alt=""
                  style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <h6 className="mb-0 fw-semibold">{member.user.username}</h6>
                  <p className="mb-1 text-muted small">{member.role}</p>
                  {member.phoneNumber && <p className="mb-1 text-muted small">📞 {member.phoneNumber}</p>}
                  {member.facebookLink && (
                    <a href={member.facebookLink} target="_blank" rel="noopener noreferrer" className="text-info small">
                      🔗 Connect on Facebook
                    </a>
                  )}
                </div>
              </CListGroupItem>
            ))}
          </CListGroup>
        ) : (
          <p className="text-muted">No board members listed for this club.</p>
        )}
      </CModalBody>

      <CModalFooter>
        <CButton color="dark" variant="outline" onClick={onClose}>Close</CButton>
      </CModalFooter>
    </CModal>
  );
}

export default ClubDetails;
