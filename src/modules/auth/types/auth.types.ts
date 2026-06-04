import { DefaultSession } from 'next-auth';

export type UserRole = 'ADMIN' | 'FARMER';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession['user'];
  }

  interface User {
    role: UserRole;
  }
}
