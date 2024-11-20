import type { Metadata } from "next";
import { Poppins } from 'next/font/google';
import "./globals.css";

// Changing the fonts here
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins'
})

// Changing the Metadata here
export const metadata: Metadata = {
  title: "Tee Drive",
  description: "One an Only Drive Storage for You",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} font-poppins antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
