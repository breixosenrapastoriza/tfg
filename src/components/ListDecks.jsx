import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import {
  deleteFlashcard,
  deletePath,
  getFlashcards,
  getPaths,
} from "../config/firebase";
import { deckHasTraining, deckKnowledge, deckLength } from "../utils/utils";
import "bootstrap-icons/font/bootstrap-icons.css"; // Importa los estilos de Bootstrap Icons
import "bootstrap/dist/css/bootstrap.min.css"; // Importa los estilos de Bootstrap

const ListDecks = ({ rutas, updatePaths, handleClickModify, loading }) => {
  const { user } = useContext(UserContext);
  const [knowledgeMap, setKnowledgeMap] = useState({});
  const [lengthMap, setLengthMap] = useState({});
  const [hasTrainingMap, setHasTrainingMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPaths, setFilteredPaths] = useState(rutas);
  const [openPaths, setOpenPaths] = useState({});

  useEffect(() => {
    const fetchDeckData = async () => {
      const knowledgePromises = rutas.map(async (ruta) => ({
        ruta,
        knowledge: await deckKnowledge(ruta, user),
      }));
      const lengthPromises = rutas.map(async (ruta) => ({
        ruta,
        length: await deckLength(ruta, user),
      }));
      const hasTrainingPromises = rutas.map(async (ruta) => ({
        ruta,
        hasTraining: await deckHasTraining(ruta, user),
      }));

      const knowledgeArray = await Promise.all(knowledgePromises);
      const lengthArray = await Promise.all(lengthPromises);
      const hasTrainingArray = await Promise.all(hasTrainingPromises);

      const knowledgeObject = knowledgeArray.reduce(
        (acc, { ruta, knowledge }) => {
          acc[ruta] = knowledge;
          return acc;
        },
        {}
      );

      const lengthObject = lengthArray.reduce((acc, { ruta, length }) => {
        acc[ruta] = length;
        return acc;
      }, {});

      const hasTrainingObject = hasTrainingArray.reduce(
        (acc, { ruta, hasTraining }) => {
          acc[ruta] = hasTraining;
          return acc;
        },
        {}
      );

      setKnowledgeMap(knowledgeObject);
      setLengthMap(lengthObject);
      setHasTrainingMap(hasTrainingObject);
    };

    fetchDeckData();
  }, [rutas, user]);

  useEffect(() => {
    const filtered = rutas.filter((ruta) =>
      ruta.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPaths(filtered);
  }, [searchTerm, rutas]);

  const navigate = useNavigate();

  const handleClickDelete = async (path) => {
    let gottenFlashcards = await getFlashcards(user);
    gottenFlashcards = gottenFlashcards.filter((card) =>
      card.path.startsWith(path)
    );
    gottenFlashcards.forEach(async (card) => {
      await deleteFlashcard(user, card.id);
    });

    let gottenPaths = await getPaths(user);
    gottenPaths = gottenPaths.filter((card) => card.startsWith(path));
    gottenPaths.forEach(async (card) => {
      await deletePath(user, card.replace(/\//g, "\\"));
    });
    updatePaths();
  };

  const togglePath = (path) => {
    setOpenPaths((prevOpenPaths) => ({
      ...prevOpenPaths,
      [path]: !prevOpenPaths[path],
    }));
  };

  function generateNestedList(paths, basePath = "") {
    const nestedList = paths.reduce((acc, path) => {
      const folders = path.split("/").filter(Boolean);
      let currentLevel = acc;

      folders.forEach((folder) => {
        let folderObj = currentLevel.find((item) => item.name === folder);

        if (!folderObj) {
          folderObj = { name: folder, children: [] };
          currentLevel.push(folderObj);
        }

        currentLevel = folderObj.children;
      });

      return acc;
    }, []);

    const renderList = (list, currentPath = "") =>
      list.length === 0 && !loading ? (
        <p style={{ color: "white" }}>"There is no created decks yet"</p>
      ) : (
        <ul
          className={`list-group w-100 ${
            currentPath === "" ? "list-group-main" : ""
          }`}
        >
          {list.map((item) => (
            <li key={item.name} className="list-group-item w-100">
              <div className="d-flex justify-content-between align-items-start w-100">
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center">
                    <h3 className="me-2">
                      <Link to={`${basePath}/${currentPath}${item.name}`}>
                        {item.name}
                      </Link>
                    </h3>
                    <button
                      type="button"
                      className="btn btn-light btn-sm"
                      onClick={() =>
                        handleClickModify(
                          `${basePath}/${currentPath}${item.name}`
                        )
                      }
                      style={{ padding: "0.25rem", fontSize: "1rem" }}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                  </div>
                  <h5>
                    {"Cards: "}
                    <span className="badge text-bg-primary rounded-pill">
                      {lengthMap[`${basePath}/${currentPath}${item.name}`]}
                    </span>{" "}
                    {hasTrainingMap[
                      `${basePath}/${currentPath}${item.name}`
                    ] && (
                      <span
                        className="badge badge-success mt-2"
                        style={{ backgroundColor: "#007bff" }}
                      >
                        Training available
                      </span>
                    )}
                  </h5>
                  <div className="progress" style={{ height: "20px" }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${Math.round(
                          knowledgeMap[
                            `${basePath}/${currentPath}${item.name}`
                          ] * 10
                        )}%`,
                      }}
                      aria-valuenow={
                        Math.round(
                          knowledgeMap[
                            `${basePath}/${currentPath}${item.name}`
                          ] * 10
                        ) / 10
                      }
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {Math.round(
                        100 *
                          knowledgeMap[`${basePath}/${currentPath}${item.name}`]
                      ) /
                        10 >
                      100
                        ? 100
                        : Math.round(
                            100 *
                              knowledgeMap[
                                `${basePath}/${currentPath}${item.name}`
                              ]
                          ) / 10}
                      %
                    </div>
                  </div>
                </div>
                <div className="position-relative d-flex flex-column align-items-end">
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() =>
                      handleClickDelete(
                        `${basePath}/${currentPath}${item.name}`
                      )
                    }
                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
              {item.children.length > 0 && (
                <>
                  <div className="d-flex justify-content-center">
                    <button
                      className="btn btn-link btn-sm mt-2"
                      type="button"
                      onClick={() =>
                        togglePath(`${basePath}/${currentPath}${item.name}`)
                      }
                    >
                      {openPaths[`${basePath}/${currentPath}${item.name}`] ? (
                        <i className="bi bi-chevron-up"></i>
                      ) : (
                        <i className="bi bi-chevron-down"></i>
                      )}
                    </button>
                  </div>
                  <div
                    className={`collapsible-content ${
                      openPaths[`${basePath}/${currentPath}${item.name}`]
                        ? "open"
                        : ""
                    }`}
                    style={{ width: "100%" }}
                  >
                    {renderList(item.children, `${currentPath}${item.name}/`)}
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      );

    return renderList(nestedList);
  }

  return (
    <div>
      <div className="input-group" style={{ boxShadow: "0px 0px 50px" }}>
        <input
          type="text"
          placeholder="Search decks"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
        />
        <span className="input-group-text">
          <i className="bi bi-search"></i>
        </span>
      </div>
      <div className="row mt-3">
        <div className="col" style={{ backgroundColor: "transparent" }}>
          {loading && (
            <div className="loader mb-4" style={{ width: "200px" }}></div>
          )}
        </div>
      </div>
      <br />
      {generateNestedList(filteredPaths)}
    </div>
  );
};

export default ListDecks;
