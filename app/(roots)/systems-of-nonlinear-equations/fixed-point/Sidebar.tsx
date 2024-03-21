/* eslint-disable react/no-unescaped-entities */
import { AnimatePresence, motion } from "framer-motion";
import { AiOutlineRollback } from "react-icons/ai";
import * as mathlive from "mathlive";
import "mathlive/static.css";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { latexToMathjs } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MathBlock, MathData, MathRow } from "@/components/ui/math";

type FPIterationSettings = {
  equation: string;
  latex: string;
  x: string;
  stoppingCriteria: "max_error" | "max_iterations";
  maxIterations: string;
  maxError: string;
};

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
    },
    L: {
      [key: string]: string;
    }
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
  const [governingEquations, setGoverningEquations] = useState<{
    [key: string]: string;
  }>({});
  const [latex, setLatex] = useState<{
    [key: string]: string;
  }>({});

  const mf = useRef<any>(null);

  const solve = () => {
    setInitialSettings(
      variablesList,
      initialValues,
      stoppingCriteria,
      governingEquations,
      latex
    );
  };

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

  const completeValues = useMemo(() => {
    if (!variablesString || !Boolean(variablesList.length)) return false;

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
    variablesString,
    governingEquations,
    initialValues,
    variablesList.length,
  ]);

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
            <h3 className="font-semibold mb-4">Fixed-Point Iteration</h3>
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
                  const vlist = e.target.value.replace(" ", "").split(",");
                  setVariablesList(vlist);
                }}
              />
            </div>

            <div className="space-y-3 mt-5">
              <h4 className="font-semibold mb-2">Governing Equations</h4>
              {variablesList.map((v) => (
                <div className="pb-3 overflow-hidden" key={v}>
                  <label
                    className="text-sm font-medium text-gray-900 whitespace-nowrap block mb-1"
                    // htmlFor={id}
                  >
                    <math>
                      <mrow>
                        <mtd>
                          <msub>
                            <mi>{v}</mi>
                            <mrow>
                              <mi>i</mi>
                              <mo>+</mo>
                              <mn>1</mn>
                            </mrow>
                          </msub>
                        </mtd>
                        <mtd>
                          <mo>=</mo>
                        </mtd>
                      </mrow>
                    </math>{" "}
                  </label>
                  <math-field
                    ref={mf}
                    onInput={(evt) => {
                      setGoverningEquations((s) => ({
                        ...s,
                        [`${v}`]: latexToMathjs(
                          (evt.target as HTMLInputElement).value
                        ),
                      }));
                      setLatex((s) => ({
                        ...s,
                        [`${v}`]: (evt.target as HTMLInputElement).value,
                      }));
                    }}
                    style={{
                      width: "100%",
                      maxWidth: "353px",
                    }}
                  >
                    {latex[v]}
                  </math-field>
                </div>
              ))}
            </div>
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
