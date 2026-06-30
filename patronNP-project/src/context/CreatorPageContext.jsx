import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import userService from "../services/userService";
import apiClient from "../services/apiClient";
import { getAuthUser, isAuthenticated } from "../utils/auth";

const CreatorPageContext = createContext(null);

export const CreatorPageProvider = ({ children }) => {
  const { username: rawUsername } = useParams();
  const username = rawUsername?.replace(/^@/, "") || "";

  const [creator, setCreator] = useState(null);
  const [profileOverrides, setProfileOverrides] = useState({});
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const authUser = getAuthUser();
  const loggedIn = isAuthenticated();
  const isOwner =
    loggedIn &&
    authUser?.username?.toLowerCase() === username?.toLowerCase();

  const displayCreator = creator ? { ...creator, ...profileOverrides } : null;

  const updateProfileDisplay = (data) => {
    setProfileOverrides((prev) => ({ ...prev, ...data }));
  };

  async function fetchCreator(forUsername, silent) {
    if (!forUsername) return;
    if (!silent) setLoading(true);
    if (!silent) setNotFound(false);
    try {
      let data;
      try {
        const res = await userService.getCreatorPage(forUsername);
        data = res.data;
      } catch {
        const res = await apiClient.get(`/creators/${forUsername}`);
        data = res.data;
      }
      setCreator(data);
      setProfileOverrides({});
    } catch {
      if (!silent) {
        setNotFound(true);
        setCreator(null);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    fetchCreator(username, false);
  }, [username]);

  const refreshCreator = () => fetchCreator(username, true);

  return (
    <CreatorPageContext.Provider
      value={{
        username,
        creator,
        displayCreator,
        loading,
        notFound,
        isOwner,
        loggedIn,
        authUser,
        updateProfileDisplay,
        refreshCreator,
        supportModalOpen,
        setSupportModalOpen,
        editModalOpen,
        setEditModalOpen,
      }}
    >
      {children}
    </CreatorPageContext.Provider>
  );
};

export const useCreatorPage = () => {
  const ctx = useContext(CreatorPageContext);
  if (!ctx)
    throw new Error("useCreatorPage must be used within CreatorPageProvider");
  return ctx;
};

export default CreatorPageContext;
