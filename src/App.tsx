import { RouterProvider } from "react-router-dom";
import { router } from "./lib";
import "./globals.css";

export default () => {
  return <RouterProvider router={router} />;
};
