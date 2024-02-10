"use server";
import { NextRequest } from "next/server";
import { Parser } from "expr-eval";
import { fixedPointResult } from "@/types";

const exprsCompiler = (exprs: string) => {
  const parser = new Parser();
  return parser.parse(exprs);
};

export async function POST(request: NextRequest) {
  try {
    const {
      equation,
      x,
      dx,
      stoppingCriteria,
      maxIterations,
      maxError: es,
    }: {
      equation: string;
      x: string;
      dx: string;
      stoppingCriteria?: "max_iterations" | "max_error";
      maxIterations: string;
      maxError: string;
    } = await request.json();

    if (!equation) {
      return Response.json(`Equation must be specified`, {
        status: 400,
      });
    } else if (!x || isNaN(Number(x))) {
      return Response.json(`X must be specified and must be a number`, {
        status: 400,
      });
    } else if (!dx || isNaN(Number(dx))) {
      return Response.json(`dx must be specified and must be a number`, {
        status: 400,
      });
    } else if (!["max_iterations", "max_error"].includes(stoppingCriteria!)) {
      return Response.json(
        `stopping criteria must be specified and must be a number`,
        {
          status: 400,
        }
      );
    } else if (stoppingCriteria == "max_error" && (!es || isNaN(Number(es)))) {
      return Response.json(
        `Max allowable error must be specified and must be a number`,
        {
          status: 400,
        }
      );
    } else if (
      stoppingCriteria == "max_iterations" &&
      (!maxIterations || isNaN(Number(maxIterations)))
    ) {
      return Response.json(
        `Max number of iterations must be specified and must be a number`,
        {
          status: 400,
        }
      );
    }

    const expression = exprsCompiler(equation);
    let xi = Number(x);
    let dxi = Number(dx);
    let iter = 0;
    // let fl = expression?.evaluate({ x: Number(xl) });
    // let xrOld: number | undefined;
    let ea: number | undefined;
    let prevEa: number | undefined;
    let maxError = Number(es);
    let maxIter = Number(maxIterations);
    let diverging = false;

    const results: fixedPointResult[] = [];

    do {
      ++iter;
      const fi = expression?.evaluate({ x: xi });
      const fj = expression?.evaluate({ x: xi + dxi });
      let x;

      x = xi - (fi * dxi) / (fj - fi);
      ea = Math.abs((x - xi) / x) * 100;

      results.push({
        itr: iter,
        xi: x,
        ea,
      });

      xi = x;

      if (iter > 2 && results[iter - 2].ea! / results[iter - 1].ea! < 2) {
        diverging = true;
        break;
      }

      if (isNaN(fj) || isNaN(fi) || isNaN(x)) {
        diverging = true;
        break;
      }
    } while (
      iter < maxIter &&
      (ea == undefined || ea > maxError) &&
      !diverging
    );

    return Response.json(
      { diverge: diverging, results },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return Response.json(
      error.message ?? "Uh oh! Something isn't working right!",
      {
        status: 500,
      }
    );
  }
}
