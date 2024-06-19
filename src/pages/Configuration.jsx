import { useEffect, useState, useContext } from "react";
import { getPath, modifyPath } from "../config/firebase";
import { UserContext } from "../contexts/UserContext";

const Configuration = ({ currentPath, mode, setMode }) => {
  const { user, setUser } = useContext(UserContext);
  const [configuration, setConfiguration] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    await modifyPath(user, currentPath, configuration);
    setMode("flashcards");
  };

  const handleChange = (e) => {
    setConfiguration({ ...configuration, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    async function fetchData() {
      setConfiguration(await getPath(user, currentPath));
    }

    fetchData();
  }, [currentPath, user]);

  return (
    <div
      className="container"
      style={{ backgroundColor: "transparent", boxShadow: "none" }}
    >
      <div className="row mb-4">
        <div className="col text-center">
          <h1 style={{ color: "white" }}>Configuration</h1>
        </div>
      </div>
      <div className="row">
        <div className="col text-center">
          <form
            onSubmit={handleSubmit}
            className="p-4 rounded"
            style={{
              backgroundColor: "white",
              boxShadow: "0px 0px 50px 2px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div className="mb-4">
              <h3>Space:</h3>
              <p>
                Time interval between the training of the current card and the
                next training
              </p>
              <select
                name="space"
                value={configuration.space}
                onChange={handleChange}
                className="form-control text-center"
              >
                <option value="high">Big</option>
                <option value="standar">Normal</option>
                <option value="low">Small</option>
              </select>
            </div>
            <div className="mb-4">
              <h3>Gain:</h3>
              <p>Increment of knowledge if you answer correctly</p>
              <select
                name="gain"
                value={configuration.gain}
                onChange={handleChange}
                className="form-control text-center"
              >
                <option value="high">High</option>
                <option value="standar">Standar</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="mb-4">
              <h3>Lose:</h3>
              <p>Decrement of knowledge if you answer incorrectly</p>
              <select
                name="lose"
                value={configuration.lose}
                onChange={handleChange}
                className="form-control text-center"
              >
                <option value="high">High</option>
                <option value="standar">Standar</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="mb-4">
              <h3>Daily Limit:</h3>
              <input
                name="limit"
                type="number"
                min={1}
                value={configuration.limit}
                onChange={handleChange}
                className="form-control text-center"
              />
              {" cards"}
            </div>
            <button type="submit" className="btn btn-primary">
              Confirm choices
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Configuration;
