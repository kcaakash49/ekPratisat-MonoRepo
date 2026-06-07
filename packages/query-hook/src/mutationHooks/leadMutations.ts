import { authenticatedFetch } from "@repo/shared-provider";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateLead = () => {
  return useMutation({
    mutationFn: async ({ formData }: { formData: FormData }) => {
      return authenticatedFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/lead/add`,
        {
          method: "POST",
          body: formData,
        },
      );
    },
    onError: (error) => {
      toast.error(error.message || "Couldn't add Lead!!!");
    },
  });
};
