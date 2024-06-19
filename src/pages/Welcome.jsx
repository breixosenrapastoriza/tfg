import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();
  return (
    <div
      className="container mt-5 text-center"
      style={{ backgroundColor: "transparent", boxShadow: "none" }}
    >
      <h1 className="display-4 text-white">
        C<b>A\</b>RD
      </h1>
      <h2 className="text-white">Try the power of flashcards fueled by AI</h2>
      <div className="mt-4">
        <button
          type="button"
          className="btn btn-primary btn-lg me-3"
          onClick={() => navigate("/login")}
          style={{ boxShadow: "0px 0px 50px 2px rgba(0, 0, 0, 0.5)" }}
        >
          Login
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-lg"
          onClick={() => navigate("/register")}
          style={{ boxShadow: "0px 0px 50px 2px rgba(0, 0, 0, 0.5)" }}
        >
          Sign Up
        </button>
        <br />
        <br />
        <img
          src="https://cdn.pixabay.com/animation/2022/07/29/14/46/14-46-54-82_512.gif"
          alt="this slowpoke moves"
          width="500"
        />
      </div>
    </div>
  );
};

export default Welcome;
