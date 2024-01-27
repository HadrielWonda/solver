"use client";
import Input from "@/components/Input";
import Radios from "@/components/Radios";
import React, { useEffect, useMemo, useState } from "react";
import { exprsCompiler } from "@/utils/compile";
import ComputationResults from "./ComputationResults";

export default function Page() {
  const [showResults, setShowResults] = useState(false);
  const [editingEquation, setEditingEquation] = useState(true);
  const [tempEquation, setTempEquation] = useState("");
  const [initialValues, setInitialValues] = useState<{
    equation: string;
    start: string;
    stoppingCriteria?: string;
    maxIterations: string;
    maxError: string;
  }>({
    equation: "",
    start: "",
    maxIterations: "1000",
    maxError: "0.0000000000001",
  });

  const expression = useMemo(
    () =>
      initialValues.equation
        ? exprsCompiler(initialValues.equation)
        : undefined,
    [initialValues.equation]
  );

  useEffect(() => {
    setShowResults(false);
  }, [initialValues]);

  return (
    <main>
      <h1>Simple Fixed-Point Iteration Method</h1>
      <div className="block">
        <p>
          Create your governing equation - <span className="bold">g(x)</span>,
          by rearranging <span>f(x) = 0</span> so that <span>x</span> is on the
          left hand side of the equation.
        </p>
        <p className="block bold">x = g(x)</p>

        <div className="block">
          <p>Examples</p>
          <div className="indent">
            <p>
              f(x) = 0 ={">"} x<sup>2</sup> - 2x + 3 = 0
            </p>
            <p>
              x = g(x) ={">"} x = (x<sup>2</sup> + 3) / 2
            </p>
          </div>
          <div className="block indent">
            <p>f(x) = 0 ={">"} sin x = 0</p>
            <p>x = g(x) ={">"} x = sin x + x</p>
          </div>
        </div>
      </div>
      <section className="block">
        <div className="block">
          {editingEquation ? (
            <Input
              label="Enter governing equation g(x)"
              value={tempEquation}
              onChange={(e) => setTempEquation(e.target.value)}
            />
          ) : (
            <Input
              label="Equation g(x)"
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

        <div className="block">
          <Input
            label="Start value"
            value={initialValues.start}
            onChange={(e) =>
              setInitialValues((v) => ({ ...v, start: e.target.value }))
            }
          />
        </div>

        {initialValues.equation &&
          !editingEquation &&
          initialValues.start &&
          !isNaN(Number(initialValues.start)) && (
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
                  <div className="block">
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
                <div className="block">
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

              <div className="block">
                <p>
                  NB: If the iteration is noticed to be diverging, it will be
                  automatically aborted to avoid a non-convergent infinite
                  iteration.
                </p>
              </div>
            </>
          )}
      </section>
      {showResults && <ComputationResults initialValues={initialValues} />}
    </main>
  );
}
