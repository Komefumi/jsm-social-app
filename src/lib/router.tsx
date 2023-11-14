import {
  createBrowserRouter,
  redirect,
  NonIndexRouteObject,
} from "react-router-dom";
import Root from "../routes/root";
import Home from "../routes/home";
import SignInForm from "../routes/SignInForm";
import SignUpForm from "../routes/SignUpForm";
import AuthLayout from "../layout/AuthLayout";
import RootLayout from "@/layout/RootLayout";
import Explore from "@/routes/Explore";
import Saved from "@/routes/Saved";
import AllUsers from "@/routes/AllUsers";
import CreatePost from "@/routes/CreatePost";
import EditPost from "@/routes/EditPost";
import PostDetails from "@/routes/PostDetails";
import Profile from "@/routes/Profile";
import UpdateProfile from "@/routes/UpdateProfile";
import LikedPosts from "@/routes/LikedPosts";

const simpleRootConfigList: NonIndexRouteObject[] = [
  ["/explore", <Explore />],
  ["/saved", <Saved />],
  ["/all-users", <AllUsers />],
  ["/create-post", <CreatePost />],
  ["/update-post/:id", <EditPost />],
  ["/posts/:id", <PostDetails />],
  ["/profile/:id/*", <Profile />],
  ["/update-profile/:id", <UpdateProfile />],
  ["/liked-posts", <LikedPosts />],
].map(([path, element]) => {
  return { path, element } as NonIndexRouteObject;
});

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <RootLayout />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          ...simpleRootConfigList,
        ],
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
