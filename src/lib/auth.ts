import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { supabaseAdmin } from "./supabase";
import { DISCORD_WHITELIST } from "./constants";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ account }) {
      if (account?.provider === "discord") {
        const allowed = (DISCORD_WHITELIST as readonly string[]).includes(
          account.providerAccountId
        );
        if (!allowed) return "/login?error=unauthorized";
      }
      return true;
    },

    async jwt({ token }) {
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.sub!;
      return session;
    },
  },

  session: { strategy: "jwt" },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
