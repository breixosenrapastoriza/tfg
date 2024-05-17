// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
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
} from "firebase/firestore";
import React, { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { currentTime, obtenerSegmentosRuta } from "../utils/utils";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjQ4BGw5vksBa98q5Hp8iSr4I5xQws0_A",
  authDomain: "cloack-garden.firebaseapp.com",
  projectId: "cloack-garden",
  storageBucket: "cloack-garden.appspot.com",
  messagingSenderId: "978021721226",
  appId: "1:978021721226:web:2e535710e37cc500c63973",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

const db = getFirestore(app);

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

export const setUserFolders = async (email, password) => {
  await setDoc(doc(db, "users", email), {});
  await setDoc(doc(db, "users", email, "paths", "ND"), {});
  await setDoc(doc(db, "users", email, "cards", "ND"), {});
};

export const codigoEjecutar = () => {
  //console.log(auth.currentUser.email);
};

export const addPath = async (email, name) => {
  name = name.replace(/\//g, "\\");
  console.log(obtenerSegmentosRuta(name));
  const segments = obtenerSegmentosRuta(name);

  const promises = segments.map((segment) =>
    setDoc(doc(db, "users", email, "paths", segment), {})
  );

  await Promise.all(promises);
};

export const deletePath = async (email, id) => {
  await deleteDoc(doc(db, "users", email, "paths", id));
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
  });
};

export const updateFlashcard = async (email, id, flashcard) => {
  await updateDoc(doc(db, "users", email, "cards", id), flashcard);
};

export const deleteFlashcard = async (email, id) => {
  await deleteDoc(doc(db, "users", email, "cards", id));
};
