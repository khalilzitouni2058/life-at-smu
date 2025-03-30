import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // Store events
  


  return (
    <UserContext.Provider value={{ user, setUser, events, setEvents, selectedDate ,setSelectedDate }}>
      {children}
    </UserContext.Provider>
  );
};
