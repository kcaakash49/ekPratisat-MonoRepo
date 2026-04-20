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
  secondContact: string | null;
  isActive:boolean;
  isVerified: boolean;
  createdAt: Date;
  createdBy : {
    id: string;
    name: string;
  } | null;
}

export interface AgentDetailType extends AgentType{
  profileImageUrl: string | null;
  email: string;
  documents: {
    id: string;
    isVerified: boolean;
    url: string;
    type: string;
  }[];
}


export interface PropertyListing {
  id: string;
  title: string;
  price: string;
  type: string;
  noOfBedRooms: string | null;
  noOfFloors: string | null;
  noOfRestRooms: string | null;
  isFeatured: boolean;
  landArea: string | null;
  floorArea: string | null;
  tole: string;
  category: {
    name: string;
  };
  images: {
    url: string;
  }[];
  createdAt: Date | string;
}


type SaleType = "rent" | "sale";
interface ImageType{
  id : string;
  url: string;
}

export interface PropertyFormdata{
  title: string;
  description: string;
  type: SaleType;
  categoryId: string;
  districtId: string;
  municipalityId: string;
  locationId: string;
  price: string;
  tole: string;

  lat: number | null;
  lng: number | null;

  noOfBedRooms?: string;
  noOfRestRooms?: string;
  landArea?: string;
  noOfFloors?: string;
  propertyAge?: string;
  facingDirection?: string;
  floorArea?: string;
  roadSize?: string;
  floorLevel?: string;
  images: ImageType[];
  verified?: boolean;
};