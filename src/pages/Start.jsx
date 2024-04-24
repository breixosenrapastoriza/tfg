import { useState, useEffect, useContext } from "react";
import ListDecks from "../components/ListDecks";
import { UserContext } from "../contexts/UserContext";
import {
  addPath,
  auth,
  codigoEjecutar,
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
} from "../utils/utils";

const Start = () => {
  const [name, setName] = useState("");
  const [paths, setPaths] = useState([]);
  const [modify, setModify] = useState(false);
  const [selectedPathId, setSelectedPathId] = useState();
  const { user, setUser } = useContext(UserContext);

  const handleSubmit = (e) => {
    console.log("FUNCION 1");
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
    setModify(!modify);
    //console.log(!modify);
    //console.log("ESTA ES LA PRUEBA DE QUE HA LLEGADOOOO!!!!");
  };

  const handleModify = async (e) => {
    e.preventDefault();

    let gottenFlashcards = await getFlashcards(user);
    gottenFlashcards = gottenFlashcards.filter((card) =>
      card.path.startsWith(selectedPathId)
    );

    await Promise.all(
      gottenFlashcards.map(async (card) => {
        if (card.path === selectedPathId) {
          await updateFlashcard(user, card.id, { ...card, path: name });
        } else {
          let subfolder = card.path.replace(selectedPathId, "");
          await updateFlashcard(user, card.id, {
            ...card,
            path: name + subfolder,
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
          await addPath(user, initPath + name.replace(/\//g, "\\"));
        } else {
          let subfolder = path.replace(selectedPathId, "");
          let newFolder = name + subfolder;
          await addPath(user, initPath + newFolder.replace(/\//g, "\\"));
        }
      })
    );

    await loadPaths();
    setModify(false);
  };

  const loadPaths = async () => {
    setPaths(await getPaths(user));
  };

  useEffect(() => {
    loadPaths();
  }, []);

  const navigate = useNavigate();

  const handleLogOut = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <h1>Start, {user}</h1>
      <button type="button" onClick={handleLogOut}>
        Log out
      </button>
      <form onSubmit={modify ? handleModify : handleSubmit}>
        <label>Path's name: </label>
        <input type="text" name="name" value={name} onChange={handleChange} />
        <button type="submit">{modify ? "Modify" : "Add"}</button>
      </form>
      <ListDecks
        rutas={paths}
        updatePaths={loadPaths}
        handleClickModify={handleClickModify}
      />
    </>
  );
};

export default Start;
