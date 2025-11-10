export type SessionUser = {
  id: string;
  role: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export type LocationSchema = {
  name: string;
  userId?: string;
  parentId?: string;
}

export interface AgentType {
  id: string;
  name: string;
  contact: string;
  isVerified: boolean
  createdBy : {
    id: string;
    name: string;
  } | null;
}

export interface AgentDetailType extends AgentType{
  profileImageUrl: string | null;
  email: string;
  document: {
    id: string;
    isVerified: boolean;
    url: string;
  }[];
}