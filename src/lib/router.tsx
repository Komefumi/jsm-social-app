import { createBrowserRouter, redirect } from "react-router-dom";
import Root from "../routes/root";
import Home from "../routes/home";
import SignInForm from "../routes/SignInForm";
import SignUpForm from "../routes/SignUpForm";
import AuthLayout from "../layout/AuthLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: "auth",
    element: <AuthLayout />,
    loader: ({ request }) => {
      const url = request.url;
      const urlSplit = url.split("/");
      console.log({ urlSplit });
      if (urlSplit[urlSplit.length - 1] === "auth") {
        return redirect("/auth/sign-in");
      }
      return {};
    },
    children: [
      {
        index: true,
        path: "sign-in",
        element: <SignInForm />,
      },
      {
        path: "sign-up",
        element: <SignUpForm />,
      },
    ],
  },
]);
