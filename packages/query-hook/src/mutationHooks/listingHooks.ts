import { addCategoryAction, addDistrictAction, addMunicipalityAction, addWardAction, createListingAction } from "@repo/actions"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

//add category hook
export const useCreateCategory = () => {
    return useMutation({
        mutationFn: addCategoryAction,
        onError: (error) => {
            toast.error(error.message || "Couldn't add category!!!")
        }
    })
}

//add district hook
export const useCreateDistrict = () => {
    return useMutation({
        mutationFn: addDistrictAction,
        onError: (error) => {
            toast.error(error.message || "Couldn't add district!!!")
        }
    })
}

//add municipality hook
export const useCreateMunicipality = () => {
    return useMutation({
        mutationFn: addMunicipalityAction,
        onError: (error) => {
            toast.error(error.message || "Couldn't add Municipality!!!")
        }
    })
}

//add ward
export const useCreateWard = () => {
    return useMutation({
        mutationFn: addWardAction,
        onError: (error) => {
            toast.error(error.message || "Couldn't add ward")
        }
    })
}

//add property
export const useCreateProperty = () => {
    return useMutation({
        mutationFn: createListingAction,
        onError: (error) => {
            toast.error(error.message || "Couldn't add property!!!")
        }
    })
}