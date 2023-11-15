import { formatForTimeAgo } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";

interface Props {
  post: Models.Document;
}

export default ({ post }: Props) => {
  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              className="rounded-full w-12 lg:h-12"
              src={
                post?.creator?.imageURL ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="Creator"
            />
          </Link>
          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.creator?.name}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {formatForTimeAgo(post.$createdAt)}
              </p>
              -
              <p className="subtle-semibold lg:small-regular">
                {post?.location}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
