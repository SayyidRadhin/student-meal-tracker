import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GlobalContextProvider from "./contexts/globalContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Student meal tracker",
  description: "Track your missed meals",
  manifest:"/manifest.json",
  icons:{apple:"/icon512_maskable.png"},
  themeColor:"#fff"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <link rel='manifest' href='/manifest.json'/>

        <GlobalContextProvider>
        <body className={inter.className}>{children}</body>
        </GlobalContextProvider>
      
    </html>
  );
}
