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

const Flashcards = () => {
  const params = useLoaderData();
  const { user, setUser } = useContext(UserContext);
  const currentPath = "/" + params.id + (params["*"] && "/" + params["*"]);
  const [flashcards, setFlashcards] = useState([]);
  const [flashcard, setFlashcard] = useState({
    question: "",
    answer: "",
    path: currentPath.replace(/\//g, "\\"),
  });
  const [modify, setModify] = useState(false);
  const navigate = useNavigate();
  const [trainingMode, setTrainingMode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addFlashcard(user, flashcard);
    loadFlashcards();
    setFlashcard({
      question: "",
      answer: "",
      path: currentPath.replace(/\//g, "\\"),
    });
  };

  const handleChange = (e) => {
    setFlashcard({ ...flashcard, [e.target.name]: e.target.value });
  };

  const handleClickDelete = async (id) => {
    await deleteFlashcard(user, id);
    loadFlashcards();
  };

  const handleClickUpdate = async (card) => {
    setFlashcard(card);
    setModify(true);
  };

  const loadFlashcards = async () => {
    let gottenFlashcards = await getFlashcards(user);
    gottenFlashcards = gottenFlashcards.filter((card) =>
      card.path.startsWith(currentPath)
    );
    if (
      flashcards.length !== gottenFlashcards.length &&
      flashcards.every((item, index) => item !== gottenFlashcards[index])
    ) {
      setFlashcards(gottenFlashcards);
    }
  };

  useEffect(() => {
    loadFlashcards();
  }, [flashcards]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Question: </label>
        <input
          type="text"
          name="question"
          value={flashcard.question}
          onChange={handleChange}
        />
        <label>Answer: </label>
        <input
          type="text"
          name="answer"
          value={flashcard.answer}
          onChange={handleChange}
        />
        <button type="submit">{modify ? "Modify" : "Add"}</button>
      </form>
      <ul>
        {flashcards.map((card) => (
          <li key={card.id}>
            {card.question} - {card.answer} - {card.path} - {card.time}
            <button
              type="button"
              onClick={() => {
                handleClickUpdate(card);
              }}
            >
              Modify
            </button>
            <button
              type="button"
              onClick={() => {
                handleClickDelete(card.id);
              }}
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Flashcards;
