import axios from "axios";
import { axiosInstance } from "../axios";

export const listingFunctions = {
  createCategory: async (categoryData: FormData) => {
    try {
      console.log("Category Data", categoryData);
      const response = await axiosInstance.post(
        "/listing/add-category",
        categoryData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Response", response);
      return response.data;
    } catch (error) {
        if(axios.isAxiosError(error)){
            console.log("status:", error.response?.status);
        }
    }
  },
};
