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
    let xrOld: number | undefined;
    let ea: number | undefined;
    let maxError = Number(es);
    let maxIter = Number(maxIterations);

    const results: brentResult[] = [];

    let fup = expression?.evaluate({ x: xup });
    let fmid = expression?.evaluate({ x: xmid });
    let flow = expression?.evaluate({ x: xlow });

    do {
      ++iter;

      // try quadratic or secant
      let xr;
      let method: "quadratic" | "secant" | "bisection";

      if (xlow == xmid || xmid == xup) {
        method = "secant";
        xr = singleSecant(expression, xup, xlow, iter);
      } else {
        xr = singleQuadratic(expression, Number(xi), Number(xj), Number(xk));
        method = "quadratic";
        if (xr == xrOld) {
          const test = flow * fmid;
          method = "secant";

          if (test > 0) {
            xr = singleSecant(expression, xmid, xup, iter);
          } else {
            xr = singleSecant(expression, xlow, xmid, iter);
          }
        }
      }

      if (xr !== 0 && xrOld) {
        ea = Math.abs((xr - xrOld) / xr) * 100;
      }

      if (xr < xlow || xr > xup) {
        // Answer doesn't converge, switch to bisection
        const test = flow * fmid;

        if (test > 0) {
          xr = (xmid + xup) / 2;

          if (xr !== 0 && xrOld) {
            ea = Math.abs((xr - xrOld) / xr) * 100;
          }

          results.push({
            method: "bisection",
            itr: iter,
            xi: xlow,
            xj: xmid,
            xk: xup,
            xr,
            ea,
          });

          xlow = xmid;
          flow = fmid;

          xmid = xr;
          fmid = expression?.evaluate({ x: xr });
        } else {
          xr = (xmid + xlow) / 2;

          if (xr !== 0 && xrOld) {
            ea = Math.abs((xr - xrOld) / xr) * 100;
          }

          results.push({
            method: "bisection",
            itr: iter,
            xi: xlow,
            xj: xmid,
            xk: xup,
            xr,
            ea,
          });

          xup = xmid;
          fup = fmid;

          xmid = xr;
          fmid = expression?.evaluate({ x: xr });
        }
      } else {
        results.push({
          method,
          itr: iter,
          xi: xlow,
          xj: xmid,
          xk: xup,
          xr,
          ea,
        });

        if (method == "quadratic") {
          const test = flow * fmid;

          if (test > 0) {
            xlow = xmid;
            flow = fmid;

            xmid = xr;
            fmid = expression?.evaluate({ x: xr });
          } else {
            xup = xmid;
            fup = fmid;

            xmid = xr;
            fmid = expression?.evaluate({ x: xr });
          }
        } else {
          if (xmid == xlow || xmid == xup) {
            if (xr > xup) {
              xmid = xup;
              fmid = fup;

              xup = xr;
              fup = expression?.evaluate({ x: xr });
            } else if (xr < xlow) {
              xmid = xlow;
              fmid = flow;

              xlow = xr;
              flow = expression?.evaluate({ x: xr });
            } else {
              xmid = xr;
              fmid = expression?.evaluate({ x: xr });
            }
          } else {
            const test = flow * fmid;
            method = "secant";

            if (test > 0) {
              xlow = xmid;
              xmid = xr;
            } else {
              xup = xmid;
              xmid = xr;
            }
          }
        }
      }

      // if (iter > 48 && iter < 52) {
      //   console.log("iter: ", iter);
      //   console.log("ea", ea);
      //   console.log("maxError", maxError);
      //   console.log("!ea", !ea);
      //   console.log("ea! > maxError", ea! > maxError);
      // }

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

const singleSecant = (
  expression: Expression,
  xi: number,
  xj: number,
  iter: number
) => {
  const fi = expression?.evaluate({ x: xi });
  const fj = expression?.evaluate({ x: xj });

  const xr = xj - (fj * (xi - xj)) / (fi - fj);

  if (iter > 48 && iter < 52) {
    console.log("iter: ", iter);
    console.log("xi", xi);
    console.log("fi", fi);
    console.log("xj", xj);
    console.log("fj", fj);
    console.log("xr", xr);
    console.log("fr", expression?.evaluate({ x: xr }));
    console.log(">>>>>>>>\n");
  }

  return xr;
};
