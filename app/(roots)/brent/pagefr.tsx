/* eslint-disable react/no-unescaped-entities */
"use client";
import Input from "@/components/Input";
import Radios from "@/components/Radios";
import React, { useEffect, useMemo, useState } from "react";
import { FunctionPlot } from "@/lib/graph/FunctionPlot";
import { exprsCompiler } from "@/utils/compile";
import ComputationResults from "./ComputationResults";
// import ComputationResults from "./ComputationResults";
// import ComputationResults from "./ComputationResults";

export default function Page() {
  const [showResults, setShowResults] = useState(false);
  const [editingEquation, setEditingEquation] = useState(true);
  const [tempEquation, setTempEquation] = useState("");
  const [initialValues, setInitialValues] = useState<{
    equation: string;
    xi: string;
    xj: string;
    xk: string;
    stoppingCriteria?: string;
    maxIterations: string;
    maxError: string;
  }>({
    equation: "",
    xi: "",
    xj: "",
    xk: "",
    maxIterations: "1000",
    maxError: "0.0000000000001",
  });

  useEffect(() => {
    setShowResults(false);
  }, [initialValues]);

  const expression = useMemo(
    () =>
      initialValues.equation
        ? exprsCompiler(initialValues.equation)
        : undefined,
    [initialValues.equation]
  );

  const min =
    initialValues.equation &&
    initialValues.xi &&
    initialValues.xj &&
    initialValues.xk
      ? Math.min(
          Number(initialValues.xi),
          Number(initialValues.xj),
          Number(initialValues.xk)
        )
      : undefined;

  const max =
    initialValues.equation &&
    initialValues.xi &&
    initialValues.xj &&
    initialValues.xk
      ? Math.max(
          Number(initialValues.xi),
          Number(initialValues.xj),
          Number(initialValues.xk)
        )
      : undefined;

  const Graph = useMemo(
    () =>
      initialValues.equation &&
      initialValues.xi &&
      initialValues.xj &&
      initialValues.xk ? (
        <FunctionPlot
          options={{
            xAxis: {
              domain: [
                Math.min(
                  Number(initialValues.xi),
                  Number(initialValues.xj),
                  Number(initialValues.xk)
                ) - 6,
                Math.max(
                  Number(initialValues.xi),
                  Number(initialValues.xj),
                  Number(initialValues.xk)
                ) + 6,
              ],
            },
            data: [
              {
                fn: initialValues.equation,
              },
            ],
          }}
        />
      ) : null,
    [
      initialValues.equation,
      initialValues.xi,
      initialValues.xj,
      initialValues.xk,
    ]
  );

  return (
    <main>
      <h1>Brent's Method</h1>
      <div className="text-block">
        <p>
          The general idea behind the Brent’s root finding method is whenever
          possible to use one of the quick open methods(Inverse quadratic
          interpolation or Secant Method). In the event that these generate an
          unacceptable result (i.e., a root estimate that falls outside the
          bracket), the algorithm reverts to the more conservative Bisection
          method. Although bisection may be slower, it generates an estimate
          guaranteed to fall within the bracket. This process is then repeated
          until the root is located to within an acceptable tolerance.
        </p>
        {/* <p className="text-block">
          This approximation yield the following iterative equation
        </p>
        <div className="text-block">
          <Image src={ModifiedSecantFormula} alt="Modified Secant" />
        </div> */}
      </div>
      <section className="text-block">
        <div className="text-block">
          {editingEquation ? (
            <Input
              label="Enter equation - f(x)"
              value={tempEquation}
              onChange={(e) => setTempEquation(e.target.value)}
            />
          ) : (
            <Input
              label="Equation - f(x)"
              value={initialValues.equation}
              disabled={true}
              // onChange={(e) =>
              //   setInitialValues((v) => ({ ...v, equation: e.target.value }))
              // }
            />
          )}
          {editingEquation ? (
            <div
              style={{
                marginTop: "0.8rem",
                display: "flex",
                gap: "1rem",
              }}
            >
              <button
                onClick={() => {
                  setInitialValues((v) => ({ ...v, equation: tempEquation }));
                  setEditingEquation(false);
                }}
              >
                Save
              </button>
              <button
                onClick={() => {
                  setTempEquation(initialValues.equation);
                  setEditingEquation(false);
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div
              style={{
                marginTop: "0.8rem",
                display: "flex",
                gap: "1rem",
              }}
              onClick={() => setEditingEquation(true)}
            >
              <button>Edit</button>
            </div>
          )}
        </div>

        <div className="text-block">
          <h3>Enter initial values</h3>
          <p>Make sure values bracket the root.</p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <Input
              label="x(i-2)"
              value={initialValues.xi}
              onChange={(e) =>
                setInitialValues((v) => ({ ...v, xi: e.target.value }))
              }
            />
            <Input
              label="x(i-1)"
              value={initialValues.xj}
              onChange={(e) =>
                setInitialValues((v) => ({ ...v, xj: e.target.value }))
              }
            />
            <Input
              label="x(i)"
              value={initialValues.xk}
              onChange={(e) =>
                setInitialValues((v) => ({ ...v, xk: e.target.value }))
              }
            />
          </div>
        </div>

        {initialValues.equation &&
          !editingEquation &&
          initialValues.xi &&
          !isNaN(Number(initialValues.xi)) &&
          initialValues.xj &&
          !isNaN(Number(initialValues.xj)) &&
          initialValues.xk &&
          !isNaN(Number(initialValues.xk)) &&
          expression?.evaluate({ x: min! }) *
            expression?.evaluate({ x: max! }) <
            0 && (
            <>
              <Radios
                title="Select stopping criterion type"
                options={[
                  {
                    id: "1",
                    value: "max_iterations",
                    label: "Iterations",
                  },
                  {
                    id: "2",
                    value: "max_error",
                    label: "% relative error",
                  },
                ]}
                selectedOption={initialValues.stoppingCriteria}
                setSelectedOption={(option) =>
                  setInitialValues((v) => ({
                    ...v,
                    stoppingCriteria: option.value,
                  }))
                }
              />
              {initialValues.stoppingCriteria == "max_iterations" ? (
                <>
                  <div className="text-block">
                    <Input
                      label="Max number of iterations"
                      value={initialValues.maxIterations}
                      onChange={(e) =>
                        setInitialValues((v) => ({
                          ...v,
                          maxIterations: e.target.value,
                        }))
                      }
                    />

                    {!showResults && (
                      <button onClick={() => setShowResults(true)}>
                        Start computation
                      </button>
                    )}
                  </div>
                </>
              ) : initialValues.stoppingCriteria == "max_error" ? (
                <div className="text-block">
                  <Input
                    label="Max absolute % relative error - |ea|"
                    value={initialValues.maxError}
                    onChange={(e) =>
                      setInitialValues((v) => ({
                        ...v,
                        maxError: e.target.value,
                      }))
                    }
                  />

                  {!showResults && (
                    <button onClick={() => setShowResults(true)}>
                      Start computation
                    </button>
                  )}
                </div>
              ) : null}

              <div className="text-block">
                <p>
                  NB: If the iteration is noticed to be diverging, it will be
                  automatically aborted to avoid a non-convergent infinite
                  iteration.
                </p>
              </div>
            </>
          )}
      </section>
      {showResults && (
        <div className="text-block">
          <h3>Graph of function around initial guess</h3>
          {Graph}
        </div>
      )}
      {showResults && (
        <div className="text-block">
          <p>Algorithm still in progress</p>
        </div>
      )}
      {showResults && <ComputationResults initialValues={initialValues} />}
    </main>
  );
}
