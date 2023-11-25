import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteSaveForUser,
  deleteSavedPost,
  getCurrentUser,
  getRecentPosts,
  getSingularSaves,
  likePost,
  savePost,
  signOutAccount,
  updateSaves,
} from "../appwrite/api";
import { ArgsGetTimeline, INewPost, INewUser, ISaveDocument } from "../types";
import { QUERY_KEYS } from "./query-keys";
import { Models } from "appwrite";
import {
  createPost,
  getTimeline,
  createUserAccount,
  signInAccount,
} from "../api";

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useUserSignIn = () => {
  return useMutation({
    mutationFn: (user: { usernameOrEmail: string; password: string }) =>
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
        queryKey: [QUERY_KEYS.GET_TIMELINE],
      });
    },
  });
};

export const useGetTimeline = (args: ArgsGetTimeline) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_TIMELINE],
    queryFn: () => getTimeline(args),
  });
};

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  });
};

export const useGetSaves = () => {
  return useQuery({
    queryKey: [],
    queryFn: () => {},
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
