import { routerType } from "../types/router.types";
import Login from "./Login";
import Home from "./Home";
import Register from "./Register";

const pagesData: routerType[] = [
  {
    path: "",
    element: <Home />,
    title: "home"
  },
  {
    path: "login",
    element: <Login />,
    title: "login"
  },
  {
    path: "register",
    element: <Register />,
    title: "register"
  }
];

export default pagesData;