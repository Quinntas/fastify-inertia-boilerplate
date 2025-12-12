import { User } from './userSchemas';

export interface HomeProps {
  name?: string;
  timestamp?: string;
}

export interface AboutProps {}

export interface ContactProps {
  errors?: Record<string, string>;
}

export interface UsersProps {
  users: User[];
  filters: {
    q?: string;
    role?: string;
  };
  meta: {
    total: number;
    page: number;
    lastPage: number;
    limit: number;
  };
}

export interface UserDetailProps {
  user: User;
}

export type InertiaPageMap = {
  Home: HomeProps;
  About: AboutProps;
  Contact: ContactProps;
  Users: UsersProps;
  UserDetail: UserDetailProps;
};

export type InertiaPage = keyof InertiaPageMap;
