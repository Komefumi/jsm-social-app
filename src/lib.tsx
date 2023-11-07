import { createBrowserRouter } from "react-router-dom";
import Root from "./routes/root";
import Home from "./routes/home";
import SignInForm from "./routes/SignInForm";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <Home />,
      },
    ],
  },
  {
    path: "/sign-in",
    element: <SignInForm />,
  },
]);
