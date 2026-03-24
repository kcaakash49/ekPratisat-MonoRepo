import { editBasicInfoAction, verifyAgentAction } from "@repo/actions"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export const useVerifyAgent = () => {
    return useMutation({
        mutationFn: async (userId: string) => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-agent`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId })
            });
            const data = await res.json();

            if (!res.ok) {
                throw data;
            }
            return data;
        },
        onError: (error) => {
            console.log(error);
            toast.error(error.message || "Unexpected Error")
        }
    })
}

export const useEditBasicInfo = () => {
    return useMutation({
        mutationFn: editBasicInfoAction,
        onError: (error) => {
            toast.error(error.message || "Unexpected Error")
        }
    })
}