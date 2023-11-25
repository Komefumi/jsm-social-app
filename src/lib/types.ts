import React from "react";
import { Models } from "appwrite";
export type { AppRouter as ServerAppRouter } from "../../server-code/src/index";

type IDType = string;

export type IAuthContext = {
  user: IUser;
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
};

export interface IAuthPayload {
  token: string;
}

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

export interface INewPost extends IAuthPayload {
  userID: string;
  caption: string;
  imageURL?: string;
  // file: File;
  location?: string;
  // tags?: string;
}

export type IUpdatePost = {
  postID: string;
  caption: string;
  imageID: string;
  imageURL: URL;
  file: File[];
  location?: string;
  // tags?: string;
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
  // tags: string[];
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

export interface ArgsGetTimeline extends IAuthPayload {
  pageNum?: number;
}

export type SaveData = {
  id: number;
  folder: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type LikeData = {
  id: number;
  userId: number;
  postId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type BackendReturnedPost = {
  likes: LikeData[];
  saves: SaveData[];
  Author: {
    id: number;
    name: string;
    imageURL: string | null;
    username: string;
    email: string;
    passwordHash: string;
    bio: string;
  } | null;
} & {
  id: number;
  caption: string;
  imageURL: string | null;
  location: string | null;
  authorId: number | null;
  createdAt: Date;
  updatedAt: Date;
};
