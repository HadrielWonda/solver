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
      derivativeEquation,
      secondDerivativeEquation,
      start,
      stoppingCriteria,
      maxIterations,
      maxError: es,
    }: {
      equation: string;
      derivativeEquation: string;
      secondDerivativeEquation: string;
      start: string;
      stoppingCriteria?: "max_iterations" | "max_error";
      maxIterations: string;
      maxError: string;
    } = await request.json();

    if (!equation) {
      return Response.json(`Equation must be specified`, {
        status: 400,
      });
    } else if (!derivativeEquation) {
      return Response.json(`Derivative equation must be specified`, {
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

    let expression;
    let derivativeExpression;
    let secondDerivativeExpression;

    try {
      expression = exprsCompiler(equation);
    } catch (error) {
      return Response.json(`Invalid Function Expression`, {
        status: 400,
      });
    }

    try {
      derivativeExpression = exprsCompiler(derivativeEquation);
    } catch (error) {
      return Response.json(`Invalid Derivative Function Expression`, {
        status: 400,
      });
    }

    try {
      secondDerivativeExpression = exprsCompiler(secondDerivativeEquation);
    } catch (error) {
      return Response.json(`Invalid Second Derivative Function Expression`, {
        status: 400,
      });
    }

    let xi = Number(start);
    let iter = 0;
    // let fl = expression?.evaluate({ x: Number(xl) });
    // let xrOld: number | undefined;
    let ea: number | undefined;
    let prevEa: number | undefined;
    let maxError = Number(es);
    let maxIter = Number(maxIterations);
    let diverging = false;
    let zeroDenominator = false;

    const results: fixedPointResult[] = [];

    do {
      ++iter;
      const fx = expression?.evaluate({ x: xi });
      const dx = derivativeExpression?.evaluate({ x: xi });
      const dx2 = secondDerivativeExpression?.evaluate({ x: xi });
      let x;

      if (dx !== 0 && fx !== 0) {
        x = xi - (fx * dx) / (dx * dx - fx * dx2);
        ea = Math.abs((x - xi) / x) * 100;
      } else {
        zeroDenominator = true;
        break;
      }

      results.push({
        itr: iter,
        xi: x,
        ea,
      });

      xi = x;

      if (iter > 3 && results[iter - 2].ea! / results[iter - 1].ea! < 2) {
        diverging = true;
        break;
      }
      if (expression?.evaluate({ x: x }) === 0.0) {
        break;
      }
    } while (
      iter < maxIter &&
      (ea == undefined || ea > maxError) &&
      !diverging
    );

    return Response.json(
      { diverge: diverging, results, zeroDenominator },
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
