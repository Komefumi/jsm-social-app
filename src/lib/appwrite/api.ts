import { ID } from "appwrite";
import { account, appwriteConfig, avatars, databases } from "./config";
import { INewUser } from "../types";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw new Error("Failed to create new account");

    const avatarURL = avatars.getInitials(user.name);
    const newUser = await saveUserToDB({
      id: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageURL: avatarURL,
    });
    return newUser;
  } catch (error) {
    console.error("Error in account creation");
    console.error(error);
    throw error;
  }
}

export async function saveUserToDB(user: {
  id: string;
  email: string;
  name: string;
  imageURL: URL;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.usersCollectionID,
      ID.unique(),
      user
    );
    return newUser;
  } catch (error) {
    console.error("Error in saving user to DB");
    console.error(error);
    throw error;
  }
}
