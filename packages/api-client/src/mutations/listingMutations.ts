
import { axiosInstance } from "../axios";


export const listingMutations = {
    createCategory : async (categoryData: FormData) => {
        const response = await axiosInstance.post("/listing/add-category", categoryData);
        return response.data;
    }
}