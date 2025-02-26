import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]); // Store events
  const eventCount = events.length;

  return (
    <UserContext.Provider value={{ user, setUser, events, setEvents, eventCount }}>
      {children}
    </UserContext.Provider>
  );
};
