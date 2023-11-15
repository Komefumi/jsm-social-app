import { ID, Query, Models } from "appwrite";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { INewPost, INewUser, IUserDocument } from "../types";

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

export async function signOutAccount() {
  try {
    const emailSession = await account.deleteSession("current");
    return emailSession;
  } catch (error) {
    console.error(error);
  }
}

export async function createPost(post: INewPost) {
  try {
    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    // Get file url
    const fileURL = getFilePreview(uploadedFile.$id);
    if (!fileURL) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const newPost = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.postsCollectionID,
      ID.unique(),
      {
        creator: post.userID,
        caption: post.caption,
        imageURL: fileURL,
        imageID: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

// ============================== UPLOAD FILE
export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageID,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET FILE URL
export function getFilePreview(fileId: string) {
  try {
    const fileURL = storage.getFilePreview(
      appwriteConfig.storageID,
      fileId,
      2000,
      2000,
      "top",
      100
    );

    if (!fileURL) throw Error;

    return fileURL;
  } catch (error) {
    console.log(error);
  }
}

// ============================== DELETE FILE
export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageID, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getRecentPosts() {
  const posts = await databases.listDocuments(
    appwriteConfig.databaseID,
    appwriteConfig.postsCollectionID,
    [Query.orderDesc("$createdAt"), Query.limit(20)]
  );

  if (!posts) throw Error;

  return posts;
}
