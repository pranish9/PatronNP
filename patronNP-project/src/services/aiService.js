import apiClient from "./apiClient";

export const aiService = {
  improveText: (text) => apiClient.post("/creator/ai/improve-text", { text }),
};

export default aiService;
