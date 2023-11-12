import AuthHOC from "@/components/hoc/AuthHOC";
import { Toaster } from "@/components/ui/toaster";
import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <AuthHOC>
      <div className="flex h-screen">
        <Outlet />
      </div>
      <Toaster />
    </AuthHOC>
  );
}
