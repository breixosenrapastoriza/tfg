import { useLoaderData, useNavigate } from "react-router";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import Training from "./Training";
import Flashcards from "./Flashcards";
import Configuration from "./Configuration";
import Generator from "./Generator";
import GeneratorText from "./GeneratorText";
import NavBar from "../components/NavBar";

const Deck = () => {
  const params = useLoaderData();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const currentPath = "/" + params.id + (params["*"] ? "/" + params["*"] : "");
  const [mode, setMode] = useState("flashcards");
  const [endedTraining, setEndedTraining] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/welcome");
    }
  }, [user, navigate]);

  return (
    <div
      className="container mt-5"
      style={{ backgroundColor: "transparent", boxShadow: "none" }}
    >
      <NavBar name={currentPath} />
      <div className="row mt-4">
        <div className="col text-center">
          {mode === "training" && (
            <button
              className={endedTraining ? "btn btn-danger" : "btn btn-primary"}
              type="button"
              onClick={() => setMode("flashcards")}
              style={{ boxShadow: "0px 0px 50px 2px rgba(0, 0, 0, 0.3)" }}
            >
              {endedTraining ? "End training" : "Cancel training"}
            </button>
          )}
          {(mode === "configuration" ||
            mode === "generator" ||
            mode === "generatorText") && (
            <button
              className="btn btn-danger"
              type="button"
              onClick={() => setMode("flashcards")}
              style={{
                boxShadow: "0px 0px 50px 2px rgba(0, 0, 0, 0.3)",
                borderRadius: "10px",
              }}
            >
              Cancel
            </button>
          )}
          {mode === "flashcards" && (
            <div className="d-flex justify-content-center flex-wrap">
              <button
                className="btn btn-success m-2"
                type="button"
                onClick={() => setMode("training")}
                style={{
                  boxShadow: "0px 0px 50px 2px rgba(0, 0, 0, 0.3)",
                  borderRadius: "15px",
                }}
              >
                <h1>
                  Start training <i className="bi bi-book"></i>
                </h1>
              </button>
              <button
                className="btn btn-primary m-2"
                type="button"
                onClick={() => setMode("configuration")}
                style={{
                  boxShadow: "0px 0px 50px 2px rgba(0, 0, 0, 0.3)",
                  borderRadius: "15px",
                }}
              >
                Configuration <i className="bi bi-tools"></i>
              </button>
              <button
                className="btn btn-primary m-2"
                type="button"
                onClick={() => setMode("generator")}
                style={{
                  minWidth: "200px",
                  boxShadow: "0px 0px 50px 2px rgba(0, 0, 0, 0.3)",
                  borderRadius: "15px",
                }}
              >
                <h4>
                  AI Flashcard Generator (<i>topic </i>){" "}
                  <i className="bi bi-robot"></i>
                </h4>
                <p>Create cards using a topic</p>
              </button>
              <button
                className="btn btn-primary m-2"
                type="button"
                onClick={() => setMode("generatorText")}
                style={{
                  minWidth: "200px",
                  boxShadow: "0px 0px 50px 2px rgba(0, 0, 0, 0.3)",
                  borderRadius: "15px",
                }}
              >
                <h4>
                  AI Flashcard Generator (<i>text </i>){" "}
                  <i className="bi bi-robot"></i>
                </h4>
                <p>Create cards putting text</p>
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="row mb-3 mt-4">
        <div className="col" style={{ backgroundColor: "transparent" }}>
          {mode === "training" && (
            <Training
              endedTraining={endedTraining}
              setEndedTraining={setEndedTraining}
            />
          )}
          {mode === "flashcards" && <Flashcards />}
          {mode === "generator" && <Generator mode={mode} setMode={setMode} />}
          {mode === "generatorText" && (
            <GeneratorText mode={mode} setMode={setMode} />
          )}
          {mode === "configuration" && (
            <Configuration
              currentPath={currentPath}
              mode={mode}
              setMode={setMode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Deck;

export const loaderDeck = ({ params }) => {
  return params;
};
