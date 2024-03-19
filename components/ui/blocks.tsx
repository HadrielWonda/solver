import React, { ReactNode } from "react";

export function Parargraph({ children }: { children: ReactNode }) {
  return (
    <p className="text-gray-500 md:text-lg/relaxed dark:text-gray-400">
      {children}
    </p>
  );
}
