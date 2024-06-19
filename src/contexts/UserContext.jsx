import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState, useRef } from "react";
import { auth } from "../config/firebase";
import { Navigate } from "react-router-dom";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(false); //

  useEffect(() => {
    const unsuscribe = onAuthStateChanged(auth, (u) => {
      setUser(u == null ? u : u.email);
    });
    return unsuscribe;
  }, [user]);

  if (user == false)
    return <div className="loader mt-4 mb-4" style={{ width: "200px" }}></div>;

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
