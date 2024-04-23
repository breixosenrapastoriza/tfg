import { useContext, useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { getFlashcards, updateFlashcard } from "../config/firebase";
import { currentTime, dateDifference, getRandomInt } from "../utils/utils";

const Training = () => {
  const params = useLoaderData();
  const { user, setUser } = useContext(UserContext);
  const currentPath = "/" + params.id + (params["*"] && "/" + params["*"]);

  const [flashcard, setFlashcard] = useState({});
  const [show, setShow] = useState(false);
  const [load, setLoad] = useState(true);
  const [empty, setEmpty] = useState(false);

  const loadFlashcard = async () => {
    let gottenFlashcards = await getFlashcards(user);
    gottenFlashcards = gottenFlashcards.filter((card) =>
      card.path.startsWith(currentPath)
    );
    gottenFlashcards = gottenFlashcards.filter(
      (card) => dateDifference(currentTime(0), card.time) <= 0
    );

    if (gottenFlashcards.length !== 0) {
      /*const leastKnowledgeFlashcard = gottenFlashcards.reduce(
        (minor, actual) => {
          return actual.knowledge < minor.knowledge ? actual : minor;
        }
      );*/
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

  useEffect(() => {
    loadFlashcard();
  }, [load]);

  const rateFlashcard = (knowledgeParam) => {
    const nextKnowledge =
      knowledgeParam >= 0 ? flashcard.knowledge + knowledgeParam : 0;
    let minutesNextReview;
    switch (nextKnowledge) {
      case 0:
        minutesNextReview = 0;
        break;
      case 1:
        minutesNextReview = 5;
        break;
      case 2:
        minutesNextReview = 15;
        break;
      case 3:
        minutesNextReview = 30;
        break;
      case 4:
        minutesNextReview = 60;
        break;
      case 5:
        minutesNextReview = 120;
        break;
      case 6:
        minutesNextReview = 240;
        break;
      case 7:
        minutesNextReview = 480;
        break;
      case 8:
        minutesNextReview = 1440;
        break;
      case 9:
        minutesNextReview = 2880;
        break;
      default:
        minutesNextReview = 5760;
        break;
    }

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
                  rateFlashcard(-1);
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
                  rateFlashcard(1);
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
