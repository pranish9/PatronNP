import apiClient from "./apiClient";

// Uploads through the backend (which holds the real Cloudinary credentials) instead of
// talking to Cloudinary directly from the browser — there's no unsigned upload preset
// configured, only a signed API key/secret, which must stay server-side.
export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await apiClient.post("/creator/media/upload-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.url;
};

export const uploadAudioToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await apiClient.post("/creator/media/upload-audio", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.url;
};
