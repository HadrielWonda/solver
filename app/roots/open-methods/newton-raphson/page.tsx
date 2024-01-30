"use client";
import Input from "@/components/Input";
import Radios from "@/components/Radios";
import React, { useEffect, useMemo, useState } from "react";
import { exprsCompiler } from "@/utils/compile";
import Image from "next/image";
import NewtonRaphsonFormula from "@/public/images/newton-raphson.png";
import ComputationResults from "./ComputationResults";
import { FunctionPlot } from "@/lib/graph/FunctionPlot";
// import ComputationResults from "./ComputationResults";

export default function Page() {
  const [showResults, setShowResults] = useState(false);
  const [editingEquation, setEditingEquation] = useState(true);
  const [tempEquation, setTempEquation] = useState("");
  const [editingDerivativeEquation, setEditingDerivativeEquation] =
    useState(true);
  const [tempDerivativeEquation, setTempDerivativeEquation] = useState("");
  const [initialValues, setInitialValues] = useState<{
    equation: string;
    derivativeEquation: string;
    start: string;
    stoppingCriteria?: string;
    maxIterations: string;
    maxError: string;
  }>({
    equation: "",
    derivativeEquation: "",
    start: "",
    maxIterations: "1000",
    maxError: "0.0000000000001",
  });

  useEffect(() => {
    setShowResults(false);
  }, [initialValues]);

  const Graph = useMemo(
    () =>
      initialValues.equation && initialValues.start ? (
        <FunctionPlot
          options={{
            xAxis: {
              domain: [
                Number(initialValues.start) - 6,
                Number(initialValues.start) + 6,
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
    [initialValues.equation, initialValues.start]
  );

  return (
    <main>
      <h1>Newton-Raphson Method</h1>
      <div className="block">
        <p>
          While the Newton-Raphson is the most widely used of all root-locating
          formulas and is often very efficient, there are situations where it
          performs poorly. A special case is a region of
          <span className="bold">multiple roots</span>.
        </p>
        <p className="block">It is governed by the following formula</p>
        <div className="block">
          <Image src={NewtonRaphsonFormula} alt="Newton Raphson" />
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
          {editingDerivativeEquation ? (
            <Input
              label="Enter equation derivative - f'(x)"
              value={tempDerivativeEquation}
              onChange={(e) => setTempDerivativeEquation(e.target.value)}
            />
          ) : (
            <Input
              label="Equation derivative - f'(x)"
              value={initialValues.derivativeEquation}
              disabled={true}
              // onChange={(e) =>
              //   setInitialValues((v) => ({ ...v, equation: e.target.value }))
              // }
            />
          )}
          {editingDerivativeEquation ? (
            <div
              style={{
                marginTop: "0.8rem",
                display: "flex",
                gap: "1rem",
              }}
            >
              <button
                onClick={() => {
                  setInitialValues((v) => ({
                    ...v,
                    derivativeEquation: tempDerivativeEquation,
                  }));
                  setEditingDerivativeEquation(false);
                }}
              >
                Save
              </button>
              <button
                onClick={() => {
                  setTempDerivativeEquation(initialValues.derivativeEquation);
                  setEditingDerivativeEquation(false);
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
              onClick={() => setEditingDerivativeEquation(true)}
            >
              <button>Edit</button>
            </div>
          )}
        </div>

        <div className="block">
          <Input
            label="Start value - x"
            value={initialValues.start}
            onChange={(e) =>
              setInitialValues((v) => ({ ...v, start: e.target.value }))
            }
          />
        </div>

        {initialValues.equation &&
          initialValues.derivativeEquation &&
          !editingEquation &&
          !editingDerivativeEquation &&
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
