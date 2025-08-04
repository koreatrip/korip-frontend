export type TUserProfile = {
  name: string;
  email: string;
  phone: string;
  interests: string[];
  profileImage?: string;
  joinDate: string;
  stats: {
    travelPlans: number;
    favorites: number;
    visitedPlaces: number;
  };
};
