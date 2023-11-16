// import { useEffect, useState } from "react";
import {
  useGetCurrentUser,
  useGetSingularSaves,
  useLikePost,
  useSavePost,
  useDeleteSaveForUser,
} from "@/lib/react-query/queries-and-mutations";
import { Models } from "appwrite";
import { checkIsLiked, checkIsSaved } from "@/lib/utils";
import clsx from "clsx";
import { useToast } from "../ui/use-toast";

interface Props {
  post: Models.Document;
  userID: string;
}

export default ({ post, userID }: Props) => {
  const toaster = useToast();
  const likesList = post.likes.map((user: Models.Document) => user.$id);
  const { mutateAsync: likePost, isPending: isLikeOperationInProgress } =
    useLikePost();
  const { mutateAsync: savePost, isPending: isSavingPost } = useSavePost();
  const { mutateAsync: deleteSaveForUser, isPending: isDeletingSave } =
    useDeleteSaveForUser();
  const { data: currentUser } = useGetCurrentUser();
  const { data: singularSaves, isFetching: isFetchingSaves } =
    useGetSingularSaves(currentUser?.$id, post.$id);

  console.log({ singularSaves });

  const isSaveOperationInProgress = isSavingPost || isDeletingSave;

  const handleLikePost = async (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    if (!currentUser || isLikeOperationInProgress) return;

    const oldLikes = [...likesList];
    const hasLiked = oldLikes.includes(userID);
    const newLikes = hasLiked
      ? [...oldLikes.filter((id) => id !== userID)]
      : [...oldLikes, userID];

    try {
      await likePost({ postID: post.$id, likesArray: newLikes });
    } catch (error) {
      console.error(error);
      toaster.toast({
        title: `${
          hasLiked ? "Unlike" : "Like"
        } failed, please check your network or try again later`,
      });
    }
  };

  const handleSavePost = async (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (!currentUser || isFetchingSaves || isSaveOperationInProgress) return;

    const saveExists = !!singularSaves?.length;
    try {
      const postID = post.$id;
      const payloadForSave = { postID, userID };
      if (saveExists) {
        await deleteSaveForUser(payloadForSave);
      } else {
        await savePost(payloadForSave);
      }
    } catch (error) {
      console.error(error);
      toaster.toast({
        title: `${
          saveExists ? "Unsave" : "Save"
        } failed, please check your network or try again later`,
      });
    }
  };

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <img
          src={`/assets/icons/${
            checkIsLiked(likesList, userID) ? "liked" : "like"
          }.svg`}
          alt="like"
          width={20}
          height={20}
          onClick={(e) => {
            handleLikePost(e);
          }}
          className={clsx(isLikeOperationInProgress || "cursor-pointer")}
        />
        <p className="small-medium lg:base-medium">{likesList.length}</p>
      </div>
      <div className="flex gap-2">
        <img
          src={`/assets/icons/${
            checkIsSaved(singularSaves || [], post.$id) ? "saved" : "save"
            // "saved"
          }.svg`}
          alt="save"
          width={20}
          height={20}
          onClick={handleSavePost}
          className={clsx(isSaveOperationInProgress || "cursor-pointer")}
        />
      </div>
    </div>
  );
};
