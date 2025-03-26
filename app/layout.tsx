import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { ModalProvider } from "@/components/providers/modal-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import { QueryProvider } from "@/components/providers/query-provider";

/**
 * This is the root layout of the whole application.
 * Providers (themes) are configured here.
 */
const font = Open_Sans( { subsets: ['latin'] })     //set global font here

export const metadata: Metadata = {
  title: "Team Chat Application",       //set title of page here:
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" 
      suppressHydrationWarning>
        {/**
         * Enable cn so that the font is encapsulated along with the theme color when the system is 
         * toggled between dark mode and light mode.
         * 
         */}
        <body
          className={cn(
            font.className,
            "bg-white dark:bg-[#313338]"
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="discord-theme"
          >
            <SocketProvider>
              <ModalProvider />
              <QueryProvider>
              {children}
              </QueryProvider>
            </SocketProvider>
          </ThemeProvider>

          

          
        </body>
      </html>
    </ClerkProvider>
  );
}
