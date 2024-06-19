// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  setDoc,
  addDoc,
  deleteDoc,
  getDocs,
  doc,
  collection,
  updateDoc,
  limit,
} from "firebase/firestore";
import React, { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import {
  currentTime,
  insertarSlash,
  obtenerSegmentosRuta,
} from "../utils/utils";
import { GoogleGenerativeAI } from "@google/generative-ai";
import jsonData from "../config/config.json";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: jsonData.apiKey,
  authDomain: jsonData.authDomain,
  projectId: jsonData.projectId,
  storageBucket: jsonData.storageBucket,
  messagingSenderId: jsonData.messagingSenderId,
  appId: jsonData.appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);
const clave = "AIzaSyAwWCse_2oRctPLEBjkoTI28zRtNH1SUqc"; // copiar su clave
const genAI = new GoogleGenerativeAI(clave);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const register = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  console.log("LogOut");
  return signOut(auth);
};

export const deleteCurrentUser = async () => {
  const user = auth.currentUser;

  if (user) {
    try {
      const flashcards = await getFlashcards(user.email);
      const paths = await getPaths(user.email);
      flashcards.forEach(async (flashcard) => {
        await deleteFlashcard(user.email, flashcard.id);
      });
      await deleteFlashcard(user.email, "ND");
      paths.forEach(async (path) => {
        const id = path.replace(/\//g, "\\");
        await deletePath(user.email, id);
      });
      await deletePath(user.email, "ND");
      await deleteDoc(doc(db, "users", user.email));
      await deleteUser(user);
      console.log("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  } else {
    console.log("No user is currently signed in.");
  }
};

export const setUserFolders = async (email, password) => {
  await setDoc(doc(db, "users", email), {});
  await setDoc(doc(db, "users", email, "paths", "ND"), {});
  await setDoc(doc(db, "users", email, "cards", "ND"), {});
};

export const codigoEjecutar = () => {
  //console.log(auth.currentUser.email);
};

export const addPath = async (email, name) => {
  name = insertarSlash(name);
  name = name.replace(/\//g, "\\");
  console.log(obtenerSegmentosRuta(name));
  const segments = obtenerSegmentosRuta(name);

  const promises = segments.map((segment) =>
    setDoc(doc(db, "users", email, "paths", segment), {
      limit: 20,
      space: "standar",
      lose: "standar",
      gain: "standar",
    })
  );

  await Promise.all(promises);
};

export const modifyPath = async (email, name, configuration) => {
  //name = insertarSlash(name);
  name = name.replace(/\//g, "\\");
  await setDoc(doc(db, "users", email, "paths", name), configuration);
};

export const deletePath = async (email, id) => {
  console.log("DELETE");
  await deleteDoc(doc(db, "users", email, "paths", id));
};

export const getPath = async (email, path) => {
  let result = null;
  const querySnapshot = await getDocs(collection(db, "users", email, "paths"));
  const modifiedPath = path.replace(/\//g, "\\");
  querySnapshot.forEach((doc) => {
    if (doc.id === modifiedPath) {
      result = { ...doc.data() };
    }
  });
  return result;
};

export const getPaths = async (email) => {
  const lista = [];
  const querySnapshot = await getDocs(collection(db, "users", email, "paths"));
  querySnapshot.forEach((doc) => {
    let path = doc.id;
    path = path.replace(/\\/g, "/");
    path !== "ND" && !lista.includes(path) && lista.push(path);
  });
  return lista;
};

//aun esta mal
export const getFlashcards = async (email) => {
  const lista = [];
  const querySnapshot = await getDocs(collection(db, "users", email, "cards"));
  querySnapshot.forEach((doc) => {
    if (doc.id !== "ND") {
      let path = doc.data().path.replace(/\\/g, "/");
      lista.push({ id: doc.id, ...doc.data(), path });
    }
  });
  return lista;
};

export const addFlashcard = async (email, flashcard) => {
  await addDoc(collection(db, "users", email, "cards"), {
    ...flashcard,
    time: currentTime(0),
    knowledge: 0,
    selected: false,
    onTraining: false,
    lastTraining: null,
  });
};

export const updateFlashcard = async (email, id, flashcard) => {
  await updateDoc(doc(db, "users", email, "cards", id), flashcard);
};

export const deleteFlashcard = async (email, id) => {
  await deleteDoc(doc(db, "users", email, "cards", id));
};

export const generateFlashcards = async (
  reference,
  type,
  number,
  difficulty = "Normal"
) => {
  try {
    console.log(reference);
    console.log(type);
    /*if (difficulty == "Difficult") {
      difficulty = "difíciles";
    } else if (difficulty == "Easy") {
      difficulty = "fáciles";
    } else {
      difficulty = "";
    }*/
    let prompt = "";
    if (type === "Text") {
      prompt =
        "Create " +
        number +
        ' flashcards and return them in the followin JSON format [{"question": "question1", "answer": "answer1"}, {"question": "question2", "answer": "answer2"}]. Do not put ```json neither at the start or at the end. Extract flashcards from this text [' +
        reference +
        "]";
    } else {
      prompt =
        "Create " +
        number +
        " flashcards " +
        difficulty +
        " of " +
        reference +
        ' in the following JSON format [{"question": "question1", "answer": "answer1"}, {"question": "question2", "answer": "answer2"}]. Do not put ```json neither at the start or at the end.';
    }
    //console.log(prompt);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    //console.log(response.text());
    const text = await response.text();
    console.log(text.startsWith("["));
    const jsonString = text.startsWith("[")
      ? text.replace(/}\s*,\s*{/g, "},{")
      : "[" + text.replace(/}\s*,\s*{/g, "},{") + "]";
    const listaObjetos = JSON.parse(jsonString);

    return listaObjetos;
  } catch (error) {
    console.log(error);
  }
};
