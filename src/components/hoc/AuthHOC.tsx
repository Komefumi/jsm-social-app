import { useAuthStore } from "@/lib/state";
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router";

interface Props {
  children: ReactNode;
}

export default ({ children }: Props) => {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  /*
  useEffect(() => {
    console.log("on mount for AuthHOC");
    const cookieFallback = localStorage.getItem("cookieFallback");
    if (["[]", null].includes(cookieFallback)) {
      console.log("navigating from AuthContext");
      navigate("/auth/sign-in");
      return;
    }
    checkAuthUser();
  }, []);
  */

  useEffect(() => {
    if (!token) {
      console.log("empty token: navigating to sign in");
      navigate("/auth/sign-in");
    } else {
      navigate("/");
    }
  }, [token]);

  return <>{children}</>;
};
