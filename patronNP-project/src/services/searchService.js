import apiClient from "./apiClient";

export const PAGE_SIZE = 8;

/**
 * Search creators from the backend, paginated.
 * @param {string} query
 * @param {number} page
 * @param {number} size
 * @returns {Promise<{content: Array, last: boolean, totalElements: number}>}
 */
export const searchCreators = async (query, page = 0, size = PAGE_SIZE) => {
  const { data } = await apiClient.get("/creators/search", {
    params: { query, page, size },
  });
  return data;
};

/**
 * Fetch creators ranked by supporter count, paginated.
 * @param {number} page
 * @param {number} size
 * @returns {Promise<{content: Array, last: boolean, totalElements: number}>}
 */
export const getTopCreators = async (page = 0, size = 10) => {
  const { data } = await apiClient.get("/creators/top", {
    params: { page, size },
  });
  return data;
};
