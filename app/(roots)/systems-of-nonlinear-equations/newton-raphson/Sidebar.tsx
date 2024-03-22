/* eslint-disable react/no-unescaped-entities */
import { AnimatePresence, motion } from "framer-motion";
import { AiOutlineRollback } from "react-icons/ai";
import * as mathlive from "mathlive";
import "mathlive/static.css";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { latexToMathjs } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MathBlock, MathData, MathField, MathRow } from "@/components/ui/math";
import { Switch } from "@/components/ui/switch";

type FPIterationSettings = {
  equation: string;
  latex: string;
  x: string;
  stoppingCriteria: "max_error" | "max_iterations";
  maxIterations: string;
  maxError: string;
};

const equationVaribleNames = [
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
];

export const Sidebar = ({
  open,
  close,
  setInitialSettings,
  running,
}: {
  open: boolean;
  close: () => void;
  setInitialSettings: (
    VL: string[],
    IV: {
      [key: string]: string;
    },
    SC: {
      stoppingCriteria?: string | undefined;
      maxIterations: string;
      maxError: string;
    },
    GE: {
      [key: string]: string;
    }[],
    L: {
      [key: string]: string;
    }[],
    AD: boolean
  ) => void;
  running: boolean;
}) => {
  const [variablesString, setVariablesString] = useState<string>("");
  const [variablesList, setVariablesList] = useState<string[]>([]);
  const [initialValues, setInitialValues] = useState<{ [key: string]: string }>(
    {}
  );
  const [stoppingCriteria, setStoppingCriteria] = useState<{
    stoppingCriteria: "max_error" | "max_iterations";
    maxIterations: string;
    maxError: string;
  }>({
    stoppingCriteria: "max_iterations",
    maxIterations: "1000",
    maxError: "0.0000000000001",
  });
  const [governingEquations, setGoverningEquations] = useState<
    {
      [key: string]: string;
    }[]
  >([]);
  const [latex, setLatex] = useState<
    {
      [key: string]: string;
    }[]
  >([]);
  const [autoDifferentiate, setAutoDifferentiate] = useState(false);

  const solve = () => {
    setInitialSettings(
      variablesList,
      initialValues,
      stoppingCriteria,
      governingEquations,
      latex,
      autoDifferentiate
    );
  };

  const mf = useRef<any>(null);
  // Customize the mathfield when it is created
  useEffect(() => {
    if (mf.current) {
      mf.current.mathVirtualKeyboardPolicy = "manual";
      mf.current.addEventListener("focusin", () =>
        window.mathVirtualKeyboard.show()
      );
      mf.current.addEventListener("focusout", () =>
        window.mathVirtualKeyboard.hide()
      );
      mf.current.menuItems = [];
      mf.current.mathVirtualKeyboardPolicy = "manual";
      mf.current.addEventListener("focusin", () =>
        window.mathVirtualKeyboard.show()
      );
      mf.current.addEventListener("focusout", () =>
        window.mathVirtualKeyboard.hide()
      );
    }
  }, []);

  const availableEquationVariableNames = useMemo(
    () => equationVaribleNames.filter((v) => !variablesList.includes(v)),
    [variablesList]
  );

  const completeValues = useMemo(() => {
    if (!variablesString || !Boolean(variablesList.length)) return false;

    if (
      !governingEquations.every((item) =>
        Object.entries(item).every(([_, value]) => value !== "")
      )
    )
      return false;
    if (
      Object.entries(initialValues).every(([_, value]) => !isNaN(Number(value)))
    ) {
      return true;
    } else {
      return false;
    }
  }, [
    variablesString,
    governingEquations,
    initialValues,
    variablesList.length,
  ]);

  console.log("latex", latex);

  // useEffect(() => {
  //   first

  //   return () => {
  //     second
  //   }
  // }, [va])

  return (
    <AnimatePresence mode="wait" initial={false}>
      {open && (
        <motion.div
          {...framerSidebarPanel}
          className="top-0 bottom-0 left-0 z-50 flex flex-col w-full h-screen max-w-[380px] border-r-2 border-borderColor bg-white"
          aria-label="Sidebar"
        >
          <div className="flex w-full items-center justify-between p-3 border-b-2 border-borderColor">
            <span>Control Panel</span>
            <button
              onClick={close}
              className="p-3 border-2 border-borderColor rounded-xl"
              aria-label="close sidebar"
            >
              <AiOutlineRollback />
            </button>
          </div>
          <div className=" flex-1 w-full overflow-auto p-3 pb-4">
            <h3 className="font-semibold mb-4">Newton-Raphson Method</h3>
            <div className="mt-3 grid w-full max-w-sm items-center gap-1.5">
              {/* <h4 className="font-semibold mb-4">
                List all the independent variables seperated by comma ','. e.g:
                x, y, z.
              </h4> */}
              <Label htmlFor="email">
                List all the independent variables seperated by comma ','. e.g:
                x, y, z.
              </Label>
              <Input
                type="text"
                placeholder="x, y"
                value={variablesString}
                onChange={(e) => {
                  setVariablesString(e.target.value);
                  const vlist = e.target.value
                    .replace(" ", "")
                    .split(",")
                    .filter(Boolean);
                  const basic: {
                    [key: string]: string;
                  } = {
                    eqn: "",
                  };
                  vlist.forEach((v) => {
                    basic[v] = "";
                  });
                  const value: {
                    [key: string]: string;
                  }[] = [];
                  vlist.forEach((v) => {
                    value.push({ ...basic });
                  });
                  // value[0]["eqn"] = "asdf";
                  // console.log("value", value);

                  setGoverningEquations([...JSON.parse(JSON.stringify(value))]);
                  setLatex([...JSON.parse(JSON.stringify(value))]);
                  setVariablesList(vlist);
                }}
              />
            </div>

            <div className="flex items-center gap-4 mt-4">
              <h4 className="font-semibold">Auto Differentiate:</h4>
              <Switch
                id="autoDifferentiate"
                checked={autoDifferentiate}
                onCheckedChange={(v) => setAutoDifferentiate(v)}
              />
            </div>

            {variablesList.length ? (
              <div className="space-y-3 mt-5">
                <h4 className="font-semibold mb-2">Equations</h4>
                {!autoDifferentiate
                  ? variablesList.map((vi, i) => (
                      <VariableParameters
                        latex={latex}
                        setLatex={setLatex}
                        governingEquations={governingEquations}
                        setGoverningEquations={setGoverningEquations}
                        variablesList={variablesList}
                        i={i}
                        key={vi}
                      />
                    ))
                  : variablesList.map((v, i) => (
                      <div className="pb-3 overflow-hidden" key={v}>
                        <label
                          className="text-sm font-medium text-gray-900 whitespace-nowrap block mb-1"
                          // htmlFor={id}
                        >
                          {`${
                            availableEquationVariableNames[i]
                          }(${variablesList.join(", ")}) = 0 =`}
                        </label>
                        <math-field
                          ref={mf}
                          onInput={(evt) => {
                            const eqns = [
                              ...JSON.parse(JSON.stringify(governingEquations)),
                            ];
                            eqns[i]["eqn"] = latexToMathjs(
                              (evt.target as HTMLInputElement).value
                            );
                            setGoverningEquations(eqns);
                            setLatex((s) => {
                              const eqns = [...JSON.parse(JSON.stringify(s))];
                              eqns[i]["eqn"] = (
                                evt.target as HTMLInputElement
                              ).value;
                              return eqns;
                            });
                          }}
                          style={{
                            width: "100%",
                            maxWidth: "353px",
                          }}
                        >
                          {latex[i]["eqn"]}
                        </math-field>
                      </div>
                    ))}
              </div>
            ) : null}

            {variablesList.length ? (
              <div className="space-y-3 mt-5">
                <h4 className="font-semibold mb-4">Initial Values</h4>
                {variablesList.map((v) => (
                  <div
                    className="grid w-full max-w-sm items-center gap-1.5"
                    key={v}
                  >
                    <Label htmlFor="email">{v}</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={initialValues[v]}
                      onChange={(e) =>
                        setInitialValues((s) => ({
                          ...s,
                          [`${v}`]: e.target.value,
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            ) : null}

            <div className="space-y-3 mt-8">
              <h4 className="font-semibold mb-4">Stopping Criterion</h4>
              <Tabs
                defaultValue={stoppingCriteria.stoppingCriteria}
                // className="w-[400px]"
              >
                <TabsList className="w-fit">
                  <TabsTrigger
                    value="max_iterations"
                    onClick={() =>
                      setStoppingCriteria((s) => ({
                        ...s,
                        stoppingCriteria: "max_iterations",
                      }))
                    }
                  >
                    Iteration Count
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() =>
                      setStoppingCriteria((s) => ({
                        ...s,
                        stoppingCriteria: "max_error",
                      }))
                    }
                    value="max_error"
                  >
                    Absolute Relative Error
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              {stoppingCriteria.stoppingCriteria == "max_iterations" ? (
                <Input
                  type="number"
                  placeholder="1000"
                  value={stoppingCriteria.maxIterations}
                  onChange={(e) =>
                    setStoppingCriteria((s) => ({
                      ...s,
                      maxIterations: e.target.value,
                    }))
                  }
                />
              ) : (
                <Input
                  type="number"
                  placeholder="0.00001"
                  value={stoppingCriteria.maxError}
                  onChange={(e) =>
                    setStoppingCriteria((s) => ({
                      ...s,
                      maxError: e.target.value,
                    }))
                  }
                />
              )}
            </div>
            <div className="mt-8">
              <Button
                className="w-full"
                disabled={!completeValues || running}
                onClick={solve}
              >
                Start Computation
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const framerSidebarPanel = {
  initial: { x: "-100%" },
  animate: { x: 0 },
  exit: { x: "-100%" },
  transition: { duration: 0.3 },
};

const VariableParameters = ({
  variablesList,
  i,
  latex,
  setLatex,
  governingEquations,
  setGoverningEquations,
}: {
  variablesList: string[];
  i: number;
  latex: {
    [key: string]: string;
  }[];
  setLatex: Dispatch<
    SetStateAction<
      {
        [key: string]: string;
      }[]
    >
  >;
  governingEquations: {
    [key: string]: string;
  }[];
  setGoverningEquations: Dispatch<
    SetStateAction<
      {
        [key: string]: string;
      }[]
    >
  >;
}) => {
  const availableEquationVariableNames = useMemo(
    () => equationVaribleNames.filter((v) => !variablesList.includes(v)),
    [variablesList]
  );

  return (
    <div className="pb-3 overflow-hidden space-y-2">
      <h3>
        Equation {i + 1}:{" "}
        {`${availableEquationVariableNames[i]}(${variablesList.join(", ")})`}{" "}
      </h3>
      <div className="pb-1 overflow-hidden">
        <MathField
          label={`${availableEquationVariableNames[i]}(${variablesList.join(
            ", "
          )}) = 0 =`}
          onInput={(evt) => {
            setGoverningEquations((s) => {
              const eqns = [...JSON.parse(JSON.stringify(s))];
              let lv = (evt.target as HTMLInputElement).value;
              let tlv = latexToMathjs(lv);
              console.log("values", lv, tlv);
              eqns[i]["eqn"] = tlv;
              console.log("transformedEqns", eqns);
              return eqns;
            });
            setLatex((s) => {
              const eqns = [...JSON.parse(JSON.stringify(s))];
              eqns[i]["eqn"] = (evt.target as HTMLInputElement).value;
              return eqns;
            });
          }}
        >
          {latex[i]["eqn"]}
        </MathField>
      </div>
      {variablesList.map((v, j) => (
        <div className="pb-1 overflow-hidden" key={`${v}${i}`}>
          <MathField
            label={`ẟ${availableEquationVariableNames[i]}/ẟ${v} =`}
            onInput={(evt) => {
              setGoverningEquations((s) => {
                const eqns = [...JSON.parse(JSON.stringify(s))];
                eqns[i][v] = latexToMathjs(
                  (evt.target as HTMLInputElement).value
                );
                return eqns;
              });
              setLatex((s) => {
                const eqns = [...s];
                eqns[i][v] = (evt.target as HTMLInputElement).value;
                return eqns;
              });
            }}
            style={{
              width: "100%",
              maxWidth: "353px",
            }}
          >
            {latex[i][v]}
          </MathField>
        </div>
      ))}
    </div>
  );
};
