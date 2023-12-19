import { User } from 'src/app/modules/shared/interfaces';

export interface LoginResponse {
  token: string;
  user: User;
}
