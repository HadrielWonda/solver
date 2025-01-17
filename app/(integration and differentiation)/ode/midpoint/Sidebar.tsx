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

// export type equationSettings = {
//   dataType: "equation" | "data";
//   equation: string;
//   latex: string;
//   a: string;
//   b: string;
//   n: string;
// };

export type eulerSettings = {
  // dataType: "equation" | "data";
  // type: "forward" | "backward" | "central";
  // order: "1" | "2" | "3" | "4";
  equation: string;
  latex: string;
  x1: string;
  x2: string;
  y1: string;
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
  setInitialSettings: (settings: eulerSettings) => void;
  // solve: any;
  running: boolean;
}) => {
  // const [mode, setMode] = useState<"edit" | "visualize">("edit");
  const id = useId();
  const [settings, setSettings] = useState<eulerSettings>({
    // dataType: "equation",
    // type: "forward",
    // order: "1",
    equation: "",
    latex: "",
    x1: "",
    x2: "",
    y1: "",
    h: "",
  });
  const mf = useRef<any>(null);

  const runComputation = () => {
    setInitialSettings({
      ...settings,
      equation: latexToMathjs(settings.latex),
    });
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
    !isNaN(Number(settings.y1)) &&
    !isNaN(Number(settings.h)) &&
    settings.latex.includes("x");

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
            <h3 className="font-semibold mb-4 text-xl">The Midpoint Method</h3>
            <div className="space-y-3 mt-8">
              <h4 className="font-semibold mb-2">Differential Equation</h4>
              <div className="pb-3 overflow-hidden">
                <label
                  className="text-sm font-medium text-gray-900 whitespace-nowrap block"
                  htmlFor={id}
                >
                  dy/dx = f`(x) =
                </label>
                <math-field
                  ref={mf}
                  onInput={(evt) =>
                    setSettings((s) => ({
                      ...s,
                      // equation: latexToMathjs(
                      //   (evt.target as HTMLInputElement).value
                      // ),
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
            </div>

            {/* <div className="space-y-3 mt-8">
              <h4 className="font-semibold mb-4">Order</h4>
              <Tabs
                defaultValue={settings.order}
                // className="w-[400px]"
              >
                <TabsList className="w-fit">
                  <TabsTrigger
                    value="1"
                    onClick={() =>
                      setSettings((s) => ({
                        ...s,
                        order: "1",
                      }))
                    }
                  >
                    First
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() =>
                      setSettings((s) => ({
                        ...s,
                        order: "2",
                      }))
                    }
                    value="2"
                  >
                    Second
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() =>
                      setSettings((s) => ({
                        ...s,
                        order: "3",
                      }))
                    }
                    value="3"
                  >
                    Third
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() =>
                      setSettings((s) => ({
                        ...s,
                        order: "4",
                      }))
                    }
                    value="4"
                  >
                    Fourth
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div> */}

            {/* <div className="space-y-3 mt-8">
              <h4 className="font-semibold mb-4">Mode</h4>
              <Tabs
                defaultValue={settings.type}
                // className="w-[400px]"
              >
                <TabsList className="w-fit">
                  <TabsTrigger
                    value="forward"
                    onClick={() =>
                      setSettings((s) => ({
                        ...s,
                        type: "forward",
                      }))
                    }
                  >
                    Forward
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() =>
                      setSettings((s) => ({
                        ...s,
                        type: "central",
                      }))
                    }
                    value="central"
                  >
                    Central
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() =>
                      setSettings((s) => ({
                        ...s,
                        type: "backward",
                      }))
                    }
                    value="backward"
                  >
                    Backward
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div> */}

            <div className="space-y-3 mt-5">
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
            <div className="space-y-3 mt-7">
              <h4 className="font-semibold mb-3">initial value</h4>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="email">
                  at x = {settings.x1 ? settings.x1 : 0}, y =
                </Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={settings.y1}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      y1: e.target.value,
                    }))
                  }
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
