"use server";
import { NextRequest } from "next/server";
import { Expression, Parser } from "expr-eval";
import { equationsFixedPointResult } from "@/types";

const exprsCompiler = (exprs: string) => {
  const parser = new Parser();
  return parser.parse(exprs);
};

export async function POST(request: NextRequest) {
  try {
    const {
      variablesList,
      governingEquations,
      initialValues,
      stoppingCriteria: { stoppingCriteria, maxIterations, maxError: es },
    }: {
      variablesList: string[];
      governingEquations: {
        [key: string]: string;
      };
      initialValues: {
        [key: string]: number;
      };
      stoppingCriteria: {
        stoppingCriteria?: "max_iterations" | "max_error";
        maxIterations: string;
        maxError: string;
      };
    } = await request.json();

    if (
      !Object.entries(governingEquations).every(([_, value]) => Boolean(value))
    ) {
      return Response.json(`All governing equations must be specified`, {
        status: 400,
      });
    } else if (
      !Object.entries(initialValues).every(
        ([_, value]) => !isNaN(Number(value))
      )
    ) {
      return Response.json(
        `all initial values, must be specified and must be a number`,
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

    const expressions: { [key: string]: Expression } = {};
    for (const variable of variablesList) {
      expressions[variable] = exprsCompiler(governingEquations[variable]);
    }
    let iter = 0;
    // let fl = expression?.evaluate({ x: Number(xl) });
    // let xrOld: number | undefined;
    let ea: { [key: string]: number } = {};
    let prevEa: { [key: string]: number } = {};
    let maxError = Number(es);
    let maxIter = Number(maxIterations);
    const divergenceCount: { [key: string]: number } = {};
    for (const variable of variablesList) {
      divergenceCount[variable] = 0;
    }

    const results: equationsFixedPointResult[] = [
      {
        itr: iter,
        values: initialValues,
        ea: {},
      },
    ];
    let prevValues = { ...initialValues };
    const substitute = { ...initialValues };

    do {
      ++iter;
      const newValues: { [key: string]: number } = {};
      for (const variable of variablesList) {
        const x = expressions[variable].evaluate(substitute);
        newValues[variable] = x;
        substitute[variable] = x;
      }
      for (const variable of variablesList) {
        if (newValues[variable] !== 0 && prevValues[variable]) {
          ea[variable] =
            Math.abs(
              (newValues[variable] - prevValues[variable]) / newValues[variable]
            ) * 100;
        }
      }

      results.push({
        itr: iter,
        values: newValues,
        ea,
      });

      for (const variable of variablesList) {
        if (
          ea[variable] &&
          prevEa[variable] &&
          (ea[variable] > prevEa[variable] || ea[variable] > 50)
        ) {
          divergenceCount[variable] = ++divergenceCount[variable];
        } else {
          divergenceCount[variable] = 0;
        }
      }

      prevEa = ea;
      prevValues = newValues;
    } while (
      iter < maxIter &&
      Object.entries(ea).every(
        ([_, value]) => value == undefined || value > maxError
      ) &&
      Object.entries(divergenceCount).every(([_, value]) => value < 4)
    );

    if (Object.entries(divergenceCount).some(([_, value]) => value == 4)) {
      return Response.json(
        { diverge: true, results },
        {
          status: 200,
        }
      );
    } else {
      return Response.json(
        { diverge: false, results },
        {
          status: 200,
        }
      );
    }
  } catch (error: any) {
    return Response.json(
      error.message ?? "Uh oh! Something isn't working right!",
      {
        status: 500,
      }
    );
  }
}
