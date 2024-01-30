"use server";
import { NextRequest } from "next/server";
import { Parser } from "expr-eval";
import { fixedPointResult, result } from "@/types";

const exprsCompiler = (exprs: string) => {
  const parser = new Parser();
  return parser.parse(exprs);
};

export async function POST(request: NextRequest) {
  try {
    const {
      equation,
      x0,
      x1,
      stoppingCriteria,
      maxIterations,
      maxError: es,
    }: {
      equation: string;
      x0: string;
      x1: string;
      stoppingCriteria?: "max_iterations" | "max_error";
      maxIterations: string;
      maxError: string;
    } = await request.json();

    if (!equation) {
      return Response.json(`Equation must be specified`, {
        status: 400,
      });
    } else if (!x0 || isNaN(Number(x0))) {
      return Response.json(`X0 must be specified and must be a number`, {
        status: 400,
      });
    } else if (!x1 || isNaN(Number(x1))) {
      return Response.json(`X1 must be specified and must be a number`, {
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
    let xi = Number(x0);
    let xj = Number(x1);
    let iter = 0;
    // let fl = expression?.evaluate({ x: Number(xl) });
    // let xrOld: number | undefined;
    let ea: number | undefined;
    let prevEa: number | undefined;
    let maxError = Number(es);
    let maxIter = Number(maxIterations);
    let diverging = false;

    const results: result[] = [];
    let fi = expression?.evaluate({ x: xi });

    do {
      ++iter;
      const fj = expression?.evaluate({ x: xj });
      let x;

      x = xj - (fj * (xi - xj)) / (fi - fj);
      ea = Math.abs((x - xj) / x) * 100;

      results.push({
        itr: iter,
        xl: xi,
        xu: xj,
        xr: x,
        ea,
      });

      xi = xj;
      fi = fj;
      xj = x;

      if (iter > 2 && results[iter - 2].ea! / results[iter - 1].ea! < 2) {
        diverging = true;
        break;
      }

      if (isNaN(fj) || isNaN(x)) {
        diverging = true;
        break;
      }
    } while (iter < maxIter && (!ea || ea > maxError) && !diverging);

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
