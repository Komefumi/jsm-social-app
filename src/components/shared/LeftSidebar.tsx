import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queries-and-mutations";
import { useAuthStore } from "@/lib/state";
import { sidebarLinks } from "@/lib/constants";
import { INavLink } from "@/lib/types";
import clsx from "clsx";

export default () => {
  const { pathname } = useLocation();
  const { user } = useAuthStore();
  const { mutate: signOutAccount, isPending: isLoggingOut } =
    useSignOutAccount();
  return (
    <nav className="left-sidebar">
      <div className="flex flex-col gap-11">
        <Link to="/">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={170}
            height={36}
          />
        </Link>
        <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
          <img
            className="h-14 w-14 rounded-full"
            src={user.imageURL || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
          />
          <div className="flex flex-col">
            <p className="body-bold">{user.name}</p>
            <p className="small-regular text-light-3">@{user.username}</p>
          </div>
        </Link>
        <ul className="flex flex-col gap-6">
          {sidebarLinks.map(({ label, route, imgURL }: INavLink) => {
            const isActive = pathname === route;
            return (
              <li
                key={label}
                className={clsx(
                  "left-sidebar--link group",
                  isActive && "bg-primary-500"
                )}
              >
                <NavLink to={route} className="flex gap-4 items-center p-4">
                  <img
                    src={imgURL}
                    alt={label}
                    className={clsx(
                      "group-hover:invert-white",
                      isActive && "invert-white"
                    )}
                  />
                  {label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      <Button
        variant="ghost"
        className="shad-button__ghost"
        onClick={() => {
          signOutAccount();
        }}
        disabled={isLoggingOut}
      >
        <img src="/assets/icons/logout.svg" alt="" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
};
