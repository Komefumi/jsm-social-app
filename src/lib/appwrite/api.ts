import { ID, Query, Models } from "appwrite";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import {
  INewPost,
  INewUser,
  IPostDocument,
  ISaveDocument,
  IUserDocument,
} from "../types";

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

    const document = currentUser?.documents?.[0];
    if (!document) {
      throw new Error("No current user found");
    }

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
  const posts: Models.DocumentList<IPostDocument> =
    await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.postsCollectionID,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );

  if (!posts) throw Error;

  return posts;
}

/**
 * This is meant for retrieval single save item. However, the database could have duplicates.
 * A save is represented by a connected post, and user.
 * This returns a list of such matches, and the below deleteSingularSaves is meant to clean up duplicates
 * during unsaving
 */
export async function getSingularSaves(userID: string, postID: string) {
  const saves: Models.DocumentList<ISaveDocument> =
    await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.savesCollectionID,
      [Query.equal("user", userID), Query.equal("post", postID)]
    );

  if (!saves) throw Error;

  return saves;
}

export async function updateSaves(userID: string, saves: ISaveDocument[]) {
  try {
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.usersCollectionID,
      userID,
      {
        save: saves,
      }
    );
    if (!updatedUser) throw Error;
    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}

export async function likePost(postID: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.postsCollectionID,
      postID,
      {
        likes: likesArray,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function savePost(postID: string, userID: string) {
  const payloadForSave = {
    user: userID,
    post: postID,
  };
  console.log({ payloadForSave });
  try {
    const savedPost = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.savesCollectionID,
      ID.unique(),
      payloadForSave
    );

    if (!savedPost) throw Error;

    return savedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteSaveForUser(userID: string, postID: string) {
  try {
    const saves = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.savesCollectionID,
      [Query.equal("user", userID)]
    );

    const updatedUser: IUserDocument = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.usersCollectionID,
      userID,
      {
        saves: (saves.documents as ISaveDocument[]).filter((item) => {
          if (!item.post || item.post.$id === postID) return false;
          return true;
        }),
      }
    );

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteSavedPost(savedRecordID: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseID,
      appwriteConfig.savesCollectionID,
      savedRecordID
    );

    if (!statusCode) throw Error;

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}
