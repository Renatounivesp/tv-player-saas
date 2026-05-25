import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TV Player SaaS | TV Corporativa para Clínicas",
  description: "Transforme a sala de espera da sua clínica em uma experiência incrível. Gerencie slides, letreiros, tempo e muito mais em tempo real na sua TV.",
  openGraph: {
    title: 'TV Player SaaS | TV Corporativa para Clínicas',
    description: 'Transforme a sala de espera da sua clínica em uma experiência incrível. Gerencie slides, letreiros, tempo e muito mais em tempo real na sua TV.',
    url: 'https://tv-player-saas.vercel.app',
    siteName: 'TV Player SaaS',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=1200&h=630&fit=crop', // Imagem de clínica para o WhatsApp
        width: 1200,
        height: 630,
        alt: 'Painel da TV da Clínica',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TV Player SaaS | TV Corporativa',
    description: 'Gerencie o conteúdo da sua TV de recepção em tempo real.',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
