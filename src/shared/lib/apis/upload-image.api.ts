import apiClient from "./api-client";

export const uploadImageApi = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  return apiClient.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
