import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
    title: "Pequena Elizabeth — Galeria de Memórias",
    description: "Um álbum de amor e memórias eternizadas.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" className="scroll-smooth">
            <body className={`${inter.variable} ${outfit.variable} font-sans bg-stone-50 text-stone-900 antialiased`}>
                {children}
            </body>
        </html>
    );
}
