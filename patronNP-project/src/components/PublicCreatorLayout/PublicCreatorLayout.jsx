import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const PublicCreatorLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default PublicCreatorLayout;