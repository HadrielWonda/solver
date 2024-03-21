/* eslint-disable react/no-unescaped-entities */
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
import { MathBlock, MathData, MathRow } from "@/components/ui/math";

type iterationSettings = {
  equation: string;
  equationLatex: string;
  derivativeEquation: string;
  derivativeLatex: string;
  secondDerivativeEquation: string;
  secondDerivativeLatex: string;
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
    settings: {
      equation: string;
      derivativeEquation: string;
      secondDerivativeEquation: string;
      start: string;
      stoppingCriteria?: string;
      maxIterations: string;
      maxError: string;
    },
    latex: {
      equation: string;
      derivative: string;
      secondDerivative: string;
    }
  ) => void;
  running: boolean;
}) => {
  const [mode, setMode] = useState<"edit" | "solve">("edit");
  const id = useId();
  const [settings, setSettings] = useState<iterationSettings>({
    equation: "",
    equationLatex: "",
    derivativeEquation: "",
    derivativeLatex: "",
    secondDerivativeEquation: "",
    secondDerivativeLatex: "",
    x: "",
    stoppingCriteria: "max_iterations",
    maxIterations: "1000",
    maxError: "0.0000000000001",
  });
  const mf = useRef<any>(null);

  const solve = () => {
    setInitialSettings(
      {
        equation: settings.equation,
        derivativeEquation: settings.derivativeEquation,
        secondDerivativeEquation: settings.secondDerivativeEquation,
        start: settings.x,
        stoppingCriteria: settings.stoppingCriteria,
        maxError: settings.maxError,
        maxIterations: settings.maxIterations,
      },
      {
        equation: settings.equationLatex,
        derivative: settings.derivativeLatex,
        secondDerivative: settings.secondDerivativeLatex,
      }
    );
    setMode("solve");
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
    !isNaN(Number(settings.x)) &&
    !isNaN(Number(settings.maxIterations)) &&
    !isNaN(Number(settings.maxError)) &&
    settings.equation.includes("x");

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
          <div className=" flex-1 w-full overflow-auto p-3 pb-8">
            <h3 className="font-semibold mb-4">
              Modified Newton-Raphson Method for Multiple Roots
            </h3>
            <div className="py-3 overflow-hidden">
              <label
                className="text-sm font-medium text-gray-900 whitespace-nowrap block mb-1"
                htmlFor={id}
              >
                Equation: f(x)
              </label>
              <math-field
                ref={mf}
                onInput={(evt) =>
                  setSettings((s) => ({
                    ...s,
                    equation: latexToMathjs(
                      (evt.target as HTMLInputElement).value
                    ),
                    equationLatex: (evt.target as HTMLInputElement).value,
                  }))
                }
                style={{
                  width: "100%",
                  maxWidth: "353px",
                }}
              >
                {settings.equationLatex}
              </math-field>
            </div>
            <div className="py-3 overflow-hidden">
              <label
                className="text-sm font-medium text-gray-900 whitespace-nowrap block mb-1"
                htmlFor={id}
              >
                Derivative: f'(x)
              </label>
              <math-field
                ref={mf}
                onInput={(evt) =>
                  setSettings((s) => ({
                    ...s,
                    derivativeEquation: latexToMathjs(
                      (evt.target as HTMLInputElement).value
                    ),
                    derivativeLatex: (evt.target as HTMLInputElement).value,
                  }))
                }
                style={{
                  width: "100%",
                  maxWidth: "353px",
                }}
              >
                {settings.derivativeLatex}
              </math-field>
            </div>
            <div className="py-3 overflow-hidden">
              <label
                className="text-sm font-medium text-gray-900 whitespace-nowrap block mb-1"
                htmlFor={id}
              >
                Second Derivative: f''(x)
              </label>
              <math-field
                ref={mf}
                onInput={(evt) =>
                  setSettings((s) => ({
                    ...s,
                    secondDerivativeEquation: latexToMathjs(
                      (evt.target as HTMLInputElement).value
                    ),
                    secondDerivativeLatex: (evt.target as HTMLInputElement)
                      .value,
                  }))
                }
                style={{
                  width: "100%",
                  maxWidth: "353px",
                }}
              >
                {settings.secondDerivativeLatex}
              </math-field>
            </div>
            <div className="space-y-3 mt-5">
              <h4 className="font-semibold mb-4">Iteration Parameters</h4>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="email">Start: xi = </Label>
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
              <Button
                className="w-full"
                disabled={!valid || running}
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