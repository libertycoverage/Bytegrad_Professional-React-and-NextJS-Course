import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Container from "@/components/container";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Evento - Find events around you",
  description: "Browse more than 10,000 events worldwide",
};

// V206
// If we only have this Metadata for the whole app this will be the same title for all pages, and description as well.
// However you can also export this constant `metadata` from page.tsx file and you can customize that for the one page.
// In this project however we will use one metadata, only form layout, this will be globally for the whole project.
//
// Metadata is a type we get from Next.js. Why do we have that type? To prevent us from doing something silly
// e.g. adding a key that does not exist (key is `title`, `description` etc.).
// TypeScript does not only prevent form making mistakes it also gives intellisense,
// if we do (option/ alt + escape on Mac OR ctrl + spacebar on Windows) we can see all the keys that we are able to add here in Metadata
// e.g. `robots`, `referer`, `opengraph`.
//
// To set custom `favicon.ico`, favicon has to be the exact name `favicon.ico`, Next.js will pick up that name.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // We use class from Tailwind CSS for background color
    <html lang="en">
      <body
        className={`${inter.className} bg-gray-950 text-white overflow-y-scroll`}
      >
        <Container>
          <Header />
          {children}
          <Footer />
        </Container>
      </body>
    </html>
  );
}

// Previously when we wanted to style something we had to give it a className and put that in a separate CSS file, but here we can do it directly together with the component

// These CSS classes will be inherited by the components within `<body>` tag, so Header and Footer and all the rest that will be there yet,
// that is why we are setting in layout.tsx, because every page is a child `{children}` here, Header and Footer will have white text by default

// It is good to know that colors in Tailwind CSS have certain structure
// https://tailwindcss.com/docs/customizing-colors
