import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Navbar from "@/components/Navbar";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Charla — Your AI companion from campus to career",
  description: "AI-powered voice companions and career tools for students and early professionals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#d4a853",
          colorBackground: "#0e0e10",
          colorText: "#f0eff0",
          colorTextSecondary: "#a09fa8",
          colorInputBackground: "#1c1b19",
          colorInputText: "#f0eff0",
        },
      }}
    >
      <html lang="en" className="dark" suppressHydrationWarning>
        <body className={`${bricolageGrotesque.variable} ${dmSans.variable} antialiased`}>
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}