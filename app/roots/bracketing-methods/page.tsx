import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <ul>
      <li>
        <Link href="/roots/bracketing-methods/2d-graph">2D Graph</Link>
      </li>
      <li>
        <Link href="/roots/bracketing-methods/bisection">
          Bisection / Bolzano’s method
        </Link>
      </li>
      <li>
        <Link href="/roots/bracketing-methods/false-position">
          False Postion method
        </Link>
      </li>
      <li>
        <Link href="/roots/bracketing-methods/modified-false-position">
          Modified False Postion method
        </Link>
      </li>
    </ul>
  );
}
