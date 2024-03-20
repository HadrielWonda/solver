import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

export function Parargraph({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-gray-500 md:text-lg/relaxed dark:text-gray-400",
        className
      )}
    >
      {children}
    </p>
  );
}
