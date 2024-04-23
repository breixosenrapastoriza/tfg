import { useState, useEffect, useContext } from "react";
import ListDecks from "../components/ListDecks";
import { UserContext } from "../contexts/UserContext";
import {
  addPath,
  auth,
  codigoEjecutar,
  getPaths,
  logout,
} from "../config/firebase";
import { Navigate, useNavigate } from "react-router-dom";

const Start = () => {
  const [name, setName] = useState("");
  const [paths, setPaths] = useState([]);
  const { user, setUser } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    addPath(user, name);
    loadPaths();
    setName("");
  };

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const loadPaths = async () => {
    setPaths(await getPaths(user));
  };

  useEffect(() => {
    loadPaths();
  }, []);

  const navigate = useNavigate();

  const handleLogOut = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <h1>Start, {user}</h1>
      <button type="button" onClick={handleLogOut}>
        Log out
      </button>
      <form onSubmit={handleSubmit}>
        <label>Path's name: </label>
        <input type="text" name="name" value={name} onChange={handleChange} />
        <button type="submit">Add</button>
      </form>
      <ListDecks rutas={paths} updatePaths={loadPaths} />
    </>
  );
};

export default Start;
