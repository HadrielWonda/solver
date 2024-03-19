import React, { ReactNode } from "react";

export function MathBlock({ children }: { children: ReactNode }) {
  return (
    <math className="my-4 mx-4">
      <mtable>{children}</mtable>
    </math>
  );
}

export function MathRow({ children }: { children: ReactNode }) {
  return <mtr>{children}</mtr>;
}
export function MathData({ children }: { children: ReactNode }) {
  return <mtd>{children}</mtd>;
}
