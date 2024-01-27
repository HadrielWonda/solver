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
      start,
      stoppingCriteria,
      maxIterations,
      maxError: es,
    }: {
      equation: string;
      start: string;
      stoppingCriteria?: "max_iterations" | "max_error";
      maxIterations: string;
      maxError: string;
    } = await request.json();

    if (!equation) {
      return Response.json(`Equation must be specified`, {
        status: 400,
      });
    } else if (!start || isNaN(Number(start))) {
      return Response.json(
        `Upper bound, Xu must be specified and must be a number`,
        {
          status: 400,
        }
      );
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
    let xi = Number(start);
    let iter = 0;
    // let fl = expression?.evaluate({ x: Number(xl) });
    // let xrOld: number | undefined;
    let ea: number | undefined;
    let maxError = Number(es);
    let maxIter = Number(maxIterations);

    const results: fixedPointResult[] = [];

    do {
      ++iter;
      const x = expression?.evaluate({ x: xi });
      // console.log("xr", xr);

      if (x !== 0 && xi) {
        ea = Math.abs((x - xi) / x) * 100;
      }
      results.push({
        itr: iter,
        xi: x,
        ea,
      });

      xi = x;
    } while (iter < maxIter && (!ea || ea > maxError));

    return Response.json(results, {
      status: 200,
    });
  } catch (error: any) {
    return Response.json(
      error.message ?? "Uh oh! Something isn't working right!",
      {
        status: 500,
      }
    );
  }
}
