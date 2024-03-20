"use server";
import { NextRequest } from "next/server";
import { Parser } from "expr-eval";

const exprsCompiler = (exprs: string) => {
  const parser = new Parser();
  return parser.parse(exprs);
};

export async function POST(request: NextRequest) {
  try {
    const {
      equation,
      xu,
      xl,
      stoppingCriteria,
      maxIterations,
      maxError: es,
    }: {
      equation: string;
      xu: string;
      xl: string;
      stoppingCriteria?: "max_iterations" | "max_error";
      maxIterations: string;
      maxError: string;
    } = await request.json();

    if (!equation) {
      return Response.json(`Equation must be specified`, {
        status: 400,
      });
    } else if (!xu || isNaN(Number(xu))) {
      return Response.json(
        `Upper bound, Xu must be specified and must be a number`,
        {
          status: 400,
        }
      );
    } else if (!xl || isNaN(Number(xl))) {
      return Response.json(
        `Lower bound, Xl must be specified and must be a number`,
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

    let xlow = Number(xl);
    let xup = Number(xu);
    let fl;
    let fu;
    let expression;

    try {
      expression = exprsCompiler(equation);
      fl = expression?.evaluate({ x: xlow });
      fu = expression?.evaluate({ x: xup });
    } catch (error) {
      return Response.json(`Invalid Function Expression`, {
        status: 400,
      });
    }

    let iter = 0;
    let xrOld: number | undefined;
    let ea: number | undefined;
    let maxError = Number(es);
    let maxIter = Number(maxIterations);

    const results: {
      itr: number;
      xl: number;
      xu: number;
      xr: number;
      ea: number | undefined;
    }[] = [];

    do {
      ++iter;
      const xr = xup - (fu * (xlow - xup)) / (fl - fu);
      // console.log("xr", xr);

      if (xr !== 0 && xrOld) {
        ea = Math.abs((xr - xrOld) / xr) * 100;
      }
      results.push({
        itr: iter,
        xl: xlow,
        xu: xup,
        xr,
        ea,
      });
      const fr = expression?.evaluate({ x: Number(xr) });
      const test = fl * fr;

      if (test > 0) {
        xlow = xr;
        fl = fr;
      } else if (test < 0) {
        xup = xr;
        fu = fr;
      } else {
        ea = 0;
      }
      xrOld = xr;
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
