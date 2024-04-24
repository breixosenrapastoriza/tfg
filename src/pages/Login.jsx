import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
//import { UserContext } from "../contexts/UserContext";
import { setUserFolders, login, auth } from "../config/firebase";

const Login = () => {
  //const { user, setUser } = useContext(UserContext);
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
      await login(credentials.email, credentials.password);
      setShowError(true);
      setErrorMessage("");
      navigate("/");
    } catch (error) {
      setShowError(true);
      setErrorMessage(error.code);
    }
  };

  /*useEffect(() => {
    console.log("Login: " + user);
    user && navigate("/");
  }, [user]);*/

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>
      <h1>Login</h1>
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
        <button type="submit">Log in</button>
      </form>
      <Link to="/register">Don't you have user? Click here to create one</Link>
    </>
  );
};

export default Login;
