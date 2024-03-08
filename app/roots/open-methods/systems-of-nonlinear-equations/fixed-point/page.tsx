/* eslint-disable react/no-unescaped-entities */
"use client";
import Input from "@/components/Input";
import Radios from "@/components/Radios";
import React, { useEffect, useMemo, useState } from "react";
import ComputationResults from "./ComputationResults";

export default function Page() {
  const [showResults, setShowResults] = useState(false);
  const [editingVariables, setEditingVariables] = useState(true);
  const [tempVariablesString, setTempVariablesString] = useState("");
  const [variablesString, setVariablesString] = useState("");
  const [variablesList, setVariablesList] = useState<string[]>([]);
  const [initialValues, setInitialValues] = useState<{ [key: string]: string }>(
    {}
  );
  const [stoppingCriteria, setStoppingCriteria] = useState<{
    stoppingCriteria?: string;
    maxIterations: string;
    maxError: string;
  }>({
    maxIterations: "1000",
    maxError: "0.0000000000001",
  });
  const [governingEquations, setGoverningEquations] = useState<{
    [key: string]: string;
  }>({});

  const completeValues = useMemo(() => {
    if (editingVariables || !Boolean(variablesList.length)) return false;

    if (!Object.entries(governingEquations).every(([_, value]) => value !== ""))
      return false;
    if (
      Object.entries(initialValues).every(([_, value]) => !isNaN(Number(value)))
    ) {
      return true;
    } else {
      return false;
    }
  }, [
    editingVariables,
    governingEquations,
    initialValues,
    variablesList.length,
  ]);

  useEffect(() => {
    setShowResults(false);
  }, [initialValues, governingEquations, stoppingCriteria]);

  return (
    <main>
      <h1>Fixed-Point Iteration Method</h1>
      <div className="text-block">
        <p>
          Create your governing equations for every independent variable (x &
          y), by changing subject of the equations{" "}
          <span className="bold">u(x, y), v(x, y)</span> so we have at least one
          equation defining every independent variable.
        </p>
        {/* <p className="text-block bold">x = g(x)</p> */}

        <div className="text-block">
          <p>Examples</p>
          <div className="indent">
            <p>
              x<sup>2</sup> + xy = 10 ---- i
            </p>
            <p>
              y + 3xy<sup>2</sup> = 57 ---- ii
            </p>
          </div>
          <div className="text-block indent">
            <p>Governing equations:</p>
            <p>
              x = (10 - x<sup>2</sup>) / y
            </p>
            <p>
              y = 57 - 3xy<sup>2</sup>
            </p>
          </div>
        </div>

        <div className="text-block">
          <span className="bold">NB: </span> Not all sets of governing equations
          will converge. Sometimes you'll need to try out all possible sets of
          governing equations to find the converging set.
        </div>
      </div>
      <section className="text-block">
        <div className="text-block">
          {editingVariables ? (
            <Input
              label="List all the independent variables seperated by comma ','. e.g: x, y, z."
              value={tempVariablesString}
              onChange={(e) => setTempVariablesString(e.target.value)}
            />
          ) : (
            <Input
              label="Independent variables"
              value={variablesString}
              disabled={true}
              // onChange={(e) =>
              //   setInitialValues((v) => ({ ...v, equation: e.target.value }))
              // }
            />
          )}
          {editingVariables ? (
            <div
              style={{
                marginTop: "0.8rem",
                display: "flex",
                gap: "1rem",
              }}
            >
              <button
                onClick={() => {
                  const vlist = tempVariablesString.replace(" ", "").split(",");
                  setVariablesString(tempVariablesString);
                  setVariablesList(vlist);
                  setGoverningEquations(() => {
                    const eqns: {
                      [key: string]: string;
                    } = {};
                    for (const variable of vlist) {
                      eqns[variable] = "";
                    }
                    return eqns;
                  });
                  setInitialValues(() => {
                    const eqns: {
                      [key: string]: string;
                    } = {};
                    for (const variable of vlist) {
                      eqns[variable] = "";
                    }
                    return eqns;
                  });
                  setEditingVariables(false);
                }}
              >
                Save
              </button>
              <button
                onClick={() => {
                  setTempVariablesString(variablesString);
                  setEditingVariables(false);
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
              onClick={() => setEditingVariables(true)}
            >
              <button>Edit</button>
            </div>
          )}
        </div>
        {!editingVariables && variablesList.length && (
          <>
            <div className="text-block">
              <p className="text-block">
                Input governing equations for all independent variables
              </p>
              {variablesList.map((variable) => (
                <div className="text-block" key={variable}>
                  <Input
                    label={`${variable} = `}
                    value={governingEquations[`${variable}`]}
                    onChange={(e) =>
                      setGoverningEquations((eqns) => ({
                        ...eqns,
                        [`${variable}`]: e.target.value,
                      }))
                    }
                  />
                </div>
              ))}
            </div>
            <div className="text-block">
              <p className="text-block">
                Input initial value for all independent variables
              </p>
              {variablesList.map((variable) => (
                <div className="text-block" key={variable}>
                  <Input
                    label={`${variable}0 = `}
                    value={initialValues[`${variable}`]}
                    onChange={(e) =>
                      setInitialValues((vals) => ({
                        ...vals,
                        [`${variable}`]: e.target.value,
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {completeValues && (
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
              selectedOption={stoppingCriteria.stoppingCriteria}
              setSelectedOption={(option) =>
                setStoppingCriteria((v) => ({
                  ...v,
                  stoppingCriteria: option.value,
                }))
              }
            />
            {stoppingCriteria.stoppingCriteria == "max_iterations" ? (
              <>
                <div className="text-block">
                  <Input
                    label="Max number of iterations"
                    value={stoppingCriteria.maxIterations}
                    onChange={(e) =>
                      setStoppingCriteria((v) => ({
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
            ) : stoppingCriteria.stoppingCriteria == "max_error" ? (
              <div className="text-block">
                <Input
                  label="Max absolute % relative error - |ea|"
                  value={stoppingCriteria.maxError}
                  onChange={(e) =>
                    setStoppingCriteria((v) => ({
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
        <ComputationResults
          values={{
            variablesList,
            governingEquations,
            initialValues,
            stoppingCriteria,
          }}
        />
      )}
    </main>
  );
}
