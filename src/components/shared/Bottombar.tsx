import { Link, useLocation } from "react-router-dom";
import { bottombarLinks } from "@/lib/constants";
import { INavLink } from "@/lib/types";
import clsx from "clsx";

export default () => {
  const { pathname } = useLocation();
  return (
    <div className="bottom-bar">
      {bottombarLinks.map(({ label, route, imgURL }: INavLink) => {
        const isActive = pathname === route;
        return (
          <Link
            to={route}
            className={clsx(
              isActive && "bg-primary-500 rounded-[10px]",
              "flex-center flex-col gap-1 p-2 transition"
            )}
          >
            <img
              src={imgURL}
              alt={label}
              width={16}
              height={16}
              className={clsx(
                "group-hover:invert-white",
                isActive && "invert-white"
              )}
            />
            <p className="tiny-medium text-light-2">{label}</p>
          </Link>
        );
      })}
    </div>
  );
};
