
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

//add category hook
export const useCreateCategory = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/listing/add-category`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );
      const data = await res.json();
      if (!res.ok) {
        throw data;
      }

      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Couldn't add category!!!");
    },
  });
};

//add district hook
export const useCreateDistrict = () => {
  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/listing/add-district`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        throw data;
      }
      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Couldn't add district!!!");
    },
  });
};

//add municipality hook
export const useCreateMunicipality = () => {
  return useMutation({
    mutationFn: async ({ name, parentId }: { name: string; parentId: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/listing/add-municipality`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, parentId }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        throw data;
      }
      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Couldn't add Municipality!!!");
    },
  });
};

//add ward
export const useCreateWard = () => {
  return useMutation({
    mutationFn: async ({ name, parentId }: { name: string; parentId: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/listing/add-ward`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, parentId }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        throw data;
      }
      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Couldn't add ward");
    },
  });
};

//add property
export const useCreateProperty = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/listing/add-property`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );
      const data = await res.json();
      if (!res.ok) {
        throw data;
      }
      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Couldn't add property!!!");
    },
  });
};
