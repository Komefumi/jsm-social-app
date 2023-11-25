import { ReactNode, useState, useEffect } from "react";
import { useAuthStore } from "@/lib/state";
import { retrieveTokenFromStorageAndCheck } from "@/lib/utils";
import { useNavigate } from "react-router";

interface Props {
  children: ReactNode;
}

export default ({ children }: Props) => {
  const [tokenRetrievalDone, setTokenRetrievalDone] = useState(false);
  const navigate = useNavigate();
  const { token, setToken } = useAuthStore();

  useEffect(() => {
    retrieveTokenFromStorageAndCheck(setToken);
    setTokenRetrievalDone(true);
  }, []);

  useEffect(() => {
    if (!token && !tokenRetrievalDone) {
      return;
    }
    if (!token) {
      console.log("empty token: navigating to sign in");
      navigate("/auth/sign-in");
      return;
    }
    console.log("Token now in effect");
  }, [token, tokenRetrievalDone]);

  if (!tokenRetrievalDone && !token) return null;

  return <>{children}</>;
};
