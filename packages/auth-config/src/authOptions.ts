import { NextAuthOptions } from "next-auth";
import { encode } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Contact",

      credentials: {
        contact: { label: "Mobile", type: "text", placeholder: "98********" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        console.log(credentials);
        if (!credentials?.contact || !credentials?.password) return null;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signin`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          }
        );
        console.log("Response", response);
        if (!response.ok) return null;
        const user = await response.json();
        return user;
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async ({ token, user }: any) => {
      if (user) {
        token.id = user?.id;
        token.role = user?.role;
      }

      return token;
    },
    session: async ({ token, session }: any) => {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }

      return session;
    },
  },
};
