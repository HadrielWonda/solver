import { result } from "@/types";
import { exprsCompiler } from "@/utils/compile";

export function bisection(
  params: {
    xl: string;
    xu: string;
    es: string;
    imax: string;
    equation: string;
  }
  // setResult: React.Dispatch<React.SetStateAction<result[]>>
): result[] {
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
    } as result);
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
    // console.log("iter", iter);
    // console.log("maxIter", maxIter);
    // console.log("ea", ea);
    // console.log("maxError", maxError);
    // console.log("continue", !ea || ea < maxError);
  } while (iter < maxIter && (!ea || ea > maxError));

  // setResult(results);
  return results;
}

export default function ComputationResults({
  initialValues,
}: {
  initialValues: {
    equation: string;
    xu: string;
    xl: string;
    stoppingCriteria?: string;
    maxIterations: string;
    maxError: string;
  };
}) {
  const results = bisection({
    xl: initialValues.xl,
    xu: initialValues.xu,
    es: initialValues.maxError,
    imax: initialValues.maxIterations,
    equation: initialValues.equation,
  });

  return (
    <section
      style={{
        marginTop: "3rem",
      }}
    >
      <h3>Bisection Results</h3>
      <table border={1} cellPadding={17} width={500}>
        <caption>User Details</caption>
        <thead>
          <tr>
            <th>Iteration</th>
            <th>xl</th>
            <th>xu</th>
            <th>xr</th>
            {initialValues.stoppingCriteria == "max_error" && <th>ea(%)</th>}
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td>{result.itr}</td>
              <td>{result.xl}</td>
              <td>{result.xu}</td>
              <td>{result.xr}</td>
              {initialValues.stoppingCriteria == "max_error" && (
                <td>{result.ea}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
