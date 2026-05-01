import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginService } from "@/features/auth/lib/services/auth.service";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
    };
    token?: string;
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    token?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    token?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing username or password");
        }

        try {
          // Call your existing login service
          const response = await loginService({
            username: credentials.username,
            password: credentials.password,
          });

          // response format: { status: true, payload: { user: { id, username, ... }, token: "..." } }
          const payload = response?.payload;

          if (payload && payload.user && payload.token) {
            return {
              id: payload.user.id,
              name: payload.user.username,
              email: payload.user.email,
              role: payload.user.role,
              token: payload.token,
              firstName: payload.user.firstName,
              lastName: payload.user.lastName,
              phone: payload.user.phone,
            };
          }
          throw new Error("Invalid credentials");
        } catch (error: any) {
          throw new Error(error.response?.data?.message || "Invalid credentials");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        token.firstName = session.user?.firstName || token.firstName;
        token.lastName = session.user?.lastName || token.lastName;
        token.phone = session.user?.phone || token.phone;
        token.email = session.user?.email || token.email;
        if (session.user?.profilePhoto) {
          token.image = session.user.profilePhoto;
        }
      }
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.token = user.token; // Save backend token to NextAuth JWT
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.phone = user.phone;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.token = token.token as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.phone = token.phone as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },
  secret: process.env.NEXTAUTH_SECRET || "super-secret-key-for-dev",
};
