import apiClient from "./apiClient";

export const postService = {
  createPost: (post) => apiClient.post("/creator/posts", post),

  updatePost: (id, post) => apiClient.put(`/creator/posts/${id}`, post),

  getPost: (id) => apiClient.get(`/creator/posts/${id}`),

  listPosts: (status = "PUBLISHED") =>
    apiClient.get("/creator/posts", { params: { status } }),

  deletePost: (id) => apiClient.delete(`/creator/posts/${id}`),

  pinPost: (id) => apiClient.post(`/creator/posts/${id}/pin`),

  unpinPost: (id) => apiClient.post(`/creator/posts/${id}/unpin`),

  unpublishPost: (id) => apiClient.post(`/creator/posts/${id}/unpublish`),

  getPublicPosts: (username, filter = "all") =>
    apiClient.get(`/creators/${username}/posts`, { params: { filter } }),

  getPublicPost: (username, id) =>
    apiClient.get(`/creators/${username}/posts/${id}`),

  getFollowingFeed: (page = 0, size = 10) =>
    apiClient.get("/posts/feed/following", { params: { page, size } }),

  toggleLike: (id) => apiClient.post(`/posts/${id}/like`),

  listComments: (id) => apiClient.get(`/posts/${id}/comments`),

  addComment: (id, text) => apiClient.post(`/posts/${id}/comments`, { text }),

  votePoll: (id, optionIndex) => apiClient.post(`/posts/${id}/poll-vote`, { optionIndex }),

  // Creator-only CSV export — fetched as a blob (not a plain <a href>) so the request
  // still carries the Authorization header the endpoint requires.
  downloadPollResultsCsv: async (id) => {
    const res = await apiClient.get(`/creator/posts/${id}/poll-results.csv`, { responseType: "blob" });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = `poll-results-${id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },
};

export default postService;
