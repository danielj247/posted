import type { Company } from "@/types/company";
import type { Address } from "@/types/location";

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address?: Address;
  phone?: string;
  website?: string;
  company?: Company;
  photo?: string;
}
