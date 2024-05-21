import { useLoaderData, useNavigate } from "react-router";
import { useState, useEffect, useContext } from "react";
import {
  addFlashcard,
  deleteFlashcard,
  getFlashcards,
  updateFlashcard,
} from "../config/firebase";
import { UserContext } from "../contexts/UserContext";
import { Link } from "react-router-dom";
import Training from "./Training";
import Flashcards from "./Flashcards";
import Configuration from "./Configuration";
import Generator from "./Generator";

const Deck = () => {
  const params = useLoaderData();
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const currentPath = "/" + params.id + (params["*"] && "/" + params["*"]);
  const [mode, setMode] = useState("flashcards");

  useEffect(() => {
    if (!user) {
      navigate("/welcome");
      return;
    }
  }, []);

  return (
    <div>
      <h1>{currentPath}</h1>
      <button
        type="button"
        onClick={() =>
          mode === "configuration" || mode === "generator"
            ? setMode("flashcards")
            : navigate("/")
        }
      >
        {"<-"}
      </button>
      {mode === "training" && (
        <button type="button" onClick={() => setMode("flashcards")}>
          Cancel training
        </button>
      )}
      {mode === "flashcards" && (
        <div>
          <button type="button" onClick={() => setMode("training")}>
            Start training
          </button>
          <button type="button" onClick={() => setMode("configuration")}>
            Configuration
          </button>
          <button type="button" onClick={() => setMode("generator")}>
            Generator
          </button>
        </div>
      )}
      {mode === "training" && <Training />}
      {mode === "flashcards" && <Flashcards />}
      {mode === "generator" && <Generator />}
      {mode === "configuration" && <Configuration currentPath={currentPath} />}
    </div>
  );
};

export default Deck;

export const loaderDeck = ({ params }) => {
  return params;
};
