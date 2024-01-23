import { result } from "@/types";
import { exprsCompiler } from "@/utils/compile";

export function falsePosition(
  params: {
    xl: string;
    xu: string;
    es: string;
    imax: string;
    equation: string;
  }
  // setResult: React.Dispatch<React.SetStateAction<result[]>>
) {
  const { xl, xu, es, imax, equation } = params;
  const expression = exprsCompiler(equation);
  let xlow = Number(xl);
  let xup = Number(xu);
  let iter = 0;
  let fl = expression?.evaluate({ x: Number(xl) });
  let xrOld: number | undefined;
  let ea: number | undefined;
  let maxError = Number(es);
  let maxIter = Number(imax);

  const results = [];

  do {
    ++iter;
    const xr = (xlow + xup) / 2;
    console.log("xr", xr);

    if (xr !== 0 && xrOld) {
      ea = Math.abs((xr - xrOld) / xr);
    }
    // setResult((r) =>
    //   r.concat({
    //     itr: iter,
    //     xl: xlow,
    //     xu: xup,
    //     xr,
    //     ea,
    //   })
    // );
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
    } else {
      ea = 0;
    }
    xrOld = xr;
    console.log("iter", iter);
    console.log("maxIter", maxIter);
    console.log("ea", ea);
    console.log("maxError", maxError);
    console.log("continue", !ea || ea < maxError);
  } while (iter < maxIter && (!ea || ea > maxError));

  // setResult(results);
  return results;
}
