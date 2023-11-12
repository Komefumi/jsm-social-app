import { RouterProvider } from "react-router-dom";
import { router } from "./lib/router";
import "./globals.css";
import QueryProvider from "./lib/react-query/QueryProvider";

export default () => {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  );
};
