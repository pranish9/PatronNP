import { Outlet, useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import CartBar from "./CartBar";
import CreatorFooter from "./CreatorFooter";
import SupportWidget from "./SupportWidget";
import EditPageModal from "./EditPageModal";
import { logoutUser } from "../../utils/auth";
import { CreatorPageProvider, useCreatorPage } from "../../context/CreatorPageContext";

const LayoutContent = () => {
  const { username: rawUsername } = useParams();
  const username = rawUsername?.replace(/^@/, "");
  const navigate = useNavigate();
  const {
    supportModalOpen,
    setSupportModalOpen,
    editModalOpen,
    setEditModalOpen,
  } = useCreatorPage();

  const handleLogout = () => logoutUser(navigate);

  return (
    <div className="min-h-screen bg-patron-gray-50 flex flex-col patron-container">
      <Navbar username={username} onLogout={handleLogout} />
      <main className="flex-1 w-full overflow-x-hidden">
        <Outlet />
      </main>
      <CartBar />
      <CreatorFooter />
      <SupportWidget
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
      />
      <EditPageModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
      />
    </div>
  );
};

const PublicCreatorLayout = () => (
  <CreatorPageProvider>
    <LayoutContent />
  </CreatorPageProvider>
);

export default PublicCreatorLayout;
