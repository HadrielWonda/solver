import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AiOutlineRollback } from "react-icons/ai";
import { FaPlus } from "react-icons/fa6";
import { Switch } from "@/components/ui/switch";
import {
  AccordionTrigger,
  AccordionContent,
  AccordionItem,
  Accordion,
} from "@/components/ui/accordion";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { FunctionPlotProps } from "@/lib/graph/FunctionPlot";

type Checked = DropdownMenuCheckboxItemProps["checked"];

export const Sidebar = ({
  open,
  close,
  options,
  setOptions,
}: {
  open: boolean;
  close: () => void;
  options: FunctionPlotProps["options"];
  setOptions: React.Dispatch<
    React.SetStateAction<FunctionPlotProps["options"]>
  >;
}) => {
  const [settings, setSettings] = useState<{
    functions: never[];
  }>({
    functions: [],
  });

  const [showStatusBar, setShowStatusBar] = useState<Checked>(true);
  const [showActivityBar, setShowActivityBar] = useState<Checked>(false);
  const [showPanel, setShowPanel] = useState<Checked>(false);

  return (
    <AnimatePresence mode="wait" initial={false}>
      {open && (
        <motion.div
          {...framerSidebarPanel}
          className="top-0 bottom-0 left-0 z-50 w-full h-screen max-w-xs border-r-2 border-zinc-800 bg-white"
          // ref={ref}
          aria-label="Sidebar"
        >
          <div className="flex items-center justify-between p-3 border-b-2 border-zinc-800">
            <span>Control Panel</span>
            <button
              onClick={close}
              className="p-3 border-2 border-zinc-800 rounded-xl"
              aria-label="close sidebar"
            >
              <AiOutlineRollback />
            </button>
          </div>
          <div className="mt-3 mx-3">
            <div className="flex items-center">
              <label
                className="text-sm font-medium text-gray-900"
                htmlFor="toggleGrid"
              >
                Show Grid:
              </label>
              <Switch
                id="toggleGrid"
                checked={options?.grid}
                onCheckedChange={(v) => setOptions((s) => ({ ...s, grid: v }))}
              />
            </div>
            <div className="flex items-center mt-3">
              <label
                className="text-sm font-medium text-gray-900"
                htmlFor="toggleGrid"
              >
                Show Tip:
              </label>
              <Switch
                id="toggleTip"
                checked={Boolean(options?.tip)}
                onCheckedChange={(v) =>
                  setOptions((s) => ({
                    ...s,
                    tip: v
                      ? {
                          xLine: true,
                          yLine: true,
                        }
                      : undefined,
                  }))
                }
              />
            </div>

            <div className="my-8">
              <h3 className="text-base font-semibold">Axis Scale Type</h3>
              <div className="flex items-center mt-4">
                <label
                  className="text-sm font-medium text-gray-900"
                  htmlFor="xAxisType"
                >
                  X-axis:
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="ml-2 flex-1"
                    id="xAxisType"
                    asChild
                  >
                    <Button
                      variant="outline"
                      className="flex-1 min-w-56 flex justify-between items-center"
                    >
                      <span>{options?.xAxis?.type}</span>

                      <ChevronDownIcon className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuCheckboxItem
                      checked={options?.xAxis?.type == "linear"}
                      onCheckedChange={(v) =>
                        v &&
                        setOptions((s) => ({
                          ...s,
                          xAxis: { type: "linear" },
                        }))
                      }
                    >
                      Linear
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={options?.xAxis?.type == "log"}
                      onCheckedChange={(v) =>
                        v &&
                        setOptions((s) => ({ ...s, xAxis: { type: "log" } }))
                      }
                    >
                      Log
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center mt-4">
                <label
                  className="text-sm font-medium text-gray-900"
                  htmlFor="yAxisType"
                >
                  Y-axis:
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="ml-2 flex-1"
                    id="yAxisType"
                    asChild
                  >
                    <Button
                      variant="outline"
                      className="flex-1 min-w-56 flex justify-between items-center"
                    >
                      <span>{options?.yAxis?.type}</span>

                      <ChevronDownIcon className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuCheckboxItem
                      checked={options?.yAxis?.type == "linear"}
                      onCheckedChange={(v) =>
                        v &&
                        setOptions((s) => ({
                          ...s,
                          yAxis: { type: "linear" },
                        }))
                      }
                    >
                      Linear
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={options?.yAxis?.type == "log"}
                      onCheckedChange={(v) =>
                        v &&
                        setOptions((s) => ({ ...s, yAxis: { type: "log" } }))
                      }
                    >
                      Log
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center mx-3 py-4">
              <h3 className="text-base font-semibold">Functions</h3>
              <button
                onClick={close}
                className="p-3 border-2 border-zinc-800 rounded-xl"
                aria-label="close sidebar"
              >
                <FaPlus />
              </button>
            </div>
            <Separator />
            <Accordion collapsible type="single">
              <FunctionBlock />
              <FunctionBlock />
            </Accordion>
          </div>
          {/*
          <ul>
            {items.map((item, idx) => {
              const { title, href, Icon } = item;
              return (
                <li key={title}>
                  <a
                    onClick={close}
                    href={href}
                    className="flex items-center justify-between gap-5 p-5 transition-all border-b-2 hover:bg-grey border-zinc-800"
                  >
                    <motion.span {...framerText(idx)}>{title}</motion.span>
                    <motion.div {...framerIcon}>
                      <Icon className="text-2xl" />
                    </motion.div>
                  </a>
                </li>
              );
            })}
          </ul> */}
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

const FunctionBlock = () => {
  const id = useId();
  const [settings, setSettings] = useState<{
    equationType?: string;
    graphType: "interval" | "scatter" | "polyline";
  }>({
    graphType: "interval",
  });

  const mf = useRef<any>(null);
  const [value, setValue] = useState("");

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

  return (
    <AccordionItem value={id}>
      <AccordionTrigger className="px-3 py-2 flex items-center justify-between cursor-pointer">
        <h3 className="text-base font-semibold">Function 1</h3>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 px-3">
          <div className="flex items-center mt-4">
            <label className="text-sm font-medium text-gray-900" htmlFor={id}>
              Equation Type:
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger className="ml-2 flex-1" id={id} asChild>
                <Button
                  variant="outline"
                  className="flex-1 min-w-56 flex justify-between items-center"
                >
                  <span>{settings.equationType ?? "Single variable"}</span>

                  <ChevronDownIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuCheckboxItem
                  checked={settings.equationType == undefined}
                  onCheckedChange={(v) =>
                    v && setSettings((s) => ({ ...s, equationType: undefined }))
                  }
                >
                  Single varible: y = f(x)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={settings.equationType == "implicit"}
                  onCheckedChange={(v) =>
                    v &&
                    setSettings((s) => ({ ...s, equationType: "implicit" }))
                  }
                >
                  Implicit: f(x,y) = 0
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={settings.equationType == "parametric"}
                  onCheckedChange={(v) =>
                    v &&
                    setSettings((s) => ({ ...s, equationType: "parametric" }))
                  }
                >
                  Parametric: r = f(r0,θ,a,γ)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={settings.equationType == "polar"}
                  onCheckedChange={(v) =>
                    v && setSettings((s) => ({ ...s, equationType: "polar" }))
                  }
                >
                  Polar: r = f(θ)
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center mt-4">
            <label className="text-sm font-medium text-gray-900" htmlFor={id}>
              Graph Type:
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger className="ml-2 flex-1" id={id} asChild>
                <Button
                  variant="outline"
                  className="flex-1 min-w-56 flex justify-between items-center"
                >
                  <span>{settings.graphType}</span>

                  <ChevronDownIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuCheckboxItem
                  checked={settings.graphType == "interval"}
                  onCheckedChange={(v) =>
                    v && setSettings((s) => ({ ...s, graphType: "interval" }))
                  }
                >
                  Interval
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={settings.graphType == "scatter"}
                  onCheckedChange={(v) =>
                    v && setSettings((s) => ({ ...s, graphType: "scatter" }))
                  }
                >
                  Scatter
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={settings.graphType == "polyline"}
                  onCheckedChange={(v) =>
                    v && setSettings((s) => ({ ...s, graphType: "polyline" }))
                  }
                >
                  Polyline
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex gap-3 items-center">
            <label className="text-sm font-medium text-gray-900" htmlFor={id}>
              f(x) =
            </label>
            <math-field
              ref={mf}
              onInput={(evt) =>
                setValue((evt.target as HTMLInputElement).value)
              }
            >
              {value}
            </math-field>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

function ChevronDownIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
