import React from "react";
import { useLocation } from "react-router-dom";


function ClubDetails() {
    const location = useLocation();
    const club = location.state?.club;

    if (!club) {
        return <p>Club details not found.</p>;
    }

    return (
        <div className="club-details-container">
            <img src={club.profilePicture} alt={club.clubName} className="club-image-large" />
            <h1>{club.clubName}</h1>
            <p><strong>Category:</strong> {club.category || "No category"}</p>
            <p><strong>Description:</strong> {club.description || "No description available"}</p>
        </div>
    );
}

export default ClubDetails;
