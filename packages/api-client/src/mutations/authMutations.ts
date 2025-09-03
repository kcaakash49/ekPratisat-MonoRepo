import { UserSigninSchema } from "@repo/validators";
import { axiosInstance } from "../axios";

export const authMutations = {
    createUser: async (creadentials: UserSigninSchema) => {
        console.log("create use called")
        // const response = await axiosInstance.post("auth/signup", creadentials);
        // return response.data;
    }
}