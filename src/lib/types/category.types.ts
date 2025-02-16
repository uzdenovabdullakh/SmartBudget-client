export type Category = {
  id: string;
  name: string;
  assigned: number;
  activity: number;
  available: number;
};

export type CategoryGroup = {
  id: string;
  name: string;
  categories: Category[];
};
