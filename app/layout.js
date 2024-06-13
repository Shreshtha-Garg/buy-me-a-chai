import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SessionWrapper from "@/components/SessionWrapper";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Buy Me a Chai - Fund your projects</title>
        <meta name="description" content="This is a crowdfunding website for developers" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} bg-[#161a24] text-gray-200`}>
        <SessionWrapper>
          <Navbar />
          <div className="min-h-[calc(100vh-64px)] text-gray-200 pt-16">
            {children}
          </div>
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}
