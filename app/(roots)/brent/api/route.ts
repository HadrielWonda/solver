"use server";
import { NextRequest } from "next/server";
import { Expression, Parser } from "expr-eval";
import { brentResult } from "@/types";

const exprsCompiler = (exprs: string) => {
  const parser = new Parser();
  return parser.parse(exprs);
};

export async function POST(request: NextRequest) {
  try {
    const {
      equation,
      xi,
      xj,
      xk,
      stoppingCriteria,
      maxIterations,
      maxError: es,
    }: {
      equation: string;
      xi: string;
      xj: string;
      xk: string;
      stoppingCriteria?: "max_iterations" | "max_error";
      maxIterations: string;
      maxError: string;
    } = await request.json();

    if (!equation) {
      return Response.json(`Equation must be specified`, {
        status: 400,
      });
    } else if (!xi || isNaN(Number(xi))) {
      return Response.json(
        `Upper bound, x(i-2) must be specified and must be a number`,
        {
          status: 400,
        }
      );
    } else if (!xj || isNaN(Number(xj))) {
      return Response.json(
        `Lower bound, x(i-1) must be specified and must be a number`,
        {
          status: 400,
        }
      );
    } else if (!xk || isNaN(Number(xk))) {
      return Response.json(
        `Lower bound, x(i) must be specified and must be a number`,
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

    let iter = 0;
    let ea: number | undefined;
    let maxError = Number(es);
    let maxIter = Number(maxIterations);
    let x0 = Number(xi);
    let x1 = Number(xj);
    let x2 = Number(xk);

    const results: brentResult[] = [];

    do {
      ++iter;

      // try quadratic or secant
      let xr;
      let method: "quadratic" | "secant" | "bisection";

      if (x0 === x1) {
        method = "secant";
        xr = singleSecant(expression, x0, x2);
      } else if (x1 === x2) {
        method = "secant";
        xr = singleSecant(expression, x0, x1);
      } else if (x2 === x0) {
        method = "secant";
        xr = singleSecant(expression, x0, x1);
      } else {
        xr = singleQuadratic(expression, x0, x1, x2);
        method = "quadratic";
      }

      if (xr !== 0 && x2) {
        ea = Math.abs((xr - x2) / xr) * 100;
      }

      results.push({
        method,
        itr: iter,
        xi: x0,
        xj: x1,
        xk: x2,
        xr,
        ea,
      });

      x0 = x1;
      x1 = x2;
      x2 = xr;
    } while (iter < maxIter && (ea == undefined || ea > maxError));

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

const singleQuadratic = (
  expression: Expression,
  xi: number,
  xj: number,
  xk: number
) => {
  const yi = expression?.evaluate({ x: xi });
  const yj = expression?.evaluate({ x: xj });
  const yk = expression?.evaluate({ x: xk });

  const xr =
    ((yj * yk) / ((yi - yj) * (yi - yk))) * xi +
    ((yi * yk) / ((yj - yi) * (yj - yk))) * xj +
    ((yi * yj) / ((yk - yi) * (yk - yj))) * xk;

  return xr;
};

const singleSecant = (expression: Expression, xi: number, xj: number) => {
  const fi = expression?.evaluate({ x: xi });
  const fj = expression?.evaluate({ x: xj });

  const xr = xj - (fj * (xi - xj)) / (fi - fj);

  return xr;
};
