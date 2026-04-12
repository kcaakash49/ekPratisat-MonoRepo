import { queryClient } from "./baseProvider";

export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {},
) => {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
  });
  const data = await response.json().catch(() => ({})); //data becomes empty object if response is not json

  if (response.status === 401) {
    // Clear the specific instance shared by the apps
    queryClient.clear();
    if (typeof window !== "undefined") {
      setTimeout(() => {
        window.location.href = "/auth/signin";
      }, 1500);
    }
    throw data || { message: "Session expired. Redirecting..." };
  }

  if (!response.ok) {
    // Throw the data if it exists, otherwise throw a generic error
    throw data || { message: `Request failed with status ${response.status}` };
  }

  return data;
};
