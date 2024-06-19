import { useContext, useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { getFlashcards, updateFlashcard, getPath } from "../config/firebase";
import {
  currentTime,
  dateDifference,
  enumToNumber,
  getRandomInt,
} from "../utils/utils";

import jsonData from "../config/config.json";

const Training = ({ endedTraining, setEndedTraining }) => {
  const params = useLoaderData();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const currentPath = "/" + params.id + (params["*"] ? "/" + params["*"] : "");

  const [flashcard, setFlashcard] = useState({});
  const [show, setShow] = useState(false);
  const [load, setLoad] = useState(true);
  const [empty, setEmpty] = useState(false);
  const [message, setMessage] = useState("");
  const [configuration, setConfiguration] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const loadFlashcard = async () => {
    console.log("LOG");
    setLoading(true);

    const [gottenFlashcards, path] = await Promise.all([
      getFlashcards(user),
      getPath(user, currentPath),
    ]);

    const filteredFlashcards = gottenFlashcards
      .filter((card) => card.path.startsWith(currentPath))
      .map((card) => ({
        ...card,
        onTraining:
          card.onTraining &&
          dateDifference(currentTime(0), card.lastTraining) >
            -jsonData.dailyTrainingInterval,
      }));

    await Promise.all(
      filteredFlashcards.map((card) => {
        const { id, ...rest } = card;
        return updateFlashcard(user, id, { ...rest });
      })
    );

    const numberOnTraining = filteredFlashcards.filter(
      (card) => card.onTraining
    ).length;

    if (numberOnTraining >= path.limit) {
      setMessage(
        "You have reached the daily limit of cards trained. Well done!"
      );
      setFlashcard(filteredFlashcards.find((card) => card.onTraining));
      setLoad(false);
      setEmpty(false);
      setLoading(false);
      return;
    }

    const flashcardsToReview = filteredFlashcards.filter(
      (card) => dateDifference(currentTime(0), card.time) <= 0
    );

    if (flashcardsToReview.length === 0) {
      setEmpty(true);
      setEndedTraining(true);
      setLoading(false);
      return;
    }

    const selectedFlashcards = flashcardsToReview.filter(
      (card) => card.selected
    );
    const random = getRandomInt(100);
    const leastKnowledgeFlashcard =
      random < 90 && selectedFlashcards.length > 0
        ? selectedFlashcards
        : flashcardsToReview;

    const minKnowledge = Math.min(
      ...leastKnowledgeFlashcard.map((card) => card.knowledge)
    );
    const listLeastKnowledgeFlashcards = leastKnowledgeFlashcard.filter(
      (card) => card.knowledge === minKnowledge
    );

    const finalFlashcard =
      listLeastKnowledgeFlashcards[
        getRandomInt(listLeastKnowledgeFlashcards.length - 1)
      ];

    setFlashcard(finalFlashcard);
    setLoad(false);
    setEmpty(false);
    setEndedTraining(false);
    setLoading(false);
    setShow(false);
  };

  const loadConfiguration = async () => {
    setConfiguration(await getPath(user, currentPath));
  };

  useEffect(() => {
    if (!user) {
      navigate("/welcome");
      return;
    }
    if (initialLoad) {
      Promise.all([loadFlashcard(), loadConfiguration()]);
      setInitialLoad(false);
    } else if (load) {
      loadFlashcard();
    }
  }, [user, load, initialLoad]);

  const rateFlashcard = async (knowledgeParam) => {
    setLoading(true);
    let nextKnowledge = flashcard.knowledge + knowledgeParam;
    if (nextKnowledge < 0) {
      nextKnowledge = 0;
    }
    const minutesNextReview =
      jsonData.spaceValues[Math.min(Math.floor(nextKnowledge), 9)] *
      enumToNumber(configuration.space);

    await updateFlashcard(user, flashcard.id, {
      question: flashcard.question,
      answer: flashcard.answer,
      time: currentTime(minutesNextReview),
      knowledge: nextKnowledge,
      selected: nextKnowledge < 5,
      onTraining: true,
      lastTraining: currentTime(0),
    });
    setLoad(true);
    setLoading(false);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (show) {
        if (event.key === "a") {
          rateFlashcard(-1 * enumToNumber(configuration.lose));
        } else if (event.key === "s") {
          rateFlashcard(0);
        } else if (event.key === "d") {
          rateFlashcard(enumToNumber(configuration.gain));
        }
      }
      if (event.key === " ") {
        setShow((prevShow) => !prevShow);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [configuration, flashcard, show]);

  return loading ? (
    <div className="row">
      <div
        className="col text-center"
        style={{ color: "white", boxShadow: "none" }}
      >
        {loading && (
          <div className="loader mb-4" style={{ width: "200px" }}></div>
        )}
      </div>
    </div>
  ) : (
    <div
      className="container"
      style={{ backgroundColor: "transparent", boxShadow: "none" }}
    >
      {empty ? (
        <div
          className="text-center"
          style={{ color: "white", boxShadow: "none" }}
        >
          <h3>The training has already been completed!</h3>
          <h4>{message}</h4>
        </div>
      ) : (
        <div className="flashcard-container">
          <div className={`flashcard ${show ? "show-answer" : ""}`}>
            <div className="front">
              <div className="row mb-3">
                <div className="col text-center">
                  <h3>{flashcard.question}</h3>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col text-center">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setShow(!show);
                    }}
                    title="Show answer (Press space bar)"
                  >
                    Show answer
                  </button>
                </div>
              </div>
            </div>
            <div className="back">
              <div className="row mb-3">
                <div className="col text-center">
                  <p>{flashcard.answer}</p>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      rateFlashcard(-1 * enumToNumber(configuration.lose));
                    }}
                    title="Mark flashcard as bad (Press A)"
                  >
                    Bad
                  </button>
                </div>
                <div className="col">
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={() => {
                      rateFlashcard(0);
                    }}
                    title="Mark flashcard as regular (Press S)"
                  >
                    Regular
                  </button>
                </div>
                <div className="col">
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => {
                      rateFlashcard(enumToNumber(configuration.gain));
                    }}
                    title="Mark flashcard as good (Press D)"
                  >
                    Good
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Training;
