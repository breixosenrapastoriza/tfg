import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import {
  deleteFlashcard,
  deletePath,
  getFlashcards,
  getPaths,
} from "../config/firebase";

const ListDecks = ({ rutas, updatePaths }) => {
  const { user, setUser } = useContext(UserContext);

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

    const handleClickUpdate = () => {};

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
            <button
              type="button"
              onClick={() => {
                handleClickUpdate(`${basePath}/${currentPath}${item.name}`);
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
