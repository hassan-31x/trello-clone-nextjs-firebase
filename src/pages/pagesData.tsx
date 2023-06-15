import { routerType } from "../types/router.types";
import Login from "./Login";
import Home from "./Home";

const pagesData: routerType[] = [
  {
    path: "",
    element: <Home />,
    title: "home"
  },
  {
    path: "login",
    element: <Login />,
    title: "about"
  }
];

export default pagesData;