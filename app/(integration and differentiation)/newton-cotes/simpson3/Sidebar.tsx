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

export type equationSettings = {
  dataType: "equation" | "data";
  equation: string;
  latex: string;
  a: string;
  b: string;
  n: string;
};

export const Sidebar = ({
  open,
  close,
  setInitialSettings,
  running,
  solve,
}: {
  open: boolean;
  close: () => void;
  setInitialSettings: (settings: equationSettings) => void;
  solve: any;
  running: boolean;
}) => {
  const [mode, setMode] = useState<"edit" | "visualize">("edit");
  const id = useId();
  const [settings, setSettings] = useState<equationSettings>({
    dataType: "equation",
    equation: "",
    latex: "",
    a: "",
    b: "",
    n: "1",
  });
  const mf = useRef<any>(null);

  const visualize = () => {
    setInitialSettings(settings);
    setMode("visualize");
  };

  const runComputation = () => {
    solve();
    setTimeout(() => {
      setMode("edit");
    }, 300);
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

  useEffect(() => {
    setMode("edit");
  }, [settings.a, settings.b, settings.n, settings.equation]);

  const valid =
    !isNaN(Number(settings.a)) &&
    !isNaN(Number(settings.b)) &&
    !isNaN(Number(settings.n)) &&
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
          <div className=" flex-1 w-full overflow-auto p-3">
            <h3 className="font-semibold mb-4 text-xl">
              The Simpson’s 3/8 Rule
            </h3>
            <div className="space-y-3 mt-8">
              <h4 className="font-semibold mb-4">Model</h4>
              <Tabs
                defaultValue={settings.dataType}
                // className="w-[400px]"
              >
                <TabsList className="w-fit">
                  <TabsTrigger
                    value="equation"
                    onClick={() =>
                      setSettings((s) => ({
                        ...s,
                        dataType: "equation",
                      }))
                    }
                  >
                    Equation
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() =>
                      setSettings((s) => ({
                        ...s,
                        dataType: "data",
                      }))
                    }
                    value="data"
                  >
                    Table/File
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              {settings.dataType == "equation" ? (
                <div className="py-3 overflow-hidden">
                  <label
                    className="text-sm font-medium text-gray-900 whitespace-nowrap block"
                    htmlFor={id}
                  >
                    f(x) =
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
              ) : (
                <div>Type of data</div>
              )}
            </div>

            <div className="space-y-3 mt-5">
              <h4 className="font-semibold mb-4">Boundaries</h4>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="email">a = </Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={settings.a}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      a: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="email">b = </Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={settings.b}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      b: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            {settings.dataType == "equation" ? (
              <div className="space-y-3 mt-8">
                <h4 className="font-semibold mb-4">Number of Divisions</h4>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="email">n = </Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={settings.n}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        n: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            ) : null}
            <div className="mt-8">
              {running ? (
                <Button
                  className="w-full"
                  disabled={true}
                  // onClick={runComputation}
                >
                  Running...
                </Button>
              ) : mode == "visualize" ? (
                <Button className="w-full" onClick={runComputation}>
                  Run Computation
                </Button>
              ) : (
                <Button
                  className="w-full"
                  disabled={!valid || running}
                  onClick={visualize}
                >
                  Visualize
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
