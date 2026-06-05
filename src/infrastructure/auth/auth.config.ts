import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { userRepository } from '../../repositories/user.repository';
import { loginService } from '../../modules/auth/services/login.service';
import { logger } from '../logger/logger.service';
import { Role } from '@/lib/types';

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          const result = await loginService.login(
            { email: credentials.email as string, password: credentials.password as string },
            { deviceName: 'Web', browser: 'Browser', operatingSystem: 'OS', userAgent: 'next-auth', ipAddress: '127.0.0.1' }
          );
          return {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            role: result.user.role,
          };
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        // Handle Google user creation/linking
        const existingUser = await userRepository.findByEmail(user.email!);
        if (!existingUser) {
          await userRepository.create({
            email: user.email!,
            name: user.name!,
            role: 'FARMER',
          });
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = (token.role as Role) || 'FARMER';
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
});
