import React from "react";
import { Models } from "appwrite";
export type { AppRouter as ServerAppRouter } from "../../server-code/src/index";

type IDType = string;

export type IAuthContext = {
  user: IUser;
  isLoading: boolean;
  setUser: (user: IUser) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  checkAuthUser: () => Promise<boolean>;
};

export type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type IUpdateUser = {
  userID: string;
  name: string;
  bio: string;
  imageID: string;
  imageURL: URL | string;
  file: File[];
};

export type INewPost = {
  userID: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUpdatePost = {
  postID: string;
  caption: string;
  imageID: string;
  imageURL: URL;
  file: File[];
  location?: string;
  tags?: string;
};

export type IPostCommon = INewPost | IUpdatePost;

export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageURL: string;
  bio: string;
};

export interface IUserDocument extends Models.Document, IUser {
  posts: unknown[];
  imageID: IDType;
  accountID: IDType;
  save: IPostDocument[];
}

export interface IPostDocument extends Models.Document {
  caption?: string;
  creator: IUserDocument;
  likes: IUserDocument[];
  tags: string[];
  location?: string;
}

export interface ISaveDocument extends Models.Document {
  user: IUserDocument;
  post: IPostDocument;
}

// export interface

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
  bio?: string;
};
