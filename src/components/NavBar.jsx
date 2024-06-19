import { useNavigate } from "react-router-dom";
import { deleteCurrentUser, logout } from "../config/firebase";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const NavBar = ({ name }) => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const handleLogOut = async () => {
    await logout();
    navigate("/welcome");
  };

  const handleDeleteUser = async () => {
    navigate("/welcome");
    await deleteCurrentUser();
  };

  return (
    <nav className="child top fixed-top">
      <div className="row mt-3">
        <div className="col-7 title-container" style={{ color: "white" }}>
          <h1 className="specialh1">{name}</h1>
        </div>

        <div className="col text-end">
          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              {user + "   "}
              <i className="bi bi-person"></i>
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <button
                className="dropdown-item"
                type="button"
                onClick={handleLogOut}
              >
                Log out
              </button>
              <button
                className="dropdown-item"
                type="button"
                onClick={handleDeleteUser}
              >
                Delete user
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
