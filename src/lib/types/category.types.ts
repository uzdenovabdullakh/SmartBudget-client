export type Category = {
  id: string;
  name: string;
  assigned: number;
  activity: number;
  available: number;
  order: number;
};

export type CategoryGroup = {
  id: string;
  name: string;
  order: number;
  categories: Category[];
};
