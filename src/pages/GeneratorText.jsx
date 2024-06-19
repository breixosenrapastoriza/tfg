import { useLoaderData } from "react-router";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import { addFlashcard, generateFlashcards } from "../config/firebase";
import { UserContext } from "../contexts/UserContext";

const Generator = ({ mode, setMode }) => {
  const [generatedFlashcards, setGeneratedFlashcards] = useState([]);
  const params = useLoaderData();
  const { user } = useContext(UserContext);
  const currentPath = "/" + params.id + (params["*"] ? "/" + params["*"] : "");
  const [currentFlashcard, setCurrentFlashcard] = useState({});
  const [index, setIndex] = useState(0);
  const [reference, setReference] = useState("");
  const [difficulty, setDifficulty] = useState("Normal");
  const [number, setNumber] = useState(10);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCurrentFlashcard({
      ...currentFlashcard,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeReference = (e) => {
    setReference(e.target.value);
  };

  const handleChangeNumber = (e) => {
    setNumber(e.target.value);
  };

  const handleChangeDifficulty = (e) => {
    setDifficulty(e.target.value);
  };

  useEffect(() => {
    if (generatedFlashcards.length > 0) {
      setCurrentFlashcard(generatedFlashcards[index]);
    } else {
      setCurrentFlashcard({});
    }
  }, [index, generatedFlashcards]);

  useEffect(() => {
    if (
      generatedFlashcards.length > 0 &&
      currentFlashcard.question &&
      currentFlashcard.answer
    ) {
      const newFlashcards = [...generatedFlashcards];
      newFlashcards[index] = currentFlashcard;
      setGeneratedFlashcards(newFlashcards);
    }
  }, [currentFlashcard]);

  const handleDelete = () => {
    const newFlashcards = generatedFlashcards.filter((_, i) => i !== index);
    setGeneratedFlashcards(newFlashcards);
    if (index > 0) {
      setIndex(index - 1);
    } else if (index === 0 && newFlashcards.length > 0) {
      setIndex(0);
    } else {
      setCurrentFlashcard({});
    }
  };

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    generatedFlashcards.forEach(async (card) => {
      await addFlashcard(user, {
        ...card,
        path: currentPath.replace(/\//g, "\\"),
      });
    });
    setLoading(false);
    setMode("flashcards");
  };

  const handleAddAll = (e) => {
    e.preventDefault();
    setLoading(true);
    generatedFlashcards.forEach(async (card) => {
      await addFlashcard(user, {
        ...card,
        path: currentPath.replace(/\//g, "\\"),
      });
    });
    setLoading(false);
    setMode("flashcards");
  };

  const deleteAll = () => {
    setIndex(0);
    setGeneratedFlashcards([]);
  };

  const handleClick = async () => {
    deleteAll();
    try {
      setLoading(true);
      const listFlashcards = await generateFlashcards(
        reference,
        "Theme",
        number,
        difficulty
      );
      if (!listFlashcards) {
        throw new Error("Error generating flashcards");
      }
      setGeneratedFlashcards(listFlashcards);
      setError(false);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container"
      style={{ backgroundColor: "transparent", boxShadow: "none" }}
    >
      <div className="row mb-4">
        <div className="col text-center">
          <h1 style={{ color: "white" }}>Generator by Text</h1>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col text-center">
          {error && (
            <p className="text-danger">An error has occurred, try again</p>
          )}
          <div>
            {loading && (
              <div className="loader mb-4" style={{ width: "200px" }}></div>
            )}
          </div>
        </div>
      </div>
      <div className="row mb-4 justify-content-center">
        <div className="col-auto">
          <form
            className="input-group mb-3 generator-form"
            style={{
              boxShadow: "0px 0px 50px 2px rgba(0, 0, 0, 0.5)",
              width: "600px", // Añade esta línea para establecer el ancho
            }}
          >
            <div className="form-group">
              <label className="input-group-text" style={{ border: "none" }}>
                Number of cards:{" "}
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={number}
                onChange={handleChangeNumber}
                className="form-control"
              />
            </div>
            <div className="form-group mt-2">
              <label className="input-group-text" style={{ border: "none" }}>
                Text:{" "}
              </label>
              <textarea
                value={reference}
                onChange={handleChangeReference}
                className="form-control"
                rows="4"
              />
            </div>
            <div className="form-group mt-2">
              <label className="input-group-text" style={{ border: "none" }}>
                Difficulty:{" "}
              </label>
              <select
                value={difficulty}
                onChange={handleChangeDifficulty}
                className="form-control"
              >
                <option>Normal</option>
                <option>Easy</option>
                <option>Difficult</option>
              </select>
            </div>
            <button
              type="button"
              onClick={handleClick}
              className="btn btn-primary mt-3 rounded-button"
              style={{ borderRadius: "10px" }}
            >
              Generate
            </button>
          </form>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-auto">
          {generatedFlashcards.length === 0 ? (
            <p style={{ color: "white" }}>There are no generated flashcards</p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="input-group mb-3 flashcard-form"
              style={{
                boxShadow: "0px 0px 50px 2px rgba(0, 0, 0, 0.5)",
                width: "600px", // Añade esta línea para establecer el ancho
              }}
            >
              <div className="form-group">
                <label className="input-group-text" style={{ border: "none" }}>
                  Question:{" "}
                </label>
                <input
                  id="question"
                  name="question"
                  type="text"
                  value={currentFlashcard.question || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group mt-2">
                <label className="input-group-text" style={{ border: "none" }}>
                  Answer:{" "}
                </label>
                <input
                  id="answer"
                  name="answer"
                  type="text"
                  value={currentFlashcard.answer || ""}
                  onChange={handleChange}
                  className="form-control mb-2"
                />
              </div>
              <div className="form-group mt-2 d-flex justify-content-between align-items-center">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="btn btn-danger"
                >
                  Discard this flashcard
                </button>
                <div className="d-flex align-items-center">
                  <button
                    type="button"
                    onClick={() => setIndex(index > 0 ? index - 1 : 0)}
                    className="btn btn-light"
                  >
                    {"<"}
                  </button>
                  <span className="input-group-text mx-2">{index + 1}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setIndex(
                        index < generatedFlashcards.length - 1
                          ? index + 1
                          : generatedFlashcards.length - 1
                      )
                    }
                    className="btn btn-light"
                  >
                    {">"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
      {generatedFlashcards.length > 0 && (
        <div className="row justify-content-center">
          <div className="col-auto">
            <button
              type="button"
              className="btn btn-primary rounded-button"
              style={{
                boxShadow: "0px 0px 50px 2px rgba(0, 0, 0, 0.5)",
                borderRadius: "10px", // Añade esta línea para establecer el ancho
              }}
              onClick={handleAddAll}
            >
              Add all
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Generator;
