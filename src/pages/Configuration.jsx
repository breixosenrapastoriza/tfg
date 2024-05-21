import { useEffect, useState, useContext } from "react";
import { getPath, modifyPath } from "../config/firebase";
import { UserContext } from "../contexts/UserContext";

const Configuration = ({ currentPath }) => {
  const { user, setUser } = useContext(UserContext);
  const [configuration, setConfiguration] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    await modifyPath(user, currentPath, configuration);
  };

  const handleChange = (e) => {
    setConfiguration({ ...configuration, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    async function fetchData() {
      setConfiguration(await getPath(user, currentPath));
    }

    fetchData();
  }, []);

  return (
    <>
      <h1>Configuration</h1>
      <form onSubmit={handleSubmit}>
        <label>Space: </label>
        <select
          name="space"
          value={configuration.space}
          onChange={handleChange}
        >
          <option value="low">Low</option>
          <option value="standar">Standar</option>
          <option value="high">High</option>
        </select>
        <label>Lose: </label>
        <select name="lose" value={configuration.lose} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="standar">Standar</option>
          <option value="high">High</option>
        </select>
        <label>Gain: </label>
        <select name="gain" value={configuration.gain} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="standar">Standar</option>
          <option value="high">High</option>
        </select>
        <button type="submit">Confirm choices</button>
      </form>
    </>
  );
};

export default Configuration;
