import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const PublicCreatorLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default PublicCreatorLayout;