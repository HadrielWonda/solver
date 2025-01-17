import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Script from "next/script";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "math-field": React.DetailedHTMLProps<
        React.HTMLAttributes<MathMLElement>,
        MathMLElement
      >;
      math: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      mfrac: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      mn: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      mi: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      mo: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      msub: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      msup: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      mtext: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      mrow: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      mtd: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      mtr: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      mspace: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      mtable: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      msqrt: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      ms: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      msubsup: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
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
        {/* <script
          defer
          src="//cdnjs.cloudflare.com/ajax/libs/mathjs/1.5.2/math.min.js"
        ></script> */}
        <script defer src="//unpkg.com/mathlive"></script>
      </head>
      <body className={inter.className}>
        <TooltipProvider>
          {children}
          <Toaster richColors />
        </TooltipProvider>
      </body>
      <Script src="//cdnjs.cloudflare.com/ajax/libs/mathjs/1.5.2/math.min.js" />
      <Script src="//unpkg.com/mathlive" />
    </html>
  );
}
