"use client";
import Input from "@/components/Input";
import Radios from "@/components/Radios";
import React, { useEffect, useMemo, useState } from "react";
import { exprsCompiler } from "@/utils/compile";
import { Expression } from "expr-eval";
import { result } from "@/types";
import { bisection } from "@/lib/bisection";
import ComputationResults from "@/components/ComputationResults";

export default function Page() {
  const [showResults, setShowResults] = useState(false);
  const [editingEquation, setEditingEquation] = useState(true);
  const [tempEquation, setTempEquation] = useState("");
  const [initialValues, setInitialValues] = useState<{
    equation: string;
    xu: string;
    xl: string;
    stoppingCriteria?: string;
    maxIterations: string;
    maxError: string;
  }>({
    equation: "",
    xu: "",
    xl: "",
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
      <h1>False Position Method</h1>
      <section>
        <div className="block">
          {editingEquation ? (
            <Input
              label="Enter equation"
              value={tempEquation}
              onChange={(e) => setTempEquation(e.target.value)}
            />
          ) : (
            <Input
              label="Equation"
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
          <h3>Enter bracket value</h3>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <Input
              label="Xu (upper bound)"
              value={initialValues.xu}
              onChange={(e) =>
                setInitialValues((v) => ({ ...v, xu: e.target.value }))
              }
            />
            <Input
              label="Xl (lower bound)"
              value={initialValues.xl}
              onChange={(e) =>
                setInitialValues((v) => ({ ...v, xl: e.target.value }))
              }
            />
          </div>
        </div>

        {initialValues.xl &&
          initialValues.xu &&
          expression?.evaluate({ x: Number(initialValues.xl) }) *
            expression?.evaluate({ x: Number(initialValues.xu) }) <
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
            </>
          )}
      </section>
      {showResults && (
        <ComputationResults
          initialValues={initialValues}
          method="False-Position"
        />
      )}
    </main>
  );
}
