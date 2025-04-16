import React, { createContext, useState, useContext } from "react";

const ClubContext = createContext();

export const useClub = () => {
  return useContext(ClubContext);
};

export const ClubProvider = ({ children }) => {
  const [clubId, setClubId] = useState(null);
  const [firstLogin, setFirstLogin] = useState(false);

  return (
    <ClubContext.Provider
      value={{ clubId, setClubId, firstLogin, setFirstLogin }}
    >
      {children}
    </ClubContext.Provider>
  );
};
