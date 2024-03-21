"use client";

import { equationsFixedPointResult, fixedPointResult } from "@/types";
import { useEffect, useMemo, useState } from "react";

export default function ComputationResults({
  values,
}: {
  values: {
    variablesList: string[];
    governingEquations: {
      [key: string]: string;
    };
    initialValues: {
      [key: string]: string;
    };
    stoppingCriteria: {
      stoppingCriteria?: string | undefined;
      maxIterations: string;
      maxError: string;
    };
  };
}) {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<
    { results: equationsFixedPointResult[]; diverge: boolean } | undefined
  >();
  const [errorMessage, setErrorMessage] = useState("");

  const compute = useMemo(
    () => async () => {
      try {
        const newInitialValue: { [key: string]: number } = {};
        for (const variable of values.variablesList) {
          newInitialValue[variable] = Number(values.initialValues[variable]);
        }
        console.log("values: ", { ...values, initialValues: newInitialValue });
        let response: Response;
        response = await fetch(
          "/roots/open-methods/systems-of-nonlinear-equations/fixed-point/api",
          {
            method: "post",
            body: JSON.stringify({ ...values, initialValues: newInitialValue }),
          }
        );

        console.log("call returned");
        const data = await response.json();
        console.log("data", data);

        if (response.ok) {
          setResults(data);
        } else {
          throw new Error(data);
        }
      } catch (error: any) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    },
    [values]
  );

  const reCompute = () => {
    setLoading(true);
    compute();
  };

  useEffect(() => {
    compute();
  }, [compute]);

  useEffect(() => {
    setErrorMessage("");
  }, [loading, results]);

  return (
    <section
      style={{
        marginTop: "3rem",
      }}
    >
      {loading ? (
        <>
          <h3>Computing Results</h3>
          <p>...loading</p>
        </>
      ) : errorMessage ? (
        <>
          <h3>Error Computing Results</h3>
          <p>{errorMessage}</p>
          <button onClick={() => reCompute()}>Retry</button>
        </>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: 800,
            }}
          >
            <h3>Fixed-Point Iteration Results</h3>
            <button onClick={() => reCompute()}>Re-run</button>
          </div>
          <table border={1} cellPadding={17} width={800}>
            <thead>
              <tr>
                <th>Iteration</th>
                {values.variablesList.map((varible) => (
                  <>
                    <th
                      style={{
                        whiteSpace: "nowrap",
                      }}
                    >{`----`}</th>
                    <th>{varible}</th>
                    <th>{varible}-ea(%)</th>
                  </>
                ))}
              </tr>
            </thead>
            <tbody>
              {results?.results?.map((result, index) => (
                <tr key={index}>
                  <td>{result.itr}</td>
                  {values.variablesList.map((varible) => (
                    <>
                      <th></th>
                      <td>{result.values[varible]}</td>
                      <td>{result.ea[varible]}</td>
                    </>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {results?.diverge && (
            <div className="block">
              <p>
                Iteration was terminated because results were not converging!
                Consider restructuring your governing equation.
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
}
