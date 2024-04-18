import type { Metadata } from "next";
import Orbitron from "next/font/local";
import "./globals.css";
import "./cyberpunk-2077.css";

const orbitron = Orbitron({ 
  src:[
    {path: './fonts/Orbitron-Regular.ttf',weight: '400',},
    {path: './fonts/Orbitron-Bold.ttf', weight: '700',}
  ]
});


export const metadata: Metadata = {
  title: "TERMINAL 418",
  description: "AUTHORIZED USERS ONLY",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={orbitron.className}>{children}</body>
    </html>
  );
}
