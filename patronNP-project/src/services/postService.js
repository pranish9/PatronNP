import apiClient from "./apiClient";

export const postService = {
  createPost: (post) => apiClient.post("/creator/posts", post),

  updatePost: (id, post) => apiClient.put(`/creator/posts/${id}`, post),

  getPost: (id) => apiClient.get(`/creator/posts/${id}`),

  listPosts: (status = "PUBLISHED") =>
    apiClient.get("/creator/posts", { params: { status } }),

  deletePost: (id) => apiClient.delete(`/creator/posts/${id}`),

  getPublicPosts: (username, filter = "all") =>
    apiClient.get(`/creators/${username}/posts`, { params: { filter } }),

  getPublicPost: (username, id) =>
    apiClient.get(`/creators/${username}/posts/${id}`),

  toggleLike: (id) => apiClient.post(`/posts/${id}/like`),

  listComments: (id) => apiClient.get(`/posts/${id}/comments`),

  addComment: (id, text) => apiClient.post(`/posts/${id}/comments`, { text }),
};

export default postService;
