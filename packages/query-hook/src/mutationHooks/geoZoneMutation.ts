import { createGeoZoneAction } from "@repo/actions"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"


export const useCreateZoneMutation = () => {
    return useMutation({
        mutationFn: createGeoZoneAction,
        onError: (error) => {
            toast.error(error.message || "Couldn't create zone!!!")
        }
    })
}