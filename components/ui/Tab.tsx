import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { ReactNode } from "react";

export default function Tab({
  href,
  className,
  disabled,
  children,
}: {
  href: string;
  className?: string;
  disabled?: boolean;
  children: ReactNode;
}) {
  return disabled ? (
    <div
      className={cn(
        "inline-flex h-9 items-center rounded-md border border-gray-200 px-4 py-2 text-sm font-medium shadow-sm transition-colors bg-gray-100 text-gray-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 cursor-not-allowed opacity-80 whitespace-nowrap",
        className
      )}
    >
      {children}
    </div>
  ) : (
    <Link
      className={cn(
        "inline-flex h-9 items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 whitespace-nowrap",
        className
      )}
      href={href}
    >
      {children}
    </Link>
  );
}
