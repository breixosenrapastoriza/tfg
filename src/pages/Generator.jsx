import { useLoaderData } from "react-router";
import React, { useEffect, useState, useContext } from "react";
import { addFlashcard, generateFlashcards } from "../config/firebase";
import { UserContext } from "../contexts/UserContext";

const Generator = () => {
  const [generatedFlashcards, setGeneratedFlashcards] = useState(
    []
  ); /*useState([
    { question: "question1", answer: "answer1" },
    { question: "question2", answer: "answer2" },
    { question: "question3", answer: "answer3" },
  ]);*/

  const params = useLoaderData();
  const { user, setUser } = useContext(UserContext);
  const currentPath = "/" + params.id + (params["*"] && "/" + params["*"]);

  const [currentFlashcard, setCurrentFlashcard] = useState({});
  const [index, setIndex] = useState(0);
  const [reference, setReference] = useState("");
  const [type, setType] = useState("Theme");
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setCurrentFlashcard({
      ...currentFlashcard,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeReference = (e) => {
    setReference(e.target.value);
  };

  const handleChangeType = (e) => {
    console.log(e.target.value);
    setType(e.target.value);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("INSECIÓN CARTAS GENERADAS");
    generatedFlashcards.forEach(async (card) => {
      await addFlashcard(user, {
        ...card,
        path: currentPath.replace(/\//g, "\\"),
      });
    });
  };

  const deleteAll = () => {
    setIndex(0);
    setGeneratedFlashcards([]);
  };

  const handleClick = async () => {
    deleteAll();
    try {
      const listFlashcards = await generateFlashcards(reference, type);
      if (!listFlashcards) {
        throw Error;
      }
      console.log(listFlashcards);
      setGeneratedFlashcards(listFlashcards);
      setError(false);
    } catch (error) {
      setError(true);
      console.log(error);
    }
  };

  return (
    <>
      <h1>Generator</h1>
      {error && <p>An error has occured</p>}
      <select value={type} onChange={handleChangeType}>
        <option>Theme</option>
        <option>Text</option>
      </select>
      <input
        type="text"
        value={reference}
        onChange={handleChangeReference}
      ></input>
      <button type="button" onClick={handleClick}>
        Generate
      </button>
      {generatedFlashcards.length === 0 ? (
        "Every generated flashcard has been deleted"
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <label>Question: </label>
            <input
              id="question"
              name="question"
              type="text"
              value={currentFlashcard.question || ""}
              onChange={handleChange}
            />
            <br />
            <label>Answer: </label>
            <input
              id="answer"
              name="answer"
              type="text"
              value={currentFlashcard.answer || ""}
              onChange={handleChange}
            />
            <br />
            <button type="button" onClick={handleDelete}>
              Delete
            </button>
            <br />
            <button
              type="button"
              onClick={() => setIndex(index > 0 ? index - 1 : 0)}
            >
              {"<"}
            </button>
            {index + 1}
            <button
              type="button"
              onClick={() =>
                setIndex(
                  index < generatedFlashcards.length - 1
                    ? index + 1
                    : generatedFlashcards.length - 1
                )
              }
            >
              {">"}
            </button>
            <br />
            <button type="submit">ADD</button>
          </form>
        </>
      )}
    </>
  );
};

export default Generator;
