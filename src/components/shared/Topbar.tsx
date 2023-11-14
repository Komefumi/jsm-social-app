import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queries-and-mutations";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/state";

export default () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const {
    mutateAsync: signOut,
    isSuccess,
    isPending: isLoggingOut,
  } = useSignOutAccount();

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [isSuccess]);

  return (
    <section className="topbar">
      <div className="grow flex-between py-4 px-5">
        <Link className="flex gap-3 items-center" to="/">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={130}
            height={325}
          />
        </Link>
        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="shad-button__ghost"
            onClick={() => {
              signOut();
            }}
            disabled={isLoggingOut}
          >
            <img src="/assets/icons/logout.svg" alt="" />
          </Button>
          <Link to={`/profile/${user.id}`} className="flex-center gap-3">
            <img
              src={user.imageURL || "/assets/images/profile/placeholder.svg"}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
        {/* <div className="flex gap-4">
          <Button>
            <img src="" alt="" />
          </Button>
        </div> */}
      </div>
    </section>
  );
};
