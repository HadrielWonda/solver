"use client";
import Input from "@/components/Input";
import Radios from "@/components/Radios";
import React, { useEffect, useMemo, useState } from "react";
import { exprsCompiler } from "@/utils/compile";
import Image from "next/image";
import SecantFormula from "@/public/images/secant.png";
// import ComputationResults from "./ComputationResults";
import { FunctionPlot } from "@/lib/graph/FunctionPlot";
import ComputationResults from "./ComputationResults";
// import ComputationResults from "./ComputationResults";

export default function Page() {
  const [showResults, setShowResults] = useState(false);
  const [editingEquation, setEditingEquation] = useState(true);
  const [tempEquation, setTempEquation] = useState("");
  const [initialValues, setInitialValues] = useState<{
    equation: string;
    x0: string;
    x1: string;
    stoppingCriteria?: string;
    maxIterations: string;
    maxError: string;
  }>({
    equation: "",
    x0: "",
    x1: "",
    maxIterations: "1000",
    maxError: "0.0000000000001",
  });

  useEffect(() => {
    setShowResults(false);
  }, [initialValues]);

  const Graph = useMemo(
    () =>
      initialValues.equation && initialValues.x0 && initialValues.x1 ? (
        <FunctionPlot
          options={{
            xAxis: {
              domain:
                Number(initialValues.x0) > Number(initialValues.x1)
                  ? [Number(initialValues.x1) - 6, Number(initialValues.x0) + 6]
                  : [
                      Number(initialValues.x0) - 6,
                      Number(initialValues.x1) + 6,
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
    [initialValues.equation, initialValues.x0, initialValues.x1]
  );

  return (
    <main>
      <h1>Secant Method</h1>
      <div className="block">
        <p>
          A potential problem in implementing the Newton-Raphson method is the
          evaluation of the derivative. In the secant method the derivative is
          approximated by a backward finite divided difference.
        </p>
        <p className="block">It is governed by the following formula</p>
        <div className="block">
          <Image src={SecantFormula} alt="Secant" />
        </div>
      </div>
      <section className="block">
        <div className="block">
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

        <div className="block">
          <Input
            label="Start value - x0"
            value={initialValues.x0}
            onChange={(e) =>
              setInitialValues((v) => ({ ...v, x0: e.target.value }))
            }
          />
        </div>
        <div className="block">
          <Input
            label="Start value - x1"
            value={initialValues.x1}
            onChange={(e) =>
              setInitialValues((v) => ({ ...v, x1: e.target.value }))
            }
          />
        </div>

        {initialValues.equation &&
          !editingEquation &&
          initialValues.x0 &&
          !isNaN(Number(initialValues.x0)) &&
          initialValues.x1 &&
          !isNaN(Number(initialValues.x1)) && (
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
      {showResults && (
        <div className="block">
          <h3>Graph of function around initial guess</h3>
          {Graph}
        </div>
      )}
      {showResults && <ComputationResults initialValues={initialValues} />}
    </main>
  );
}
