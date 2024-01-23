"use client";

import { result } from "@/types";
import { useEffect, useMemo, useState } from "react";

export default function ComputationResults({
  initialValues,
  method,
}: {
  initialValues: {
    equation: string;
    xu: string;
    xl: string;
    stoppingCriteria?: string;
    maxIterations: string;
    maxError: string;
  };
  method: "Bisection" | "False-Position" | "Modified False-Position";
}) {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<result[] | undefined>();
  const [errorMessage, setErrorMessage] = useState("");
  console.log("maxError: ", initialValues.maxError);

  const compute = useMemo(
    () => async () => {
      try {
        let response: Response;
        if (method == "Bisection") {
          response = await fetch("/roots/bracketing-methods/bisection/api", {
            method: "post",
            body: JSON.stringify(initialValues),
          });
        } else if (method == "False-Position") {
          response = await fetch(
            "/roots/bracketing-methods/false-position/api",
            {
              method: "post",
              body: JSON.stringify(initialValues),
            }
          );
        } else {
          response = await fetch(
            "/roots/bracketing-methods/modified-false-position/api",
            {
              method: "post",
              body: JSON.stringify(initialValues),
            }
          );
        }

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
    [initialValues, method]
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
          <h3>Computing {method} Results</h3>
          <p>...loading</p>
        </>
      ) : errorMessage ? (
        <>
          <h3>Error Computing {method} Results</h3>
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
            <h3>{method} Results</h3>
            <button onClick={() => reCompute()}>Re-run</button>
          </div>
          <table border={1} cellPadding={17} width={800}>
            <thead>
              <tr>
                <th>Iteration</th>
                <th>xl</th>
                <th>xu</th>
                <th>xr</th>
                <th>ea(%)</th>
              </tr>
            </thead>
            <tbody>
              {results?.map((result, index) => (
                <tr key={index}>
                  <td>{result.itr}</td>
                  <td>{result.xl}</td>
                  <td>{result.xu}</td>
                  <td>{result.xr}</td>
                  <td>{result.ea}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}
