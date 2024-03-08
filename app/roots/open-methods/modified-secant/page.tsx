"use client";
import Input from "@/components/Input";
import Radios from "@/components/Radios";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { FunctionPlot } from "@/lib/graph/FunctionPlot";
import ComputationResults from "./ComputationResults";
// import ComputationResults from "./ComputationResults";

export default function Page() {
  const [showResults, setShowResults] = useState(false);
  const [editingEquation, setEditingEquation] = useState(true);
  const [tempEquation, setTempEquation] = useState("");
  const [initialValues, setInitialValues] = useState<{
    equation: string;
    x: string;
    dx: string;
    stoppingCriteria?: string;
    maxIterations: string;
    maxError: string;
  }>({
    equation: "",
    x: "",
    dx: "",
    maxIterations: "1000",
    maxError: "0.0000000000001",
  });

  useEffect(() => {
    setShowResults(false);
  }, [initialValues]);

  const Graph = useMemo(
    () =>
      initialValues.equation && initialValues.x ? (
        <FunctionPlot
          options={{
            xAxis: {
              domain: [
                Number(initialValues.x) - 6,
                Number(initialValues.x) + 6,
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
    [initialValues.equation, initialValues.x]
  );

  return (
    <main>
      <h1>Modified Secant Method</h1>
      <div className="text-block">
        <p>
          Rather than using two arbitrary values to estimate the derivative, an
          alternative approach involves a fractional perturbation dx of the
          independent variable - x, to estimate f(x).
        </p>
        <p className="text-block">
          This approximation yield the following iterative equation
        </p>
        <div className="text-block">
          <Image
            src="/images/modified-secant.png"
            alt="Modified Secant"
            width={466}
            height={112}
          />
        </div>
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
          <Input
            label="Start value - x"
            value={initialValues.x}
            onChange={(e) =>
              setInitialValues((v) => ({ ...v, x: e.target.value }))
            }
          />
        </div>
        <div className="text-block">
          <Input
            label="Perturbation - dx"
            value={initialValues.dx}
            onChange={(e) =>
              setInitialValues((v) => ({ ...v, dx: e.target.value }))
            }
          />
        </div>

        {initialValues.equation &&
          !editingEquation &&
          initialValues.x &&
          !isNaN(Number(initialValues.x)) &&
          initialValues.dx &&
          !isNaN(Number(initialValues.dx)) && (
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
      {showResults && <ComputationResults initialValues={initialValues} />}
    </main>
  );
}
