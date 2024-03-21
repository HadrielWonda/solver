/* eslint-disable react/no-unescaped-entities */
import Tab from "@/components/ui/Tab";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="py-12">
        <div className="container flex flex-col items-center justify-center max-w-5xl px-4 space-y-4 text-center md:space-y-8 md:px-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Numerical Methods
            </h1>
            <p className="mx-auto max-w-2xl text-gray-500 md:text-xl/relaxed dark:text-gray-400">
              Learn about different numerical methods used to solve various
              mathematical problems.
            </p>
          </div>
          <div>
            <div className="w-full mb-12">
              <h4 className="bold font-bold my-2 text-left">Graphs</h4>
              <div className="grid w-full grid-cols-2 items-start justify-center gap-4 md:grid-cols-4">
                <Tab href="/2d-graph">2D Graph Plotter</Tab>
                <Tab href="#" disabled>
                  3D Graph Plotter
                </Tab>
              </div>
            </div>
            <div className="w-full mb-12">
              <h4 className="bold font-bold my-2 text-left">
                Roots of Equations - Bracketing Methods
              </h4>
              <div className="grid w-full grid-cols-2 items-start justify-center gap-4 md:grid-cols-4">
                <Tab href="/bisection">Bisection / Bolzano’s method</Tab>
                <Tab href="/false-position">False Postion method</Tab>
                <Tab href="/modified-false-position" className="col-span-2">
                  Modified False Postion method
                </Tab>
              </div>
            </div>
            <div className="w-full mb-12">
              <h4 className="bold font-bold my-2 text-left">
                Roots of Equations - Open Methods
              </h4>
              <div className="grid w-full grid-cols-2 items-start justify-center gap-4 md:grid-cols-4">
                <Tab href="/simple-fixed-point">Simple Fixed Point Method</Tab>
                <Tab href="/newton-raphson">Newton-Raphson Method</Tab>
                <Tab href="/secant">Secant Method</Tab>
                <Tab href="/modified-secant">Modified Secant Method</Tab>
              </div>
            </div>
            <div className="w-full mb-12">
              <h4 className="bold font-bold my-2 text-left">
                Roots of Equations - Hybrids
              </h4>
              <div className="grid w-full grid-cols-2 items-start justify-center gap-4 md:grid-cols-4">
                <Tab href="/brent">Brent's Method</Tab>
              </div>
            </div>
            <div className="w-full mb-12">
              <h4 className="bold font-bold my-2 text-left">
                Roots of Equations - Multiple Roots
              </h4>
              <div className="grid w-full grid-cols-2 items-start justify-center gap-4 md:grid-cols-4">
                <Tab href="/modified-newton-raphson" className="col-span-2">
                  Modified Newton-Raphson Method
                </Tab>
              </div>
            </div>
            <div className="w-full mb-12">
              <h4 className="bold font-bold my-2 text-left">
                Systems of Non-Linear Equations
              </h4>
              <div className="grid w-full grid-cols-2 items-start justify-center gap-4 md:grid-cols-4">
                <Tab
                  href="/systems-of-nonlinear-equations/fixed-point"
                  className="col-span-2"
                >
                  Fixed Point Method
                </Tab>
              </div>
            </div>
          </div>
        </div>
      </div>
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
