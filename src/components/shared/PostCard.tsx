import { useAuthStore } from "@/lib/state";
import { formatForTimeAgo } from "@/lib/utils";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { BackendReturnedPost } from "@/lib/types";

interface Props {
  post: BackendReturnedPost;
}

export default ({ post }: Props) => {
  const { user } = useAuthStore();

  console.log(post);

  const author = post.Author;

  if (!author) return;

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${author.id}`}>
            <img
              className="rounded-full w-12 lg:h-12"
              src={author.imageURL || "/assets/icons/profile-placeholder.svg"}
              alt="Creator"
            />
          </Link>
          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {author.name}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {formatForTimeAgo(post.createdAt.toString())}
              </p>
              -
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>

        <Link
          className={clsx(user.id !== author.id + "" && "hidden")}
          to={`/update-post/${post.id}`}
        >
          <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
        </Link>
      </div>
      <Link to={`/posts/${post.id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          {/*<ul className="flex gap-1 mt-2">
            {post.tags.map((tag: string) => (
              <li className="text-light-3" key={tag}>
                #{tag}
              </li>
            ))}
            </ul>*/}
        </div>
        <img
          className="post-card--img"
          src={post.imageURL || "/assets/icons/profile-placeholder.svg"}
          alt="post image"
        />
      </Link>
      {/* <PostStats post={post} userID={user.id} /> */}
    </div>
  );
};
