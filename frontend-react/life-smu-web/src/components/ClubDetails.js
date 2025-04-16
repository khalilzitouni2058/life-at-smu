import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CCardImage,
  CButton,
  CCarousel,
  CCarouselItem,
  CContainer,
  CRow,
  CCol,
  CCardFooter,
  CSpinner
} from "@coreui/react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function ClubDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const clubId = location.state?.club;
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clubId) {
      axios
        .get(`http://localhost:8000/api/clubs/${clubId}`)
        .then((res) => {
          setClub(res.data.club);
        })
        .catch((err) => {
          console.error("Error fetching club:", err);
        });
      // axios
      //   .get(`http://localhost:8000/api/events/club/${clubId}`)
      //   .then((res) => {
      //     setEvents(res.data.events || []);
      //   })
      //   .catch((err) => {
      //     console.error("Error fetching events:", err);
      //   })
      //   .finally(() => setLoading(false));
    }
  }, [clubId]);

  if (loading) {
    return <CSpinner color="primary" />;
  }

  if (!club) {
    return <div>Club not found.</div>;
  }

  return (
    <CContainer className="py-4">
      {/* Header */}
      <CRow className="align-items-center mb-4">
        <CCol md={4} className="text-center">
          <CCardImage
            src={club.profilePicture}
            alt={club.clubName}
            style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "contain" }}
          />
        </CCol>
        <CCol md={8}>
          <h2 className="text-primary">{club.clubName}</h2>
          <p><strong>Description:</strong> {club.clubDescription || "No description available."}</p>
          <p><strong>Email:</strong> {club.email}</p>
          <p><strong>Category:</strong> {club.category || "Uncategorized"}</p>
          <CButton color="primary" onClick={() => navigate(-1)}>Back to Clubs</CButton>
        </CCol>
      </CRow>

      {/* Carousel of Board Members */}
      {club.boardMembers.length > 0 && (
        <>
          <h4 className="mb-3">Board Members</h4>
          <CCarousel controls indicators dark>
            {club.boardMembers.map((member, index) => (
              <CCarouselItem key={index}>
                <div className="d-flex flex-column align-items-center p-4">
                  <img
                    src={member.user.profilePicture || "/images/default-user.jpg"}
                    alt="Member"
                    style={{ width: "150px", height: "150px", borderRadius: "50%", objectFit: "cover" }}
                  />
                  <h5 className="mt-3">{member.user.username}</h5>
                  <p className="text-muted">{member.role}</p>
                  {member.phoneNumber && <p>📞 {member.phoneNumber}</p>}
                  {member.facebookLink && (
                    <a href={member.facebookLink} target="_blank" rel="noopener noreferrer">
                      Facebook Profile
                    </a>
                  )}
                </div>
              </CCarouselItem>
            ))}
          </CCarousel>
        </>
      )}

      {/* Events Grid */}
      <div className="mt-5">
        <h4 className="mb-3">Past Events</h4>
        {events.length === 0 ? (
          <p>No events yet.</p>
        ) : (
          <CRow>
            {events.map((event) => (
              <CCol key={event._id} sm={12} md={6} lg={4} className="mb-4">
                <CCard className="h-100 shadow-sm">
                  {event.eventImage?.uri && (
                    <CCardImage
                      src={event.eventImage.uri}
                      alt={event.eventName}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  )}
                  <CCardBody>
                    <CCardTitle>{event.eventName}</CCardTitle>
                    <CCardText>{event.eventDescription?.slice(0, 100) || "No description"}</CCardText>
                    <CCardText><strong>Date:</strong> {event.eventDate}</CCardText>
                    <CCardText><strong>Time:</strong> {event.eventTime}</CCardText>
                    <CCardText><strong>Location:</strong> {event.eventLocation}</CCardText>
                  </CCardBody>
                  <CCardFooter>
                    <CButton
                      color="secondary"
                      size="sm"
                      href={event.formLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View More
                    </CButton>
                  </CCardFooter>
                </CCard>
              </CCol>
            ))}
          </CRow>
        )}
      </div>
    </CContainer>
  );
}

export default ClubDetails;
