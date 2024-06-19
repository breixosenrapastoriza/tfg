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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(credentials.email, credentials.password);
      setErrorMessage("");
      setLoading(false);
      navigate("/");
    } catch (error) {
      setShowError(true);
      console.log(error.code);
      if (error.code === "auth/invalid-credential") {
        setErrorMessage("The credentials are not valid");
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("The email is not valid");
      } else if (error.code === "auth/missing-password") {
        setErrorMessage("The password is missing");
      } else if (error.code === "auth/network-request-failed") {
        setErrorMessage("An internet connection is needed");
      } else {
        setErrorMessage("ERROR");
      }
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
    <div
      className="container mt-5"
      style={{ backgroundColor: "transparent", boxShadow: "none" }}
    >
      <div className="row justify-content-center mb-4">
        <div className="row mb-4">
          <div className="col text-center">
            <h1 style={{ color: "white" }}>Login</h1>
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
            {loading && (
              <div
                className="text-center loader mb-4"
                style={{ width: "200px", margin: "0 auto 20px auto" }}
              ></div>
            )}
            {showError && (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            )}
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
              <div className="mb-3">
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
                Log in
              </button>
            </form>
            <div className="row mt-3">
              <div className="col">
                <Link to="/register">
                  Don't you have user? Click here to create one
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
