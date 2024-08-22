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
  equationType: "heat" | "others";
  dimension: "1" | "2";
  k: string;
  x: string;
  dx: string;
  y: string;
  t: string;
  dt: string;
  equation: string;
  latex: string;
  T: string;
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
    equationType: "heat",
    equation: "",
    latex: "",
    dimension: "1",
    k: "",
    x: "",
    dx: "",
    y: "",
    t: "",
    dt: "",
    T: "",
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
    settings.k &&
    !isNaN(Number(settings.k)) &&
    settings.t &&
    !isNaN(Number(settings.t)) &&
    settings.dt &&
    settings.T &&
    !isNaN(Number(settings.T)) &&
    settings.dt &&
    !isNaN(Number(settings.dt)) &&
    settings.dx &&
    !isNaN(Number(settings.dx)) &&
    settings.x &&
    !isNaN(Number(settings.x)) &&
    (settings.dimension == "1" || (settings.y && !isNaN(Number(settings.y))));

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
              Parabolic Equations: Explicit Method
            </h3>
            <div className="space-y-3 mt-8">
              <h4 className="font-semibold mb-4">Differential Equation:</h4>
              <Tabs defaultValue={settings.equationType} className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger
                    value="heat"
                    onClick={() =>
                      setSettings((s) => ({
                        ...s,
                        equationType: "heat",
                      }))
                    }
                    className="flex-1"
                  >
                    Heat-Conduction Equation
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
                    className="flex-1"
                  >
                    Others
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              {settings.equationType == "heat" ? (
                <MathBlock>
                  <MathRow>
                    <MathData>
                      <mi>k</mi>
                      <mo>(</mo>
                      <mfrac>
                        <mi>ẟ²T</mi>
                        <mi>ẟx²</mi>
                      </mfrac>
                      <mo>+</mo>
                      <mfrac>
                        <mi>ẟ²T</mi>
                        <mi>ẟy²</mi>
                      </mfrac>
                      <mo>)</mo>
                    </MathData>
                    <MathData>
                      <mo>=</mo>
                    </MathData>
                    <MathData>
                      <mi>ρ</mi>
                      <msub>
                        <mi>c</mi>
                        <mi>p</mi>
                      </msub>
                      <mfrac>
                        <mi>∂T</mi>
                        <mi>∂t</mi>
                      </mfrac>
                    </MathData>
                  </MathRow>
                </MathBlock>
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
            <div className="space-y-3 ">
              {/* <h4 className="font-semibold mb-3"></h4> */}
              <div className="grid w-full max-w-sm items-center gap-1 mt-5">
                <Label htmlFor="email" className="font-medium">
                  <math>
                    <MathRow className="p-0">
                      <MathData>
                        <mi>λ</mi>
                      </MathData>
                      <MathData>
                        <mo>=</mo>
                      </MathData>
                      <MathData>
                        <mi>k</mi>
                        <mfrac>
                          <mi>Δt</mi>
                          <mrow>
                            <mi>Δx</mi>
                            <mo>²</mo>
                          </mrow>
                        </mfrac>
                        <mo>.</mo>
                        <mfrac>
                          <mn>1</mn>
                          <mrow>
                            <mi>ρ</mi>
                            <msub>
                              <mi>c</mi>
                              <mi>p</mi>
                            </msub>
                          </mrow>
                        </mfrac>
                      </MathData>
                    </MathRow>
                  </math>{" "}
                  =
                </Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={settings.k}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      k: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="space-y-3 mt-5">
              <h4 className="font-semibold mb-3">Time Dimension</h4>
              <div className="grid grid-cols-2 w-full max-w-sm gap-1.5">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">t (time) =</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={settings.t}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        t: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">Δt (step-size) =</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={settings.dt}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        dt: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
            <div className="space-y-3 mt-8">
              <h4 className="font-semibold mb-4">Spatial Dimensions:</h4>
              <Tabs defaultValue={settings.dimension} className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger
                    value="1"
                    onClick={() =>
                      setSettings((s) => ({
                        ...s,
                        dimension: "1",
                      }))
                    }
                    className="flex-1"
                  >
                    1-D
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() =>
                      setSettings((s) => ({
                        ...s,
                        dimension: "2",
                      }))
                    }
                    value="2"
                    className="flex-1"
                  >
                    2-D
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-3 mt-5">
              <div className="grid w-full max-w-sm gap-1.5 grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">X (length) =</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={settings.x}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        x: e.target.value,
                      }))
                    }
                  />
                </div>
                {settings.dimension == "1" ? (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="email">Δx (step-size) =</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={settings.dx}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          dx: e.target.value,
                        }))
                      }
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="email">Y (height) =</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={settings.y}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          y: e.target.value,
                        }))
                      }
                    />
                  </div>
                )}
              </div>
              {settings.dimension == "2" ? (
                <>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="email">Δx = Δy (step-size) =</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={settings.dx}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          dx: e.target.value,
                        }))
                      }
                    />
                  </div>
                </>
              ) : null}
            </div>

            <div className="space-y-3 mt-8">
              <h4 className="font-semibold mb-3">
                Initial Internal Temperature
              </h4>
              <div className="grid w-full max-w-sm gap-1.5">
                <Label htmlFor="email">At t = 0, T(x) =</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={settings.T}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      T: e.target.value,
                    }))
                  }
                />
              </div>
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
