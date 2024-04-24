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
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (credentials.password.length < 6) {
        throw new Error("The password is too short.");
      }
      if (/[0-9]/.test(credentials.password)) {
        throw new Error("The password must have any number.");
      }
      if (/[A-Z]/.test(credentials.password)) {
        throw new Error("The password must have any capital letter.");
      }
      if (/[a-z]/.test(credentials.password)) {
        throw new Error("The password must have any lowercase letter.");
      }
      await register(credentials.email, credentials.password);
      await setUserFolders(credentials.email);
      navigate("/login");
    } catch (error) {
      setShowError(true);
      setErrorMessage(error.message);
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>
      <h1>Register</h1>
      {showError && (
        <div>
          <h2>{errorMessage}</h2>
        </div>
      )}
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
