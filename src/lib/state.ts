import { create } from "zustand";
import { IAuthContext, IUser } from "./types";
import { getCurrentUser } from "./appwrite/api";

export const INITIAL_USER: IUser = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageURL: "",
  bio: "",
};

export const useAuthStore = create<IAuthContext>()((set) => {
  const setUsingSet = <T>(key: keyof IAuthContext, val: T) => {
    set((state) => ({ ...state, [key]: val }));
  };
  return {
    user: INITIAL_USER,
    setUser: (user: IUser) => {
      setUsingSet("user", user);
    },
    isAuthenticated: false,
    isLoading: false,
    setIsAuthenticated: (val: boolean) => {
      setUsingSet("isAuthenticated", val);
    },
    checkAuthUser: async () => {
      console.log("in checkAuthUser");
      let success = false;
      try {
        const retrieved = await getCurrentUser();
        console.log({ retrieved });
        const { $id, name, username, email, imageURL, bio } = retrieved;

        if ($id) {
          setUsingSet("user", {
            id: $id,
            name,
            username,
            email,
            imageURL,
            bio,
          });

          success = true;
          setUsingSet("isAuthenticated", true);
        }
      } catch (error) {
        console.log("failing getCurrentUser");
        console.error(error);
      }
      setUsingSet("isLoading", false);
      return success;
    },
  };
});
