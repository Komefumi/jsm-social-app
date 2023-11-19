import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { INewUser, ServerAppRouter } from "./types";

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
  try {
    const result = await trpc.createUser.mutate(user);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to register");
  }
  // const result = await trpc.userCreate.mutate({ name: "string" });
}

export async function signInAccount(user: {
  usernameOrEmail: string;
  password: string;
}) {
  try {
    const result = await trpc.login.query(user);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to login");
  }
}
