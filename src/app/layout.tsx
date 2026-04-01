import type { Metadata } from "next";
import { Lora, M_PLUS_Rounded_1c } from "next/font/google";
import { SessionProvider } from "@/views/providers/SessionProvider";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const mPlusRounded = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-rounded",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Médecinetopia 🌿",
  description: "L'espace de révision de Jade",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${lora.variable} ${mPlusRounded.variable}`}>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
