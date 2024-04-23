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

const Deck = () => {
  const params = useLoaderData();
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const currentPath = "/" + params.id + (params["*"] && "/" + params["*"]);
  const [training, setTraining] = useState(true);

  return (
    <div>
      <h1>{currentPath}</h1>
      <button type="button" onClick={() => navigate("/")}>
        {"<-"}
      </button>
      <button type="button" onClick={() => setTraining(!training)}>
        Start training
      </button>
      {training ? <Flashcards /> : <Training />}
    </div>
  );
};

export default Deck;

export const loaderDeck = ({ params }) => {
  return params;
};
