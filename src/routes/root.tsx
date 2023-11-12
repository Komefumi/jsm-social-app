import { Outlet } from "react-router-dom";
// import { Toaster } from "@/components/ui/toaster";
// import AuthContextProvider from "@/lib/context/AuthContext";

export default function Root() {
  return (
    // <AuthContextProvider>
    <div className="flex h-screen">
      <Outlet />
    </div>
    // </AuthContextProvider>
  );
}
