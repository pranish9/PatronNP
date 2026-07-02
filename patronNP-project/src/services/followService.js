import apiClient from "./apiClient";

export const getFollowStatus = async (username) => {
  const { data } = await apiClient.get(`/follow/${username}/status`);
  return data;
};

export const followCreator = async (username) => {
  await apiClient.post(`/follow/${username}`);
};

export const unfollowCreator = async (username) => {
  await apiClient.delete(`/follow/${username}`);
};

export const getFollowing = async (page = 0, size = 10) => {
  const { data } = await apiClient.get("/follow/following", {
    params: { page, size },
  });
  return data;
};

export const getFollowers = async (page = 0, size = 10) => {
  const { data } = await apiClient.get("/follow/followers", {
    params: { page, size },
  });
  return data;
};
