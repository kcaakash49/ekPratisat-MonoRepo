import { addUserAction } from "@repo/actions"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner";

export const useCreateUser = () => {
    return useMutation({
        mutationFn: addUserAction,
        onSettled:(data) => {
            console.log(data);
            if(data?.status == 422){
                toast.error("Input Invalid");
            }
        }
        
    })
}