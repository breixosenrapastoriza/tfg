import { Navigate, useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();
  return (
    <>
      <h1>Welcome</h1>
      <button type="button" onClick={() => navigate("/login")}>
        Login
      </button>
      <button type="button">Login</button>
    </>
  );
};

export default Welcome;
