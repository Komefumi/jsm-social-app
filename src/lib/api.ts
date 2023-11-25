import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { ArgsGetTimeline, INewPost, INewUser, ServerAppRouter } from "./types";

const { VITE_TRPC_SERVER_URL } = import.meta.env;
console.log({ VITE_TRPC_SERVER_URL });

export const trpc = createTRPCProxyClient<ServerAppRouter>({
  links: [
    httpBatchLink({
      url: VITE_TRPC_SERVER_URL,
    }),
  ],
});

export async function createUserAccount(user: INewUser) {
  const result = await trpc.createUser.mutate(user);
  return result;
}

export async function signInAccount(user: {
  usernameOrEmail: string;
  password: string;
}) {
  const result = await trpc.login.query(user);
  return result;
}

export async function createPost(post: INewPost) {
  const { newPost } = await trpc.createPost.mutate(post);
  return newPost;
}

export async function getTimeline(args: ArgsGetTimeline) {
  const { postItems } = await trpc.getTimeline.query(args);
  return postItems;
}
