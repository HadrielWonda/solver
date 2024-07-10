import { AnimatePresence, motion } from "framer-motion";
import { AiOutlineRollback } from "react-icons/ai";
import { IoIosAdd } from "react-icons/io";
import * as mathlive from "mathlive";
import "mathlive/static.css";
import { useEffect, useId, useRef, useState } from "react";
import { latexToMathjs } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { run } from "node:test";
import { MdDeleteOutline } from "react-icons/md";

// export type equationSettings = {
//   dataType: "equation" | "data";
//   equation: string;
//   latex: string;
//   a: string;
//   b: string;
//   n: string;
// };

export type odeSysSettings = {
  equations: {
    equation: string;
    latex: string;
  }[];
  x1: string;
  x2: string;
  initialValues: string[];
  h: string;
};

export const Sidebar = ({
  open,
  close,
  setInitialSettings,
  running,
}: // solve,
{
  open: boolean;
  close: () => void;
  setInitialSettings: (settings: odeSysSettings) => void;
  // solve: any;
  running: boolean;
}) => {
  // const [mode, setMode] = useState<"edit" | "visualize">("edit");
  const id = useId();
  const [settings, setSettings] = useState<odeSysSettings>({
    equations: [
      {
        equation: "",
        latex: "",
      },
    ],
    x1: "",
    x2: "",
    initialValues: [""],
    h: "",
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
    !isNaN(Number(settings.x1)) &&
    !isNaN(Number(settings.x2)) &&
    settings.initialValues.every((v) => !isNaN(Number(v))) &&
    !isNaN(Number(settings.h)) &&
    settings.equations.every(
      (eq) => eq.equation.includes("x") || eq.equation.includes("y")
    );

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
              Third-Order Runge-Kutta Method
            </h3>
            <div className="space-y-3 mt-8">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">Differential Equations</h4>
                <Button
                  size="icon"
                  onClick={() => {
                    setSettings((s) => ({
                      ...s,
                      equations: [
                        ...s.equations,
                        {
                          equation: "",
                          latex: "",
                        },
                      ],
                      initialValues: [...s.initialValues, ""],
                    }));
                  }}
                >
                  <IoIosAdd size={24} />
                </Button>
              </div>

              <div>
                {settings.equations.map((eq, i) => (
                  <div className="pb-3 overflow-hidden flex gap-2" key={i}>
                    <label
                      className="text-base font-medium text-gray-900 whitespace-nowrap"
                      htmlFor={id}
                    >
                      <math>
                        <mfrac>
                          <mrow>
                            <mi>d</mi>
                            <msub>
                              <mi>y</mi>
                              <mn>{i + 1}</mn>
                            </msub>
                          </mrow>
                          <mrow>
                            <mi>d</mi>
                            <mi>x</mi>
                          </mrow>
                        </mfrac>
                      </math>{" "}
                      =
                    </label>
                    <math-field
                      ref={mf}
                      onInput={(evt) => {
                        const copy = [...settings.equations];
                        copy[i].latex = (evt.target as HTMLInputElement).value;
                        copy[i].equation = latexToMathjs(
                          (evt.target as HTMLInputElement).value
                        );
                        setSettings((s) => ({
                          ...s,
                          equations: copy,
                        }));
                      }}
                      style={{
                        width: "100%",
                        maxWidth: "353px",
                        flex: 1,
                      }}
                    >
                      {eq.latex}
                    </math-field>
                    {settings.equations.length > 1 && (
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => {
                          setSettings((s) => ({
                            ...s,
                            equations: s.equations.filter(
                              (_, index) => index !== i
                            ),
                            initialValues: s.initialValues.filter(
                              (_, index) => index !== i
                            ),
                          }));
                        }}
                      >
                        <MdDeleteOutline size={24} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 mt-8">
              <h4 className="font-semibold mb-3">Range (x)</h4>
              <div className="flex w-full max-w-sm items-center gap-1.5">
                <Input
                  type="number"
                  placeholder="0"
                  value={settings.x1}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      x1: e.target.value,
                    }))
                  }
                  className="flex-1"
                />
                <p>to</p>
                <Input
                  type="number"
                  placeholder="0"
                  value={settings.x2}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      x2: e.target.value,
                    }))
                  }
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-3 mt-8">
              <h4 className="font-semibold mb-3">
                initial values: at x = {settings.x1 ? settings.x1 : 0}
              </h4>
              {settings.initialValues.map((v, i) => (
                <div
                  className="flex w-full max-w-sm items-center gap-1.5"
                  key={i}
                >
                  <Label htmlFor="email">
                    <math>
                      <msub>
                        <mi>y</mi>
                        <mn>{i + 1}</mn>
                      </msub>
                    </math>
                  </Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={v}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        initialValues: s.initialValues.map((iv, index) =>
                          index === i ? e.target.value : iv
                        ),
                      }))
                    }
                  />
                </div>
              ))}
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
            </div>
            <div className="mt-8">
              <Button
                className="w-full"
                disabled={!valid || running}
                onClick={runComputation}
              >
                Run Computation
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
