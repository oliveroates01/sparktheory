import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  title: "Spark Theory | Electrical Exam Practice & Revision",
  description:
    "Practice electrical exam questions with mock tests, flashcards and smart revision tools. Track weak topics and improve your pass chances with Spark Theory.",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "96x96", type: "image/x-icon" }],
  },
};

const buildSha = process.env.NEXT_PUBLIC_GIT_SHA || process.env.VERCEL_GIT_COMMIT_SHA || "dev";
const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME || "unknown";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-build-sha={buildSha} data-build-time={buildTime}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="96x96" />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-17999737501"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17999737501');
            `,
          }}
        />
        <Script
          id="ms-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "vo6b80y5yf");
            `,
          }}
        />
        <Script
          id="build-label"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `console.info("[build] sha=${buildSha} time=${buildTime}");`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
