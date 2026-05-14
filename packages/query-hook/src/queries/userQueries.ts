import { getAgentDetailAction, getAgentListAction } from "@repo/actions";
import { authenticatedFetch } from "@repo/shared-provider";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";


export interface UserProps{
  id:string;
  name:string;
  role:string;
  profileImageUrl: string | null;
}

export type User = UserProps | null;
type UserQueryResult = UseQueryResult<User, Error> & { data: User };

interface UserQueryType {
  page?:number,
  pageSize?:number;
  isVerified?:string;
  q?:string;
  role?:string;
  isActive?:string;
}

export const useGetAgents = (options = {}) => {
  return useQuery({
    queryKey: ["agents-list"],
    queryFn: getAgentListAction,
    retry: 1,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    ...options,
  });
};

export const useGetAgentDetail = (id: string) => {
  return useQuery({
    queryKey: ["agent-detail", id],
    queryFn: async () => {
      const res = await getAgentDetailAction(id);
      if (res.status === 200) {
        return res;
      }
    },
    retry: 1,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};

export const useUser = (initialData?: User): UserQueryResult => {
  const hasInitialData = initialData !== undefined;

  const query = useQuery<User, Error>({
    queryKey: ["user-info"],
    queryFn: async (): Promise<User> => {
      console.log("Fetching user info...");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/my-info`,
        { credentials: "include" },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to fetch info");
      }

      return data.user;
    },
    retry: 1,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    ...(hasInitialData
      ? {
          initialData,
          initialDataUpdatedAt: 0,
        }
      : {}),
  });

  return query as UserQueryResult;
};


export const useCheckFavourite = ({propertyId,user}: {propertyId:string, user:User}) => {
  return useQuery({
    queryKey: ["favourite", user?.id],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/listing/check-favourite`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
          },
        body:JSON.stringify({propertyId,userId: user?.id})
      });
      const data = await res.json();
      return data.result;
    },
    enabled: !!user && !!propertyId,
    staleTime:5 * 60 * 1000
  })
}


//get staff,agent and client list
export const useGetAllUsers = ({ page = 1, q = "", pageSize = 20, isVerified = "", role = "", isActive="" }: UserQueryType) => {
  return useQuery({
    queryKey: ["all-users", { page, role, isVerified, q, pageSize,isActive }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        ...(q && { q }),
        ...(role && { role }),
        ...(isVerified !== "" && { isVerified: String(isVerified) }),
        ...(isActive !== "" && { isActive: String(isActive) }),
      });

      return authenticatedFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/get-all?${params.toString()}`, 
        { method: "GET" }
      );
    },
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
};
