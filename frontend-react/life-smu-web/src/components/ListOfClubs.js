import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ClubCard from './ClubCard';
import '../styles/Dashboard/ListOfClubs.css';

function ListOfClubs() {
    const [clubs, setClubs] = useState([]);

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/clubs');
                const fetchedClubs = Array.isArray(response.data.clubs) ? response.data.clubs : [];
                setClubs(fetchedClubs);
            } catch (error) {
                console.error('Error fetching clubs:', error);
            }
        };

        fetchClubs();
    }, []);

    return (
        <div className="clubs-container">
            {clubs.length > 0 ? (
                clubs.map((club, index) => (
                    <ClubCard key={index} club={club} />
                ))
            ) : (
                <p>No clubs available</p>
            )}
        </div>
    );
}

export default ListOfClubs;
