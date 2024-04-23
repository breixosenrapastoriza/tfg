import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { setUserFolders, login, register } from "../config/firebase";

const Register = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(credentials.email, credentials.password);
      await setUserFolders(credentials.email);
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label>Email: </label>
        <input
          name="email"
          type="text"
          value={credentials.email}
          onChange={handleChange}
        ></input>
        <label>Password: </label>
        <input
          name="password"
          type="password"
          value={credentials.password}
          onChange={handleChange}
        ></input>
        <button type="submit">Register</button>
      </form>
    </>
  );
};

export default Register;
