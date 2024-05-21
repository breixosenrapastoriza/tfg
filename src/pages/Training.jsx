import { useContext, useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { getFlashcards, updateFlashcard, getPath } from "../config/firebase";
import {
  currentTime,
  dateDifference,
  enumToNumber,
  getRandomInt,
} from "../utils/utils";

const Training = () => {
  const params = useLoaderData();
  const { user, setUser } = useContext(UserContext);
  const currentPath = "/" + params.id + (params["*"] && "/" + params["*"]);

  const [flashcard, setFlashcard] = useState({});
  const [show, setShow] = useState(false);
  const [load, setLoad] = useState(true);
  const [empty, setEmpty] = useState(false);
  const [configuration, setConfiguration] = useState({});

  const loadFlashcard = async () => {
    let gottenFlashcards = await getFlashcards(user);
    gottenFlashcards = gottenFlashcards.filter((card) =>
      card.path.startsWith(currentPath)
    );
    gottenFlashcards = gottenFlashcards.filter(
      (card) => dateDifference(currentTime(0), card.time) <= 0
    );

    if (gottenFlashcards.length !== 0) {
      const minKnowledge = gottenFlashcards.reduce((min, current) => {
        return current.knowledge < min ? current.knowledge : min;
      }, gottenFlashcards[0].knowledge);

      const listLeastKnowledgeFlashcards = gottenFlashcards.filter(
        (carta) => carta.knowledge === minKnowledge
      );
      const leastKnowledgeFlashcard =
        listLeastKnowledgeFlashcards[
          getRandomInt(listLeastKnowledgeFlashcards.length - 1)
        ];

      setFlashcard(leastKnowledgeFlashcard);
      setLoad(false);
      setEmpty(false);
    } else {
      setEmpty(true);
    }
  };

  const loadConfiguration = async () => {
    setConfiguration(await getPath(user, currentPath));
  };

  useEffect(() => {
    if (!user) {
      navigate("/welcome");
      return;
    }
    loadFlashcard();
    loadConfiguration();
    console.log(configuration);
    console.log({
      space: enumToNumber(configuration.space),
      lose: -enumToNumber(configuration.lose),
      gain: enumToNumber(configuration.gain),
    });
  }, [load]);

  const rateFlashcard = (knowledgeParam) => {
    let nextKnowledge = flashcard.knowledge + knowledgeParam;
    if (nextKnowledge < 0) {
      nextKnowledge = 0;
    }
    let minutesNextReview;
    if (nextKnowledge < 1) {
      minutesNextReview = 0;
    } else if (nextKnowledge >= 1 && nextKnowledge < 2) {
      minutesNextReview = 5 * enumToNumber(configuration.space);
    } else if (nextKnowledge >= 2 && nextKnowledge < 3) {
      minutesNextReview = 15 * enumToNumber(configuration.space);
    } else if (nextKnowledge >= 3 && nextKnowledge < 4) {
      minutesNextReview = 30 * enumToNumber(configuration.space);
    } else if (nextKnowledge >= 4 && nextKnowledge < 5) {
      minutesNextReview = 60 * enumToNumber(configuration.space);
    } else if (nextKnowledge >= 5 && nextKnowledge < 6) {
      minutesNextReview = 120 * enumToNumber(configuration.space);
    } else if (nextKnowledge >= 6 && nextKnowledge < 7) {
      minutesNextReview = 240 * enumToNumber(configuration.space);
    } else if (nextKnowledge >= 7 && nextKnowledge < 8) {
      minutesNextReview = 480 * enumToNumber(configuration.space);
    } else if (nextKnowledge >= 8 && nextKnowledge < 9) {
      minutesNextReview = 1440 * enumToNumber(configuration.space);
    } else if (nextKnowledge >= 9 && nextKnowledge < 10) {
      minutesNextReview = 2880 * enumToNumber(configuration.space);
    } else {
      minutesNextReview = 5760 * enumToNumber(configuration.space);
    }
    console.log(nextKnowledge);
    console.log(minutesNextReview);

    updateFlashcard(user, flashcard.id, {
      question: flashcard.question,
      answer: flashcard.answer,
      time: currentTime(minutesNextReview),
      knowledge: nextKnowledge,
    });
    setLoad(true);
    setShow(false);
  };

  return (
    <>
      {empty ? (
        <p>There are no cards to study</p>
      ) : (
        <div>
          <h3>{flashcard.question}</h3>
          {show == false && (
            <button
              type="button"
              onClick={() => {
                setShow(!show);
              }}
            >
              Show answer
            </button>
          )}
          {show && (
            <div>
              <p>{flashcard.answer}</p>
              <button
                type="button"
                onClick={() => {
                  console.log(-1 * enumToNumber(configuration.lose));
                  rateFlashcard(-1 * enumToNumber(configuration.lose));
                }}
              >
                Bad
              </button>
              <button
                type="button"
                onClick={() => {
                  rateFlashcard(0);
                }}
              >
                Regular
              </button>
              <button
                type="button"
                onClick={() => {
                  console.log(enumToNumber(configuration.lose));
                  rateFlashcard(enumToNumber(configuration.gain));
                }}
              >
                Good
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Training;
