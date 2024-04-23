import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Start from "../pages/Start";
import Deck, { loaderDeck } from "../pages/Deck";
import Auth from "../pages/Auth";
import UserProvider from "../contexts/UserContext";
import Welcome from "../pages/Welcome";

export const router = createBrowserRouter([
  {
    path: "/welcome",
    element: <Welcome />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: (
      <UserProvider>
        <Start />
      </UserProvider>
    ),
  },
  {
    path: "/auth",
    element: (
      <UserProvider>
        <Auth />
      </UserProvider>
    ),
  },
  {
    path: "/:id/*",
    element: (
      <UserProvider>
        <Deck />
      </UserProvider>
    ),
    loader: loaderDeck,
  },
]);
