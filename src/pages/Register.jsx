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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (credentials.password.length < 6) {
        throw new Error("The password is too short.");
      }
      if (!/[A-Z]/.test(credentials.password)) {
        throw new Error("The password must have any capital letter.");
      }
      if (!/[a-z]/.test(credentials.password)) {
        throw new Error("The password must have any lowercase letter.");
      }
      if (!/[0-9]/.test(credentials.password)) {
        throw new Error("The password must have any number.");
      }
      await register(credentials.email, credentials.password);
      await setUserFolders(credentials.email);
      setLoading(false);
      navigate("/login");
    } catch (error) {
      setShowError(true);
      console.log(error.code);
      if (error.code === "auth/email-already-in-use") {
        setErrorMessage("The email is being already used");
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("The email is not valid");
      } else {
        setErrorMessage(error.message);
      }
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div
      className="container mt-5"
      style={{ backgroundColor: "transparent", boxShadow: "none" }}
    >
      <div className="row mb-4">
        <div className="col text-center">
          {loading && (
            <div className="loader mb-4" style={{ width: "200px" }}></div>
          )}
          {showError && (
            <div className="text-danger">
              <h2>{errorMessage}</h2>
            </div>
          )}
        </div>
      </div>
      <div className="row justify-content-center mb-4">
        <div className="row mb-4">
          <div className="col text-center">
            <h1 style={{ color: "white" }}>Register</h1>
          </div>
        </div>
        <div className="col-lg-4 text-center">
          <div
            className="p-4 rounded custom-box" // Añade esta clase
            style={{
              backgroundColor: "white",
              boxShadow: "0px 0px 50px 2px rgba(0, 0, 0, 0.5)",
            }}
          >
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>Email:</label>
                <input
                  name="email"
                  type="text"
                  value={credentials.email}
                  onChange={handleChange}
                  className="form-control text-center"
                />
              </div>
              <div className="mb-4">
                <label>Password:</label>
                <input
                  name="password"
                  type="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="form-control text-center"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </form>
            <div className="row mt-4">
              <div className="col">
                <Link to="/login">
                  Do you already have a user? Click here to login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
