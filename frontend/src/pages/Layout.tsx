import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="flex flex-col justify-between">
      <Outlet />
    </div>
  );
}