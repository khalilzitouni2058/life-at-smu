import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useClub } from "../Context/ClubContext"; // or useUser for user logout

const Logout = () => {
  const { setClubId } = useClub(); // or: const { setUser } = useUser();
  const navigation = useNavigation();

  useEffect(() => {
    setClubId(null); // or: setUser(null);
    navigation.replace("Login");
  }, []);

  return null;
};

export default Logout;
