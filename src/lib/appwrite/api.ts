import { ID, Query, Models } from "appwrite";
import { account, appwriteConfig, avatars, databases } from "./config";
import { INewUser, IUserDocument } from "../types";

export async function deleteUser(id: string) {
  return databases.deleteDocument(
    appwriteConfig.databaseID,
    appwriteConfig.usersCollectionID,
    id
  );
}

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
      accountID: newAccount.$id,
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
  accountID: string;
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
      { ...user }
    );
    return newUser;
  } catch (error) {
    console.error("Error in saving user to DB");
    console.error(error);
    throw error;
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const emailSession = await account.createEmailSession(
      user.email,
      user.password
    );
    return emailSession;
  } catch (error) {
    console.error(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    console.log("logging currentAccount");
    console.log(JSON.stringify(currentAccount, null, 2));

    if (!currentAccount) throw new Error("Account Not Retrieved");

    const currentUser = await databases.listDocuments<Models.Document>(
      appwriteConfig.databaseID,
      appwriteConfig.usersCollectionID,
      [Query.equal("accountID", currentAccount.$id)]
    );

    console.log("logging currentUser");
    console.log(JSON.stringify(currentUser, null, 2));
    const document = currentUser?.documents?.[0];
    if (!document) {
      throw new Error("No current user found");
    }
    console.log("logging document");
    console.log(JSON.stringify(document, null, 2));

    return document as IUserDocument;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
