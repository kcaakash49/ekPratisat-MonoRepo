import { addCategoryAction } from "@repo/actions"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"


export const useCreateCategory = () => {
    return useMutation({
        mutationFn: addCategoryAction,
        onError: (error) => {
            toast.error(error.message || "Couldn't add category!!!")
        }
    })
}