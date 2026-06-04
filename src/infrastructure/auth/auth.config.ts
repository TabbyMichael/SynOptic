import NextAuth from 'next-auth';
import { db } from '../database/db.service';
import { users } from '../database/schema';
import { eq } from 'drizzle-orm';
import { logger } from '../logger/logger.service';

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [], // Add providers like Google, GitHub, or Credentials here
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        
        // Fetch role from DB if not in token
        const [dbUser] = await db.select().from(users).where(eq(users.id, token.sub));
        if (dbUser) {
          session.user.role = dbUser.role;
        }
      }
      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
});
