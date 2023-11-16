import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPost,
  createUserAccount,
  deleteSaveForUser,
  deleteSavedPost,
  getCurrentUser,
  getRecentPosts,
  getSingularSaves,
  likePost,
  savePost,
  signInAccount,
  signOutAccount,
  updateSaves,
} from "../appwrite/api";
import { INewPost, INewUser, ISaveDocument } from "../types";
import { QUERY_KEYS } from "./query-keys";
import { Models } from "appwrite";

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useUserSignIn = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: () => signOutAccount(),
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  });
};

export const useGetSingularSaves = (userID?: string, postID?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_SINGULAR_SAVES],
    queryFn: async (): Promise<ISaveDocument[]> => {
      if (!userID || !postID) return [];
      const saves = await getSingularSaves(userID, postID);
      return saves.documents;
    },
  });
};

export const useUpdateSaves = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userID,
      saves,
    }: {
      userID: string;
      saves: ISaveDocument[];
    }) => {
      const updatedUser = await updateSaves(userID, saves);
      return updatedUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SINGULAR_SAVES],
      });
    },
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postID,
      likesArray,
    }: {
      postID: string;
      likesArray: string[];
    }) => {
      const post = await likePost(postID, likesArray)!;
      return post!;
    },
    onSuccess: (data: Models.Document) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useSavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postID,
      userID,
    }: {
      postID: string;
      userID: string;
    }) => {
      const post = await savePost(postID, userID)!;
      return post!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useDeleteSaveForUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userID,
      postID,
    }: {
      userID: string;
      postID: string;
    }) => {
      const updatedUser = await deleteSaveForUser(userID, postID);
      return updatedUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SINGULAR_SAVES],
      });
    },
  });
};

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (savedRecordID: string) => {
      const post = await deleteSavedPost(savedRecordID)!;
      return post!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SINGULAR_SAVES],
      });
    },
  });
};

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: async function getCurrentUserQueryFn() {
      const data = await getCurrentUser();
      return data;
    },
  });
};
