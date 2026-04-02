import { createGeoZoneAction } from "@repo/actions"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"


export const useCreateZoneMutation = () => {
    return useMutation({
        mutationFn: async (formData:any) => {
            const result = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/zone/create`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await result.json();
            if (!result.ok) {
                throw data;
            }
            return data;
        },
        onError: (error) => {
            toast.error(error.message || "Couldn't create zone!!!")
        }
    })
}