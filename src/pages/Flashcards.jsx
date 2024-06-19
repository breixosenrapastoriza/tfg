import { useState, useEffect, useContext } from "react";
import { useLoaderData, useNavigate } from "react-router";
import {
  addFlashcard,
  deleteFlashcard,
  getFlashcards,
  updateFlashcard,
} from "../config/firebase";
import { UserContext } from "../contexts/UserContext";
import { Link } from "react-router-dom";
import { addLeadingZeros } from "../utils/utils";

const Flashcards = () => {
  const params = useLoaderData();
  const { user, setUser } = useContext(UserContext);
  const currentPath = "/" + params.id + (params["*"] ? "/" + params["*"] : "");
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [filteredFlashcards, setFilteredFlashcards] = useState([]);
  const [flashcard, setFlashcard] = useState({
    question: "",
    answer: "",
    path: currentPath.replace(/\//g, "\\"),
  });
  const [loading, setLoading] = useState(false);
  const [modify, setModify] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    await addFlashcard(user, flashcard);
    loadFlashcards();
    setFlashcard({
      question: "",
      answer: "",
      path: currentPath.replace(/\//g, "\\"),
    });
    setLoading(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updateFlashcard(user, selectedCardId, flashcard);
    loadFlashcards();
    setFlashcard({
      question: "",
      answer: "",
      path: currentPath.replace(/\//g, "\\"),
    });
    setLoading(false);
  };

  const handleChange = (e) => {
    setFlashcard({ ...flashcard, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClickDelete = async (id) => {
    setLoading(true);
    await deleteFlashcard(user, id);
    loadFlashcards();
    setLoading(false);
  };

  const handleClickUpdate = async (card) => {
    setLoading(true);
    setFlashcard(card);
    setModify(true);
    setSelectedCardId(card.id);
    setLoading(false);
  };

  const loadFlashcards = async () => {
    setLoading(true);
    let gottenFlashcards = await getFlashcards(user);
    gottenFlashcards = gottenFlashcards.filter((card) =>
      card.path.startsWith(currentPath)
    );
    setFlashcards(gottenFlashcards);
    filterFlashcards(searchTerm, gottenFlashcards);
    setLoading(false);
  };

  const filterFlashcards = (term, flashcardsToFilter) => {
    const filtered = flashcardsToFilter.filter(
      (card) =>
        card.question.toLowerCase().includes(term.toLowerCase()) ||
        card.answer.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredFlashcards(filtered);
  };

  useEffect(() => {
    if (!user) {
      navigate("/welcome");
      return;
    }
    loadFlashcards();
  }, [user]);

  useEffect(() => {
    filterFlashcards(searchTerm, flashcards);
  }, [searchTerm, flashcards]);

  return (
    <div
      className="container"
      style={{ backgroundColor: "transparent", boxShadow: "none" }}
    >
      <div className="row">
        <div className="col text-center">
          <form
            onSubmit={modify ? handleUpdate : handleAdd}
            className="input-group mb-3"
            style={{ boxShadow: "0px 0px 15px 2px rgba(0, 0, 0, 0.3)" }}
          >
            <span className="input-group-text">
              {modify ? "Modify Flashcard" : "Add Flashcard"}
            </span>
            <input
              type="text"
              name="question"
              value={flashcard.question}
              onChange={handleChange}
              placeholder="Question"
              className="form-control"
            />
            <input
              type="text"
              name="answer"
              value={flashcard.answer}
              onChange={handleChange}
              placeholder="Answer"
              className="form-control"
            />
            <button type="submit" className="btn btn-primary">
              {modify ? "Modify" : "Add"}
            </button>
            {modify && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setFlashcard({
                    question: "",
                    answer: "",
                    path: currentPath.replace(/\//g, "\\"),
                  });
                  setModify(false);
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      </div>
      <div className="row">
        <div className="col text-center">
          <input
            type="text"
            placeholder="Search flashcards"
            value={searchTerm}
            onChange={handleSearch}
            className="form-control"
            style={{ boxShadow: "0px 0px 25px 2px rgba(0, 0, 0, 0.5)" }}
          />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col text-center">
          <div>
            {loading && (
              <div
                className="loader mb-4"
                style={{
                  width: "200px",
                  boxShadow: "none",
                }}
              ></div>
            )}
            {!loading && filteredFlashcards.length == 0 && (
              <h4
                style={{
                  color: "white",
                  boxShadow: "none",
                }}
              >
                There are no cards
              </h4>
            )}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <ul
            className="list-group list-group-flush"
            style={
              filteredFlashcards.length !== 0
                ? {
                    boxShadow: "0px 0px 25px 2px rgba(0, 0, 0, 0.5)",
                    borderRadius: "10px",
                  }
                : { boxShadow: "none" }
            }
          >
            {filteredFlashcards.map((card) => (
              <li
                className="list-group-item d-flex justify-content-between align-items-start"
                key={card.id}
              >
                <div className="ms-2 me-auto">
                  <div className="fw-bold">{card.question}</div>
                  <div>{card.answer}</div>
                  <div>{card.path}</div>
                  <div>{addLeadingZeros(card.time)}</div>
                </div>
                <div>
                  <button
                    className="btn btn-light btn-sm me-2"
                    type="button"
                    onClick={() => handleClickUpdate(card)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    type="button"
                    onClick={() => handleClickDelete(card.id)}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Flashcards;
