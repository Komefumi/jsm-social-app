import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { IAuthContext, IUser } from "./types";

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
    token: "",
    setToken: (token: string) => {
      const data = jwtDecode(token);
      setUsingSet("user", data);
      setUsingSet("token", token);
    },
  };
});
