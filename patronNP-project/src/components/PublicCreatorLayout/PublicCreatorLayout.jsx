import { Outlet, useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import CartBar from "./CartBar";
import { logoutUser } from "../../utils/auth";
import { CreatorPageProvider } from "../../context/CreatorPageContext";

const PublicCreatorLayout = () => {
  const { username: rawUsername } = useParams();
  const username = rawUsername?.replace(/^@/, "");
  const navigate = useNavigate();

  const handleLogout = () => logoutUser(navigate);

  return (
    <CreatorPageProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar username={username} onLogout={handleLogout} />
        <main className="flex-1">
          <Outlet />
        </main>
        <CartBar />
      </div>
    </CreatorPageProvider>
  );
};

export default PublicCreatorLayout;
