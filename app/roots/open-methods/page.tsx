import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <ul>
      <li>
        <Link href="/roots/open-methods/simple-fixed-point">
          Simple Fixed-Point Iteration
        </Link>
      </li>
      <li>
        <Link href="/roots/open-methods/newton-raphson">
          Newton-Raphson method
        </Link>
      </li>
      <li>
        <Link href="/roots/open-methods/secant">Secant method</Link>
      </li>
      <li>
        <Link href="/roots/open-methods/modified-secant">
          Modified Secant method
        </Link>
      </li>
    </ul>
  );
}
