import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { cn } from "cn";
import ApiQueryProvider from "@/api/query-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "HelpDesk",
    template: "%s – HelpDesk",
  },
  description: "Support-Anfragen erfassen, verfolgen und beantworten.",
};

const RootLayout = ({ children }: LayoutProps<"/">) => (
  <html
    lang="de-AT"
    className={cn(inter.variable, geistMono.variable, "h-full antialiased")}
  >
    <body className="flex min-h-full flex-col">
      <ApiQueryProvider>{children}</ApiQueryProvider>
      <Toaster position="bottom-right" />
    </body>
  </html>
);

export default RootLayout;
