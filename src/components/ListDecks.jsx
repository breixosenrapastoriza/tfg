import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import {
  deleteFlashcard,
  deletePath,
  getFlashcards,
  getPaths,
} from "../config/firebase";
import { deckHasTraining, deckKnowledge } from "../utils/utils";

const ListDecks = ({ rutas, updatePaths, handleClickModify }) => {
  const { user, setUser } = useContext(UserContext);
  const [knowledgeMap, setKnowledgeMap] = useState({});
  const [hasTrainingMap, setHasTrainingMap] = useState({});

  useEffect(() => {
    const fetchDeckKnowledge = async () => {
      const knowledgePromises = rutas.map(async (ruta) => {
        const knowledge = await deckKnowledge(ruta, user);
        //const necesita repaso??
        return { ruta, knowledge }; //poner
      });
      const knowledgeArray = await Promise.all(knowledgePromises);
      const knowledgeObject = knowledgeArray.reduce(
        (acc, { ruta, knowledge }) => {
          acc[ruta] = knowledge;
          return acc;
        },
        {}
      );
      console.log(knowledgeObject);
      setKnowledgeMap(knowledgeObject);
    };

    const fetchDeckHasTraining = async () => {
      const hasTrainingPromises = rutas.map(async (ruta) => {
        const hasTraining = await deckHasTraining(ruta, user);
        console.log(ruta + ": " + hasTraining);
        return { ruta, hasTraining }; //poner
      });
      const hasTrainingArray = await Promise.all(hasTrainingPromises);
      const hasTrainingObject = hasTrainingArray.reduce(
        (acc, { ruta, hasTraining }) => {
          acc[ruta] = hasTraining;
          return acc;
        },
        {}
      );
      console.log(hasTrainingObject);
      setHasTrainingMap(hasTrainingObject);
    };

    fetchDeckKnowledge();
    fetchDeckHasTraining();
  }, [rutas, user]);

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
        //console.log(card.replace(/\//g, "\\"));
        await deletePath(user, card.replace(/\//g, "\\"));
      });
      updatePaths();
    };

    const renderList = (list, currentPath = "") => (
      <ul>
        {list.map((item) => (
          <li key={item.name}>
            <Link to={`${basePath}/${currentPath}${item.name}`}>
              {item.name}
            </Link>{" "}
            Knowledge - {knowledgeMap[`${basePath}/${currentPath}${item.name}`]}{" "}
            HasTraining -{" "}
            {hasTrainingMap[`${basePath}/${currentPath}${item.name}`]
              ? "True"
              : "False"}
            <button
              type="button"
              onClick={async () => {
                console.log(await getFlashcards(user));
                handleClickModify(`${basePath}/${currentPath}${item.name}`);
              }}
            >
              Modify
            </button>
            <button
              type="submit"
              onClick={() => {
                handleClickDelete(`${basePath}/${currentPath}${item.name}`);
              }}
            >
              X
            </button>
            {item.children.length > 0 &&
              renderList(item.children, `${currentPath}${item.name}/`)}{" "}
          </li>
        ))}
      </ul>
    );

    return renderList(nestedList);
  }

  return <div>{generateNestedList(rutas)}</div>;
};

export default ListDecks;
