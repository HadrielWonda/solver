/* eslint-disable react/no-unescaped-entities */
"use client";

import { fixedPointResult } from "@/types";
import { useEffect, useMemo, useState } from "react";

export default function ComputationResults({
  initialValues,
}: {
  initialValues: {
    equation: string;
    xi: string;
    xj: string;
    xk: string;
    stoppingCriteria?: string;
    maxIterations: string;
    maxError: string;
  };
}) {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<
    | {
        results: fixedPointResult[];
        diverge: boolean;
      }
    | undefined
  >();
  const [errorMessage, setErrorMessage] = useState("");
  // console.log("maxError: ", initialValues.maxError);

  const compute = useMemo(
    () => async () => {
      try {
        let response: Response;
        response = await fetch("/roots/brent/api", {
          method: "post",
          body: JSON.stringify(initialValues),
        });

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
    [initialValues]
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
            <h3>Brent's Algorithm Iteration Results</h3>
            <button onClick={() => reCompute()}>Re-run</button>
          </div>
          <table border={1} cellPadding={17} width={800}>
            <thead>
              <tr>
                <th>Iteration</th>
                <th>x</th>
                <th>ea(%)</th>
              </tr>
            </thead>
            <tbody>
              {results?.results?.map((result, index) => (
                <tr key={index}>
                  <td>{result.itr}</td>
                  <td>{result.xi}</td>
                  <td>{result.ea}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {results?.diverge && (
            <div className="block">
              <p>
                Iteration was terminated because results were diverging or
                converging slow!
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
}
