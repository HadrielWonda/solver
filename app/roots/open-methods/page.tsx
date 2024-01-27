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
        <Link href="/roots/open-methods/bisection">
          Bisection / Bolzano’s method
        </Link>
      </li>
      <li>
        <Link href="/roots/open-methods/false-position">
          False Postion method
        </Link>
      </li>
      <li>
        <Link href="/roots/open-methods/modified-false-position">
          Modified False Postion method
        </Link>
      </li>
    </ul>
  );
}
