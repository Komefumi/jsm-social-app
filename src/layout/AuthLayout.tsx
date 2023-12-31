import { Outlet } from "react-router-dom";

export default () => {
  return (
    <div className="flex">
      <section className="flex flex-1 justify-center items-center flex-col py-10">
        <Outlet />
      </section>
      <img
        className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
        src="/assets/images/side-img.svg"
        alt="logo"
      />
    </div>
  );
};
