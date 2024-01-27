import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <ul>
      <li>
        <Link href="roots/bracketing-methods">Bracketing Methods</Link>
      </li>
      <li>
        <Link href="roots/open-methods">Open Methods</Link>
      </li>
    </ul>
  );
}
