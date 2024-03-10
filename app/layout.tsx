import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "math-field": React.DetailedHTMLProps<
        React.HTMLAttributes<MathMLElement>,
        MathMLElement
      >;
    }
  }
  interface Window {
    mathVirtualKeyboard: any;
  }
}

export const metadata: Metadata = {
  title: "Solver App",
  description: "Engineering numerical solver app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          defer
          src="//cdnjs.cloudflare.com/ajax/libs/mathjs/1.5.2/math.min.js"
        ></script>
        <script defer src="//unpkg.com/mathlive"></script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
