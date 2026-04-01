import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Toutes les routes sous /dashboard sont protégées
// Les routes /api/** sont protégées individuellement dans chaque handler
export const config = {
  matcher: ["/dashboard/:path*"],
};
