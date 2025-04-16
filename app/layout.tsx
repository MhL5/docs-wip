import Header from "@/app/_components/Header";
import Providers from "@/providers/Providers";
import "@/styles/globals.css";
import { Space_Grotesk, Space_Mono } from "next/font/google";

const sansFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const monoFont = Space_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  weight: ["400", "700"],
});

// export const metadata: Metadata = {
//   metadataBase: new URL("https://leerob.com"),
//   alternates: {s
//     canonical: "/",
//   },
//   title: {
//     default: "MhL",
//     template: "%s | MhL",
//   },
//   description: "Enthusiast Frontend developer",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sansFont.variable} ${monoFont.variable} tracking-wide antialiased`}
      >
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
