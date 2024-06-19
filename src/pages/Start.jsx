import "bootstrap/dist/css/bootstrap.min.css"; // index.js o App.js
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useState, useEffect, useContext } from "react";
import ListDecks from "../components/ListDecks";
import { UserContext } from "../contexts/UserContext";
import {
  addPath,
  auth,
  codigoEjecutar,
  deleteCurrentUser,
  deletePath,
  getFlashcards,
  getPaths,
  logout,
  updateFlashcard,
} from "../config/firebase";
import { Navigate, useNavigate } from "react-router-dom";
import {
  obtenerParteSinUltimoSegmento,
  obtenerUltimaParteDeRuta,
  insertarSlash,
} from "../utils/utils";
import NavBar from "../components/NavBar";

const Start = () => {
  const [name, setName] = useState("");
  const [paths, setPaths] = useState([]);
  const [modify, setModify] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPathId, setSelectedPathId] = useState();
  const { user, setUser } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    addPath(user, name);
    loadPaths();
    setName("");
  };

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleClickModify = (modifiedName) => {
    setName(obtenerUltimaParteDeRuta(modifiedName));
    setSelectedPathId(modifiedName);
    setModify(true);
  };

  const handleModify = async (e) => {
    e.preventDefault();
    setLoading(true);

    let gottenFlashcards = await getFlashcards(user);
    gottenFlashcards = gottenFlashcards.filter((card) =>
      card.path.startsWith(selectedPathId)
    );
    await Promise.all(
      gottenFlashcards.map(async (card) => {
        if (card.path === selectedPathId) {
          await updateFlashcard(user, card.id, {
            ...card,
            path: insertarSlash(name),
          });
        } else {
          let subfolder = card.path.replace(selectedPathId, "");
          await updateFlashcard(user, card.id, {
            ...card,
            path: insertarSlash(name) + subfolder,
          });
        }
      })
    );

    let gottenPaths = await getPaths(user);
    gottenPaths = gottenPaths.filter((path) => path.startsWith(selectedPathId));

    await Promise.all(
      gottenPaths.map(async (path) => {
        let initPath = obtenerParteSinUltimoSegmento(selectedPathId);
        await deletePath(user, path.replace(/\//g, "\\"));
        if (path === selectedPathId) {
          await addPath(
            user,
            initPath + insertarSlash(name).replace(/\//g, "\\")
          );
        } else {
          let subfolder = path.replace(selectedPathId, "");
          let newFolder = insertarSlash(name) + subfolder;
          await addPath(user, initPath + newFolder.replace(/\//g, "\\"));
        }
      })
    );

    await loadPaths();
    setModify(false);
    setLoading(false);
  };

  const loadPaths = async () => {
    setLoading(true);
    setPaths(await getPaths(user));
    setLoading(false);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/welcome");
      return;
    }

    loadPaths();
  }, []);

  return (
    <div
      className="container mt-5"
      style={{ backgroundColor: "transparent", boxShadow: "none" }}
    >
      <NavBar name={"Decks"} />
      <br />
      <div className="row">
        <div className="col text-center">
          <form
            onSubmit={modify ? handleModify : handleSubmit}
            className="input-group"
            style={{ boxShadow: "0px 0px 50px 2px rgba(0, 0, 0, 0.5)" }}
            data-toggle="tooltip"
            data-placement="top"
            title="Remember: to create subdecks use [/]. Example: /deck1/deck2"
          >
            <span className="input-group-text">
              {modify ? "Modify name: " : "Add path: "}
            </span>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              className="form-control"
            />
            <button type="submit" className="btn btn-primary">
              {modify ? "Modify" : "Add"}
            </button>
            {modify && (
              <button
                type="button"
                className="btn btn-light"
                onClick={() => {
                  setName("");
                  setModify(false);
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      </div>
      <br />
      <div className="row">
        <div className="col" style={{ backgroundColor: "transparent" }}>
          <ListDecks
            rutas={paths}
            updatePaths={loadPaths}
            handleClickModify={handleClickModify}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Start;
