import { AnimatePresence, motion } from "framer-motion";
import { AiOutlineRollback } from "react-icons/ai";
import * as mathlive from "mathlive";
import "mathlive/static.css";
import { useEffect, useId, useRef, useState } from "react";
import { latexToMathjs } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { run } from "node:test";
import { MathBlock, MathData, MathRow } from "@/components/ui/math";

// export type equationSettings = {
//   dataType: "equation" | "data";
//   equation: string;
//   latex: string;
//   a: string;
//   b: string;
//   n: string;
// };

export type pdeSettings = {
  equationType: "laplace" | "poisson" | "others";
  // type: "forward" | "backward" | "central";
  // order: "1" | "2" | "3" | "4";
  equation: string;
  latex: string;
  n: {
    x: string;
    y: string;
  };
  stoppingCriteria: "max_error" | "max_iterations";
  maxIterations: string;
  maxError: string;
  overRelaxation: string;
  // x_0: string;
  // x_L: string;
  // y_0: string;
  // y_L: string;
  // h: string;
};

export const Sidebar = ({
  open,
  close,
  setInitialSettings,
  running,
  mode,
  setMode,
}: // solve,
{
  open: boolean;
  close: () => void;
  setInitialSettings: (settings: pdeSettings) => void;
  // solve: any;
  running: boolean;
  mode: "edit" | "set";
  setMode: (mode: "edit" | "set") => void;
}) => {
  const id = useId();
  const [settings, setSettings] = useState<pdeSettings>({
    equationType: "laplace",
    equation: "",
    latex: "",
    n: {
      x: "",
      y: "",
    },
    stoppingCriteria: "max_iterations",
    maxIterations: "1000",
    maxError: "0.0001",
    overRelaxation: "1",
    // x_0: "",
    // x_L: "",
    // y_0: "",
    // y_L: "",
    // h: "",
  });
  const mf = useRef<any>(null);

  const runComputation = () => {
    setInitialSettings(settings);
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

  const valid =
    settings.n.x &&
    !isNaN(Number(settings.n.x)) &&
    settings.n.y &&
    !isNaN(Number(settings.n.y)) &&
    settings.overRelaxation &&
    !isNaN(Number(settings.overRelaxation)) &&
    !isNaN(Number(settings.maxError)) &&
    !isNaN(Number(settings.maxIterations));

  // const valDiv =
  //   valid &&
  //   Number.isInteger(
  //     (Number(settings.x_L) - Number(settings.x_0)) / Number(settings.h)
  //   );

  useEffect(() => {
    setMode("edit");
  }, [setMode, settings]);

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
          <div className=" flex-1 w-full overflow-auto p-3">
            <h3 className="font-semibold mb-4 text-xl">
              Finite Difference: Elliptic Equations
            </h3>
            <div className="space-y-3 mt-8">
              <h4 className="font-semibold mb-4">Differential Equation:</h4>
              <Tabs
                defaultValue={settings.equationType}
                // className="w-[400px]"
              >
                <TabsList className="w-fit">
                  <TabsTrigger
                    value="laplace"
                    onClick={() =>
                      setSettings((s) => ({
                        ...s,
                        equationType: "laplace",
                      }))
                    }
                  >
                    Laplace
                  </TabsTrigger>
                  <TabsTrigger
                    value="poisson"
                    onClick={() =>
                      setSettings((s) => ({
                        ...s,
                        equationType: "poisson",
                      }))
                    }
                    disabled
                  >
                    Poisson
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() =>
                      setSettings((s) => ({
                        ...s,
                        equationType: "others",
                      }))
                    }
                    value="others"
                    disabled
                  >
                    Others
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              {settings.equationType == "laplace" ? (
                <MathBlock>
                  <MathRow>
                    <MathData>
                      <mfrac>
                        <mrow>
                          <msup>
                            <mi>d</mi>
                            <mn>2</mn>
                          </msup>
                          <mi>T</mi>
                        </mrow>
                        <mrow>
                          <mi>d</mi>
                          <msup>
                            <mi>x</mi>
                            <mn>2</mn>
                          </msup>
                        </mrow>
                      </mfrac>
                      <mo>+</mo>
                      <mfrac>
                        <mrow>
                          <msup>
                            <mi>d</mi>
                            <mn>2</mn>
                          </msup>
                          <mi>T</mi>
                        </mrow>
                        <mrow>
                          <mi>d</mi>
                          <msup>
                            <mi>y</mi>
                            <mn>2</mn>
                          </msup>
                        </mrow>
                      </mfrac>
                    </MathData>
                    <MathData>
                      <mo>=</mo>
                    </MathData>
                    <MathData>
                      <mn>0</mn>
                    </MathData>
                  </MathRow>
                </MathBlock>
              ) : settings.equationType == "poisson" ? (
                <>
                  <MathBlock>
                    <MathRow>
                      <MathData>
                        <mfrac>
                          <mrow>
                            <msup>
                              <mi>d</mi>
                              <mn>2</mn>
                            </msup>
                            <mi>T</mi>
                          </mrow>
                          <mrow>
                            <mi>d</mi>
                            <msup>
                              <mi>x</mi>
                              <mn>2</mn>
                            </msup>
                          </mrow>
                        </mfrac>
                        <mo>+</mo>
                        <mfrac>
                          <mrow>
                            <msup>
                              <mi>d</mi>
                              <mn>2</mn>
                            </msup>
                            <mi>T</mi>
                          </mrow>
                          <mrow>
                            <mi>d</mi>
                            <msup>
                              <mi>y</mi>
                              <mn>2</mn>
                            </msup>
                          </mrow>
                        </mfrac>
                      </MathData>
                      <MathData>
                        <mo>=</mo>
                      </MathData>
                      <MathData>
                        <mo>f</mo>
                        <mo>(</mo>
                        <mi>x,</mi>
                        <mi> y</mi>
                        <mo>)</mo>
                      </MathData>
                    </MathRow>
                  </MathBlock>
                  <div className="pb-3 overflow-hidden">
                    <label
                      className="text-sm font-medium text-gray-900 whitespace-nowrap block"
                      htmlFor={id}
                    >
                      f(x, y) =
                    </label>
                    <math-field
                      ref={mf}
                      onInput={(evt) =>
                        setSettings((s) => ({
                          ...s,
                          equation: latexToMathjs(
                            (evt.target as HTMLInputElement).value
                          ),
                          latex: (evt.target as HTMLInputElement).value,
                        }))
                      }
                      style={{
                        width: "100%",
                        maxWidth: "353px",
                      }}
                    >
                      {settings.latex}
                    </math-field>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-500">
                    <MathBlock className="m-0">
                      <MathRow>
                        <MathData>
                          <mi>T</mi>
                        </MathData>
                        <MathData>
                          <mo>=</mo>
                        </MathData>
                        <MathData>
                          <mi>T</mi>
                        </MathData>
                      </MathRow>
                      <MathRow>
                        <MathData>
                          <mi>y</mi>
                        </MathData>
                        <MathData>
                          <mo>=</mo>
                        </MathData>
                        <MathData>
                          <mi>y</mi>
                        </MathData>
                      </MathRow>
                      <MathRow>
                        <MathData>
                          <mi>x</mi>
                        </MathData>
                        <MathData>
                          <mo>=</mo>
                        </MathData>
                        <MathData>
                          <mi>x</mi>
                        </MathData>
                      </MathRow>
                      <MathRow>
                        <MathData>
                          <mfrac>
                            <mi>dT</mi>
                            <mi>dx</mi>
                          </mfrac>
                        </MathData>
                        <MathData>
                          <mo>=</mo>
                        </MathData>
                        <MathData>
                          <mi>Tx</mi>
                        </MathData>
                        <MathData>
                          <ms>, </ms>
                        </MathData>
                        <MathData>
                          <mfrac>
                            <mi>dT</mi>
                            <mi>dy</mi>
                          </mfrac>
                        </MathData>
                        <MathData>
                          <mo>=</mo>
                        </MathData>
                        <MathData>
                          <mi>Ty</mi>
                        </MathData>
                      </MathRow>
                      <MathRow>
                        <MathData>
                          <mfrac>
                            <mrow>
                              <msup>
                                <mi>d</mi>
                                <mn>2</mn>
                              </msup>
                              <mi>T</mi>
                            </mrow>
                            <mrow>
                              <mi>d</mi>
                              <msup>
                                <mi>x</mi>
                                <mn>2</mn>
                              </msup>
                            </mrow>
                          </mfrac>
                        </MathData>
                        <MathData>
                          <mo>=</mo>
                        </MathData>
                        <MathData>
                          <mi>Tx2</mi>
                        </MathData>
                        <MathData>
                          <ms>, </ms>
                        </MathData>
                        <MathData>
                          <mfrac>
                            <mrow>
                              <msup>
                                <mi>d</mi>
                                <mn>2</mn>
                              </msup>
                              <mi>T</mi>
                            </mrow>
                            <mrow>
                              <mi>d</mi>
                              <msup>
                                <mi>y</mi>
                                <mn>2</mn>
                              </msup>
                            </mrow>
                          </mfrac>
                        </MathData>
                        <MathData>
                          <mo>=</mo>
                        </MathData>
                        <MathData>
                          <mi>Ty2</mi>
                        </MathData>
                      </MathRow>
                    </MathBlock>
                  </p>
                  <div className="pb-3 overflow-hidden">
                    <label
                      className="text-sm font-medium text-gray-900 whitespace-nowrap block"
                      htmlFor={id}
                    >
                      f(T, x, y) = 0 =
                    </label>
                    <math-field
                      ref={mf}
                      onInput={(evt) =>
                        setSettings((s) => ({
                          ...s,
                          equation: latexToMathjs(
                            (evt.target as HTMLInputElement).value
                          ),
                          latex: (evt.target as HTMLInputElement).value,
                        }))
                      }
                      style={{
                        width: "100%",
                        maxWidth: "353px",
                      }}
                    >
                      {settings.latex}
                    </math-field>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-3 mt-5">
              {settings.equationType == "laplace" ? (
                <>
                  <h4 className="font-semibold mb-3">Number of inner nodes</h4>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="email">along x</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={settings.n.x}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          n: { y: s.n.y, x: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="email">along y</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={settings.n.y}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          n: { x: s.n.x, y: e.target.value },
                        }))
                      }
                    />
                  </div>
                </>
              ) : null}
            </div>
            {/* <div className="space-y-3 mt-5">
              <h4 className="font-semibold mb-3">Range - y</h4>
              <div className="flex w-full max-w-sm items-center gap-1.5">
                <Input
                  type="number"
                  placeholder="0"
                  value={settings.y_0}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      y_0: e.target.value,
                    }))
                  }
                  className="flex-1"
                />
                <p>to</p>
                <Input
                  type="number"
                  placeholder="0"
                  value={settings.y_L}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      y_L: e.target.value,
                    }))
                  }
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-3 mt-7">
              <h4 className="font-semibold mb-3">Step Size</h4>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="email">h = </Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={settings.h}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      h: e.target.value,
                    }))
                  }
                />
              </div>
            </div> */}

            <div className="space-y-3 mt-8">
              <h4 className="font-semibold mb-4">
                Overelaxation value ( 1 - 2)
              </h4>

              <Input
                type="number"
                placeholder="1"
                value={settings.overRelaxation}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    overRelaxation: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-3 mt-8">
              <h4 className="font-semibold mb-4">Stopping Criterion</h4>
              <Tabs
                defaultValue={settings.stoppingCriteria}
                // className="w-[400px]"
              >
                <TabsList className="w-fit">
                  <TabsTrigger
                    value="max_iterations"
                    onClick={() =>
                      setSettings((s) => ({
                        ...s,
                        stoppingCriteria: "max_iterations",
                      }))
                    }
                  >
                    Iteration Count
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() =>
                      setSettings((s) => ({
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
              {settings.stoppingCriteria == "max_iterations" ? (
                <Input
                  type="number"
                  placeholder="1000"
                  value={settings.maxIterations}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      maxIterations: e.target.value,
                    }))
                  }
                />
              ) : (
                <Input
                  type="number"
                  placeholder="0.00001"
                  value={settings.maxError}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      maxError: e.target.value,
                    }))
                  }
                />
              )}
            </div>

            <div className="mt-8">
              {/* {valid && settings.h && !valDiv ? (
                <p className="text-red-500">
                  Invalid step size: length must be divisible by step size with
                  no remainder
                </p>
              ) : null} */}
              {mode == "edit" && (
                <Button
                  className="w-full"
                  disabled={!valid || running}
                  onClick={runComputation}
                >
                  Continue
                </Button>
              )}
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
