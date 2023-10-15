import type { User } from "@/types/user";

export enum FilterSort {
  ASC = "ASC",
  DESC = "DESC",
}

export interface Filter {
  sort?: FilterSort;
  search?: string;
  user?: User;
}
