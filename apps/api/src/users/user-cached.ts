export interface UserCached {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  companies: {
    activeAt: Date | null;
    company: {
      id: number;
      name: string;
      cnpj: string;
    };
  }[];
}
