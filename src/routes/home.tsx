import { useEffect } from "react";
import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { useGetTimeline } from "@/lib/react-query/queries-and-mutations";
import { useAuthStore } from "@/lib/state";
import { BackendReturnedPost } from "@/lib/types";

export default () => {
  const { token } = useAuthStore();
  console.log({ token });
  const {
    data: posts,
    isPending: isLoadingPosts,
    refetch,
  } = useGetTimeline({
    token: token || "",
  });

  useEffect(() => {
    console.log("refetching");
    refetch();
  }, [token]);

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isLoadingPosts && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {(posts || []).map((post) => (
                <PostCard
                  key={post.id}
                  post={post as unknown as BackendReturnedPost}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
