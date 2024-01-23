import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      <ul>
        <li>
          <Link href="/roots">Roots of Equations</Link>
        </li>
        <li>
          <Link href="/sys-of-linear-equations">
            Systems of Simultaneous Linear Algebraic Equations
          </Link>
        </li>
        <li>
          <Link href="/optimization">Optimization</Link>
        </li>
        <li>
          <Link href="/curve-fitting">Curve Fitting</Link>
        </li>
        <li>
          <Link href="/integration">Numerical Integration</Link>
        </li>

        <li>
          <Link href="/ode">Ordinary Differential Equations</Link>
        </li>
        <li>
          <Link href="/pde">Partial Differential Equations</Link>
        </li>
      </ul>
    </main>
  );
}
