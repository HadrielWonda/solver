"use server";
import { NextRequest } from "next/server";
import { Expression, Parser } from "expr-eval";

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
    let xup = Math.max(Number(xi), Number(xj), Number(xk));
    let xlow = Math.min(Number(xi), Number(xj), Number(xk));
    let xmid: number;
    if (String(xup) == xi) {
      if (String(xlow) == xj) {
        xmid = Number(xk);
      } else {
        xmid = Number(xj);
      }
    } else if (String(xup) == xj) {
      if (String(xlow) == xi) {
        xmid = Number(xk);
      } else {
        xmid = Number(xi);
      }
    } else {
      if (String(xlow) == xi) {
        xmid = Number(xj);
      } else {
        xmid = Number(xi);
      }
    }

    let iter = 0;
    // let fl = expression?.evaluate({ x: Number(xl) });
    // let xrOld: number | undefined;
    let ea: number | undefined;
    let maxError = Number(es);
    let maxIter = Number(maxIterations);

    const results: {
      itr: number;
      method: "quadratic" | "secant" | "bisection";
      xi: number;
      xj: number;
      xk: number;
      xr: number;
      ea: number | undefined;
    }[] = [];

    const fup = expression?.evaluate({ x: xup });
    const fmid = expression?.evaluate({ x: xmid });
    const flow = expression?.evaluate({ x: xlow });

    do {
      ++iter;

      // try quadratic or secant
      let xr;

      if (xlow !== xmid && xmid !== xup && xup !== xlow) {
        xr = singleQuadratic(expression, Number(xi), Number(xj), Number(xk));
      } else {
        if (xlow !== xmid) {
          xr = singleSecant(expression, xmid, xlow);
        } else if (xmid !== xup) {
          xr = singleSecant(expression, xup, xmid);
        } else {
          xr = singleSecant(expression, xup, xlow);
        }
      }

      if (xr < xlow || xr > xup) {
        // Answer doesn't converge, switch to bisection
        xr = (xlow + xup) / 2;

        const fr = expression?.evaluate({ x: xr });
        const test = flow * fr;

        if (test > 0) {
          xlow = xr;
          // fl = fr;
        } else if (test < 0) {
          xup = xr;
        } else {
          ea = 0;
        }
      } else {
      }

      results.push({
        method: "bisection",
        itr: iter,
        xi: xlow,
        xj: xlow,
        xk: xlow,
        xr,
        ea,
      });
      // const fr = expression?.evaluate({ x: Number(xr) });
      // const test = fl * fr;

      // if (test > 0) {
      //   xlow = xr;
      //   fl = fr;
      // } else if (test < 0) {
      //   xup = xr;
      // } else {
      //   ea = 0;
      // }
      // xrOld = xr;
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
