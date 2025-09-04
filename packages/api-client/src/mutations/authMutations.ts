import { UserSigninSchema } from "@repo/validators";
import { axiosInstance } from "../axios";

export const authMutations = {
    createUser: async (credentials: UserSigninSchema) => {
        
        const response = await axiosInstance.post("auth/signup", credentials);
        return response.data;
    }
}