import React from "react";
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"; 
import "../styles/Dashboard/ClubCard.css";

function ClubCard({ club  }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/clubs/${club.id}`, { state: { club } });
    };

    return (
        <motion.div 
            className="club-card"
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 255, 0.3)" }} 
            onClick={handleClick}
        >
            <img 
                src={club?.profilePicture || "https://via.placeholder.com/250x350"} 
                alt={club?.clubName || "Club"} 
                className="club-image" 
            />
            <div className="club-overlay">
                <h3 className="club-name">{club?.clubName || "Unknown Club"}</h3>
                
            </div>
        </motion.div>
    );
}

export default ClubCard;
