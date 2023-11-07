import { Outlet } from "react-router-dom";

export default () => {
  return (
    <div>
      <h2>Auth Layout</h2>
      <section className="flex flex-1 justify-center items-center flex-col py-10">
        <Outlet />
      </section>
      <img src="/assets/side-img.svg" alt="Side Image" />
    </div>
  );
};
