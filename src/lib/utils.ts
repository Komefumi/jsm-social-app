import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { jwtDecode } from "jwt-decode";
import { ISaveDocument } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertFileToURL = (file: File) => URL.createObjectURL(file);

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", options);
  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${formattedDate} at ${time}`;
}

export function formatForTimeAgo(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  const timeDifference = now.valueOf() - date.valueOf();
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 1) {
    return `${days} days ago`;
  } else if (hours > 1) {
    return `${hours} hours ago`;
  } else if (minutes > 1) {
    return `${minutes} minutes ago`;
  } else {
    return `${seconds} seconds ago`;
  }
}

export function checkIsLiked(likeList: string[], userID: string) {
  return likeList.includes(userID);
}

export function checkIsSaved(saveList: ISaveDocument[], postID: string) {
  return !!saveList.find(({ post }) => post.$id === postID);
}

export function checkToken(token: string) {
  const data = jwtDecode(token);
  if (!data?.exp) return false;
  if (data.exp <= new Date().getTime() / 1000) return false;
  return true;
}

export function checkTokenAndSet(
  token: string,
  setter: (token: string) => void
) {
  if (checkToken(token)) {
    setter(token);
    return true;
  }

  return false;
}
