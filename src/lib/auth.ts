import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import SpotifyProvider from "next-auth/providers/spotify";
import { supabaseAdmin } from "./supabase";
import { DISCORD_WHITELIST, SPOTIFY_SCOPES } from "./constants";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: { params: { scope: SPOTIFY_SCOPES } },
    }),
  ],

  callbacks: {
    async signIn({ account }) {
      // Seule vérification de whitelist : au moment du sign-in Discord
      if (account?.provider === "discord") {
        const allowed = (DISCORD_WHITELIST as readonly string[]).includes(
          account.providerAccountId
        );
        if (!allowed) return "/login?error=unauthorized";
      }
      return true;
    },

    async jwt({ token, account }) {
      // On stocke le token Spotify dans le JWT pour les appels API côté client
      if (account?.provider === "spotify") {
        token.spotifyAccessToken = account.access_token;
        token.spotifyRefreshToken = account.refresh_token;
        token.spotifyExpiresAt = account.expires_at;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.sub!;
      if (token.spotifyAccessToken) {
        session.user.spotifyAccessToken = token.spotifyAccessToken as string;
      }
      return session;
    },
  },

  // On gère la persistance manuellement dans les controllers
  // pour rester dans le pattern MVC et éviter la magie de l'adapter
  session: { strategy: "jwt" },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
