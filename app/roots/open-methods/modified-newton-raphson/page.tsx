/* eslint-disable react/no-unescaped-entities */
"use client";
import Input from "@/components/Input";
import Radios from "@/components/Radios";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
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
  const [editingSecondDerivativeEquation, setEditingSecondDerivativeEquation] =
    useState(true);
  const [tempSecondDerivativeEquation, setTempSecondDerivativeEquation] =
    useState("");
  const [initialValues, setInitialValues] = useState<{
    equation: string;
    derivativeEquation: string;
    secondDerivativeEquation: string;
    start: string;
    stoppingCriteria?: string;
    maxIterations: string;
    maxError: string;
  }>({
    equation: "",
    derivativeEquation: "",
    secondDerivativeEquation: "",
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
      <h1>Modified Newton-Raphson Method for Multiple Roots</h1>
      <div className="block">
        <p>
          A problem with Newton-Raphson Method is related to the fact that not
          only f(x) but also f'(x) goes to zero at the root. This poses problems
          for the method, which contain the derivative (or its estimate) in the
          denominator of its formula. This could result in division by zero when
          the solution converges very close to the root.
          <span className="bold">multiple roots</span>.
        </p>
        <p>
          An alternative, suggested by Ralston and Rabinowitz (1978), is to
          define a new function u(x), that is, the ratio of the function to its
          derivative, as in
        </p>
        <p>
          It can be shown that this function has roots at all the same locations
          as the original function. Therefore, can be substituted into method to
          develop an alternative form of the Newton-Raphson method:
        </p>
        <div className="block">
          <Image
            src="/images/modified-newton-raphson.png"
            alt="Newton Raphson"
            width={324}
            height={130}
          />
        </div>
        <p className="block">And the result simplified to yield</p>
        <div className="block">
          <Image
            src="/images/modified-newton-raphson2.png"
            alt="Newton Raphson"
            width={570}
            height={124}
          />
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
          {editingSecondDerivativeEquation ? (
            <Input
              label="Enter equation second derivative - f''(x)"
              value={tempSecondDerivativeEquation}
              onChange={(e) => setTempSecondDerivativeEquation(e.target.value)}
            />
          ) : (
            <Input
              label="Equation second derivative - f''(x)"
              value={initialValues.secondDerivativeEquation}
              disabled={true}
              // onChange={(e) =>
              //   setInitialValues((v) => ({ ...v, equation: e.target.value }))
              // }
            />
          )}
          {editingSecondDerivativeEquation ? (
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
                    secondDerivativeEquation: tempSecondDerivativeEquation,
                  }));
                  setEditingSecondDerivativeEquation(false);
                }}
              >
                Save
              </button>
              <button
                onClick={() => {
                  setTempSecondDerivativeEquation(
                    initialValues.secondDerivativeEquation
                  );
                  setEditingSecondDerivativeEquation(false);
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
              onClick={() => setEditingSecondDerivativeEquation(true)}
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
