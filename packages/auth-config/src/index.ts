import { NextAuthOptions } from "next-auth";
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

                  const response = await fetch (`${process.env.BACKEND_URL}/auth/signin`,{
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(credentials),
                  })

                  if (!response.ok) return null;
                  return response.json();
              },
        })
    ],
    session: { strategy: "jwt"},
    secret: process.env.NEXTAUTH_SECRET
}