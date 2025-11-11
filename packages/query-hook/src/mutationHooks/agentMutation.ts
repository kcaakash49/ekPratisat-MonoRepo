import { verifyAgentAction } from "@repo/actions"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export const useVerifyAgent = () => {
    return useMutation({
        mutationFn: verifyAgentAction,
        onError: (error) => {
            toast.error(error.message || "Unexpected Error")
        }
    })
}