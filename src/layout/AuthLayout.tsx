import { Outlet } from "react-router-dom";

export default () => {
  return (
    <div>
      <h2>Auth Layout</h2>
      <div>
        <Outlet />
      </div>
    </div>
  );
};
