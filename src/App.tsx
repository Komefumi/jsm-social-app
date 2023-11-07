import { RouterProvider } from "react-router-dom";
import { router } from "./lib/router";
import "./globals.css";

export default () => {
  return <RouterProvider router={router} />;
};
