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
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const authUser = getAuthUser();
  const loggedIn = isAuthenticated();
  const isOwner =
    loggedIn &&
    authUser?.username?.toLowerCase() === username?.toLowerCase();

  useEffect(() => {
    if (!username) return;

    const fetchCreator = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        let data;
        try {
          const res = await userService.getCreatorPage(username);
          data = res.data;
        } catch {
          const res = await apiClient.get(`/creators/${username}`);
          data = res.data;
        }
        setCreator(data);
      } catch {
        setNotFound(true);
        setCreator(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCreator();
  }, [username]);

  return (
    <CreatorPageContext.Provider
      value={{ username, creator, loading, notFound, isOwner, loggedIn, authUser }}
    >
      {children}
    </CreatorPageContext.Provider>
  );
};

export const useCreatorPage = () => {
  const ctx = useContext(CreatorPageContext);
  if (!ctx) throw new Error("useCreatorPage must be used within CreatorPageProvider");
  return ctx;
};

export default CreatorPageContext;
