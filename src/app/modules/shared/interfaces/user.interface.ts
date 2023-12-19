export interface User {
  id?: string;
  rol: UserRole;
  name: string;
  surname: string;
  email: string;
  password: string;
  state: boolean;
  avatar?: string;
  phone?: string;
  birthday?: string;
  profession?: string;
  description?: string;
}

export enum UserRole {
  client = 'client',
  admin = 'admin',
}
