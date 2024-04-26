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
import { latexToMathjs } from "@/lib/utils";
import * as mathlive from "mathlive";
import "mathlive/static.css";
import { v4 as uuid } from "uuid";
import functionPlot from "function-plot";
import { Input } from "../ui/input";

type Checked = DropdownMenuCheckboxItemProps["checked"];
type functionSetting =
  | {
      fnType?: "linear";
      graphType: "interval" | "scatter" | "polyline";
      fn: string;
      latex: string;
      id: string;
      color: string;
    }
  | {
      fnType: "implicit";
      graphType: "interval" | "scatter" | "polyline";
      fn: string;
      latex: string;
      id: string;
      color: string;
    }
  | {
      fnType: "parametric";
      graphType: "polyline";
      x: string;
      y: string;
      xLatex: string;
      yLatex: string;
      id: string;
      color: string;
    }
  | {
      fnType: "polar";
      graphType: "polyline";
      r: string;
      rLatex: string;
      scope: { a: number; r0: number; gamma: number };
      id: string;
      color: string;
    };

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
  const colors = functionPlot.globals.COLORS;
  const functionList: functionSetting[] =
    (options?.data as functionSetting[]) ?? [];
  console.log("functionList", functionList);
  const updateFunction = (v: functionSetting, id: string) => {
    setOptions((o) => ({
      ...o,
      data: o?.data?.map((i) => ((i as functionSetting).id == id ? v : i)),
    }));
  };
  const deleteFunction = (id: string) => {
    setOptions((o) => ({
      ...o,
      data: o?.data?.filter((i) => (i as functionSetting).id !== id),
    }));
  };
  const addFunction = () => {
    const id = uuid();
    const newFunctionList = [
      ...functionList,
      {
        graphType: "interval",
        fn: "",
        latex: "",
        id,
        color: colors[functionList.length].formatHex(),
      } as functionSetting,
    ];
    setOptions((o) => ({ ...o, data: newFunctionList }));
  };

  // console.log("options", options);

  return (
    <AnimatePresence mode="wait" initial={false}>
      {open && (
        <motion.div
          {...framerSidebarPanel}
          className="top-0 bottom-0 left-0 z-50 flex flex-col w-full h-screen max-w-xs border-r-2 border-borderColor bg-white"
          // ref={ref}
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
          <div className=" flex-1 w-full overflow-auto">
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
                  onCheckedChange={(v) =>
                    setOptions((s) => ({ ...s, grid: v }))
                  }
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
                        className="flex-1 min-w-52 flex justify-between items-center"
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
                        className="flex-1 min-w-52 flex justify-between items-center"
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
                  onClick={addFunction}
                  className="p-3 border-2 border-borderColor rounded-xl"
                  aria-label="close sidebar"
                >
                  <FaPlus />
                </button>
              </div>
              <Separator />
              <Accordion
                collapsible
                type="single"
                // defaultValue={functionList[functionList.length - 1].id}
              >
                {functionList.map((f) => (
                  <FunctionBlock
                    key={f.id}
                    id={f.id}
                    initialSetting={f}
                    updateSetting={(v) => updateFunction(v, f.id)}
                    deleteFunction={() => deleteFunction(f.id)}
                  />
                ))}
              </Accordion>
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

const FunctionBlock = ({
  initialSetting,
  updateSetting,
  deleteFunction,
  id,
}: {
  initialSetting: functionSetting;
  updateSetting: (v: functionSetting) => void;
  deleteFunction: () => void;
  id: string;
}) => {
  const [mode, setMode] = useState<"view" | "edit">(
    (!initialSetting.fnType && initialSetting.fn) ||
      (initialSetting.fnType == "linear" && initialSetting.fn) ||
      (initialSetting.fnType == "implicit" && initialSetting.fn) ||
      (initialSetting.fnType == "parametric" && initialSetting.x)
      ? "view"
      : "edit"
  );
  const [settings, setSettings] = useState<functionSetting>({
    ...initialSetting,
  });
  console.log("initialSetting", initialSetting);
  console.log("settings", settings);

  const mf = useRef<any>(null);
  // const [value, setValue] = useState("");

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

  // console.log("colorString", colorString);

  return (
    <AccordionItem value={id}>
      <AccordionTrigger className="px-3 py-2 flex items-center justify-between cursor-pointer w-full">
        <h3 className="flex flex-1 items-center text-base font-semibold overflow-hidden">
          <div
            className={`w-4 h-4 mr-3`}
            style={{
              backgroundColor: settings.color,
            }}
          ></div>
          {(!settings.fnType && settings.fn) ||
          (settings.fnType == "linear" && settings.fn) ? (
            <div className="flex flex-1 overflow-hidden text-ellipsis">
              <span className="whitespace-nowrap">f(x) = </span>
              <span
                dangerouslySetInnerHTML={{
                  __html: mathlive.convertLatexToMarkup(settings.latex),
                }}
              />
            </div>
          ) : settings.fnType == "implicit" && settings.fn ? (
            <div className="flex flex-1 overflow-hidden text-ellipsis">
              <span className="whitespace-nowrap">f(x, y) = 0 = </span>
              <span
                dangerouslySetInnerHTML={{
                  __html: mathlive.convertLatexToMarkup(settings.latex),
                }}
              />
            </div>
          ) : settings.fnType == "polar" && settings.r ? (
            <div className="flex-1 overflow-hidden">
              <div className="flex gap-2 flex-1 overflow-hidden text-ellipsis">
                <span className="whitespace-nowrap">r(r0, θ, a, γ) = </span>
                <span
                  dangerouslySetInnerHTML={{
                    __html: mathlive.convertLatexToMarkup(settings.rLatex),
                  }}
                  style={{
                    textOverflow: "ellipsis",
                  }}
                />
              </div>
            </div>
          ) : settings.fnType == "parametric" && settings.x ? (
            <div className="flex-1 overflow-hidden">
              <div className="flex gap-2 flex-1 overflow-hidden text-ellipsis">
                <span className="whitespace-nowrap">x(t) = </span>
                <span
                  dangerouslySetInnerHTML={{
                    __html: mathlive.convertLatexToMarkup(settings.xLatex),
                  }}
                  style={{
                    textOverflow: "ellipsis",
                  }}
                />
              </div>
              <div className="flex gap-2 flex-1 overflow-hidden text-ellipsis">
                <span className="whitespace-nowrap">y(t) = </span>
                <span
                  dangerouslySetInnerHTML={{
                    __html: mathlive.convertLatexToMarkup(settings.yLatex),
                  }}
                />
              </div>
            </div>
          ) : (
            "function"
          )}
        </h3>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 px-3">
          {mode == "view" ? (
            <>
              <div className="flex gap-3 items-center mt-4">
                <label
                  className="text-sm font-medium text-gray-900"
                  htmlFor={id}
                >
                  Equation Type:
                </label>
                <span>
                  {settings.fnType == "linear"
                    ? "Single variable"
                    : settings.fnType}
                </span>
              </div>
              <div className="flex gap-3 items-center mt-4">
                <label
                  className="text-sm font-medium text-gray-900"
                  htmlFor={id}
                >
                  Graph Type:
                </label>
                <span>{settings.graphType}</span>
              </div>
              {!settings.fnType || settings.fnType == "linear" ? (
                <div className="flex gap-3 items-center">
                  <label
                    className="text-sm font-medium text-gray-900 whitespace-nowrap"
                    htmlFor={id}
                  >
                    f(x) =
                  </label>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: mathlive.convertLatexToMarkup(settings.latex),
                    }}
                  />
                </div>
              ) : settings.fnType == "implicit" ? (
                <div className="flex gap-3 items-center">
                  <label
                    className="text-sm font-medium text-gray-900 whitespace-nowrap"
                    htmlFor={id}
                  >
                    f(x, y) = 0 =
                  </label>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: mathlive.convertLatexToMarkup(settings.latex),
                    }}
                  />
                  {/* r = f(r0,θ,a,γ) */}
                </div>
              ) : settings.fnType == "parametric" ? (
                <>
                  <div className="flex gap-3 items-center">
                    <label
                      className="text-sm font-medium text-gray-900 whitespace-nowrap"
                      htmlFor={id}
                    >
                      x(t) =
                    </label>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: mathlive.convertLatexToMarkup(settings.xLatex),
                      }}
                    />
                  </div>
                  <div className="flex gap-3 items-center">
                    <label
                      className="text-sm font-medium text-gray-900 whitespace-nowrap"
                      htmlFor={id}
                    >
                      y(t) =
                    </label>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: mathlive.convertLatexToMarkup(settings.yLatex),
                      }}
                    />
                  </div>
                </>
              ) : settings.fnType == "polar" ? (
                <>
                  <h3>
                    Where θ is the polar angle, a is the radius of the circle
                    with center (r0,γ)
                  </h3>
                  <div className="flex gap-3 items-center">
                    <label
                      className="text-sm font-medium text-gray-900 whitespace-nowrap"
                      htmlFor={id}
                    >
                      r(r0, θ, a, γ) =
                    </label>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: mathlive.convertLatexToMarkup(settings.rLatex),
                      }}
                    />
                  </div>
                  <div className="flex gap-3 items-center">
                    <label
                      className="text-sm font-medium text-gray-900 whitespace-nowrap"
                      htmlFor={id}
                    >
                      a =
                    </label>
                    <div>{settings.scope.a}</div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <label
                      className="text-sm font-medium text-gray-900 whitespace-nowrap"
                      htmlFor={id}
                    >
                      r0 =
                    </label>
                    <div>{settings.scope.r0}</div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <label
                      className="text-sm font-medium text-gray-900 whitespace-nowrap"
                      htmlFor={id}
                    >
                      γ =
                    </label>
                    <div>{settings.scope.gamma}</div>
                  </div>
                </>
              ) : null}
              <div className="flex gap-3 items-center mt-3">
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() => setMode("edit")}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => deleteFunction()}
                >
                  Delete
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center mt-4">
                <label
                  className="text-sm font-medium text-gray-900"
                  htmlFor={id}
                >
                  Equation Type:
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger className="ml-2 flex-1" id={id} asChild>
                    <Button
                      variant="outline"
                      className="flex-1 min-w-52 flex justify-between items-center"
                    >
                      <span>
                        {settings.fnType == "linear"
                          ? "Single variable"
                          : settings.fnType}
                      </span>

                      <ChevronDownIcon className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuCheckboxItem
                      checked={settings.fnType == undefined}
                      onCheckedChange={(v) =>
                        v &&
                        setSettings((s) =>
                          !s.fnType || s.fnType == "linear"
                            ? {
                                fnType: undefined,
                                graphType: s.graphType,
                                fn: s.fn,
                                latex: s.latex,
                                id: s.id,
                                color: s.color,
                              }
                            : {
                                fnType: undefined,
                                graphType: s.graphType,
                                fn: "",
                                latex: "",
                                id: s.id,
                                color: s.color,
                              }
                        )
                      }
                    >
                      Single varible: y = f(x)
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={settings.fnType == "implicit"}
                      onCheckedChange={(v) =>
                        v &&
                        setSettings((s) =>
                          !s.fnType ||
                          s.fnType == "linear" ||
                          s.fnType == "implicit"
                            ? {
                                fnType: "implicit",
                                graphType: s.graphType,
                                fn: s.fn,
                                latex: s.latex,
                                id: s.id,
                                color: s.color,
                              }
                            : {
                                fnType: "implicit",
                                graphType: s.graphType,
                                fn: "",
                                latex: "",
                                id: s.id,
                                color: s.color,
                              }
                        )
                      }
                    >
                      Implicit: f(x,y) = 0
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={settings.fnType == "parametric"}
                      onCheckedChange={(v) =>
                        v &&
                        setSettings((s) =>
                          s.fnType !== "parametric"
                            ? {
                                fnType: "parametric",
                                graphType: "polyline",
                                x: "",
                                xLatex: "",
                                y: "",
                                yLatex: "",
                                id: s.id,
                                color: s.color,
                              }
                            : s
                        )
                      }
                    >
                      Parametric: x(t), y(t)
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={settings.fnType == "polar"}
                      onCheckedChange={(v) =>
                        v &&
                        setSettings((s) =>
                          s.fnType !== "polar"
                            ? {
                                fnType: "polar",
                                graphType: "polyline",
                                r: "",
                                rLatex: "",
                                scope: {
                                  a: 1,
                                  r0: 0,
                                  gamma: 0,
                                },
                                id: s.id,
                                color: s.color,
                              }
                            : s
                        )
                      }
                    >
                      Polar: r(r0,θ,a,γ)
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center mt-4">
                <label
                  className="text-sm font-medium text-gray-900"
                  htmlFor={id}
                >
                  Graph Type:
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger className="ml-2 flex-1" id={id} asChild>
                    <Button
                      variant="outline"
                      className="flex-1 min-w-52 flex justify-between items-center"
                    >
                      <span>{settings.graphType}</span>

                      <ChevronDownIcon className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuCheckboxItem
                      checked={settings.graphType == "interval"}
                      onCheckedChange={(v) =>
                        v &&
                        setSettings(
                          (s) =>
                            ({ ...s, graphType: "interval" } as functionSetting)
                        )
                      }
                      disabled={
                        settings.fnType == "parametric" ||
                        settings.fnType == "polar"
                      }
                    >
                      Interval
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={settings.graphType == "scatter"}
                      onCheckedChange={(v) =>
                        v &&
                        setSettings(
                          (s) =>
                            ({ ...s, graphType: "scatter" } as functionSetting)
                        )
                      }
                      disabled={
                        settings.fnType == "parametric" ||
                        settings.fnType == "polar"
                      }
                    >
                      Scatter
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={settings.graphType == "polyline"}
                      onCheckedChange={(v) =>
                        v &&
                        setSettings((s) => ({ ...s, graphType: "polyline" }))
                      }
                    >
                      Polyline
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {!settings.fnType || settings.fnType == "linear" ? (
                <div className="flex gap-3 items-center">
                  <label
                    className="text-sm font-medium text-gray-900 whitespace-nowrap"
                    htmlFor={id}
                  >
                    f(x) =
                  </label>
                  <math-field
                    ref={mf}
                    onInput={(evt) =>
                      setSettings((s) => ({
                        ...s,
                        fn: latexToMathjs(
                          (evt.target as HTMLInputElement).value
                        ),
                        latex: (evt.target as HTMLInputElement).value,
                      }))
                    }
                    style={{
                      flexGrow: 1,
                      maxWidth: "220px",
                    }}
                  >
                    {settings.latex}
                  </math-field>
                </div>
              ) : settings.fnType == "implicit" ? (
                <div className="flex gap-3 items-center">
                  <label
                    className="text-sm font-medium text-gray-900 whitespace-nowrap"
                    htmlFor={id}
                  >
                    f(x, y) = 0 =
                  </label>
                  <math-field
                    ref={mf}
                    onInput={(evt) =>
                      setSettings((s) => ({
                        ...s,
                        fn: latexToMathjs(
                          (evt.target as HTMLInputElement).value
                        ),
                        latex: (evt.target as HTMLInputElement).value,
                      }))
                    }
                    style={{
                      flexGrow: 1,
                      maxWidth: "220px",
                    }}
                  >
                    {settings.latex}
                  </math-field>
                </div>
              ) : settings.fnType == "parametric" ? (
                <>
                  <div className="flex gap-3 items-center">
                    <label
                      className="text-sm font-medium text-gray-900 whitespace-nowrap"
                      htmlFor={id}
                    >
                      x(t) =
                    </label>
                    <math-field
                      ref={mf}
                      onInput={(evt) =>
                        setSettings((s) => ({
                          ...s,
                          x: latexToMathjs(
                            (evt.target as HTMLInputElement).value
                          ),
                          xLatex: (evt.target as HTMLInputElement).value,
                        }))
                      }
                      style={{
                        flexGrow: 1,
                        maxWidth: "220px",
                      }}
                    >
                      {settings.xLatex}
                    </math-field>
                  </div>
                  <div className="flex gap-3 items-center">
                    <label
                      className="text-sm font-medium text-gray-900 whitespace-nowrap"
                      htmlFor={id}
                    >
                      y(t) =
                    </label>
                    <math-field
                      ref={mf}
                      onInput={(evt) =>
                        setSettings((s) => ({
                          ...s,
                          y: latexToMathjs(
                            (evt.target as HTMLInputElement).value
                          ),
                          yLatex: (evt.target as HTMLInputElement).value,
                        }))
                      }
                      style={{
                        flexGrow: 1,
                        maxWidth: "220px",
                      }}
                    >
                      {settings.yLatex}
                    </math-field>
                  </div>
                </>
              ) : settings.fnType == "polar" ? (
                <>
                  <div className="flex gap-3 items-center">
                    <label
                      className="text-sm font-medium text-gray-900 whitespace-nowrap"
                      htmlFor={id}
                    >
                      r(r0, θ, a, γ) =
                    </label>
                    <math-field
                      ref={mf}
                      onInput={(evt) =>
                        setSettings((s) => ({
                          ...s,
                          r: latexToMathjs(
                            (evt.target as HTMLInputElement).value
                          ),
                          rLatex: (evt.target as HTMLInputElement).value,
                        }))
                      }
                      style={{
                        flexGrow: 1,
                        maxWidth: "180px",
                      }}
                    >
                      {settings.rLatex}
                    </math-field>
                  </div>
                  <div className="flex gap-3 items-center">
                    <label
                      className="text-sm font-medium text-gray-900 whitespace-nowrap"
                      htmlFor={id}
                    >
                      a =
                    </label>
                    <Input
                      type="number"
                      placeholder="a"
                      value={settings.scope.a}
                      onChange={(e) =>
                        setSettings((s) =>
                          s.fnType == "polar"
                            ? ({
                                ...s,
                                fnType: "polar",
                                graphType: "polyline",
                                scope: {
                                  ...s.scope,
                                  a: e.target.value
                                    ? 0
                                    : Number(e.target.value),
                                },
                              } as functionSetting)
                            : s
                        )
                      }
                    />
                  </div>
                  <div className="flex gap-3 items-center">
                    <label
                      className="text-sm font-medium text-gray-900 whitespace-nowrap"
                      htmlFor={id}
                    >
                      r0 =
                    </label>
                    <Input
                      type="number"
                      placeholder="a"
                      value={settings.scope.r0}
                      onChange={(e) =>
                        setSettings((s) =>
                          s.fnType == "polar"
                            ? ({
                                ...s,
                                fnType: "polar",
                                graphType: "polyline",
                                scope: {
                                  ...s.scope,
                                  r0: e.target.value
                                    ? 0
                                    : Number(e.target.value),
                                },
                              } as functionSetting)
                            : s
                        )
                      }
                    />
                  </div>
                  <div className="flex gap-3 items-center">
                    <label
                      className="text-sm font-medium text-gray-900 whitespace-nowrap"
                      htmlFor={id}
                    >
                      γ =
                    </label>
                    <Input
                      type="number"
                      placeholder="a"
                      value={settings.scope.gamma}
                      onChange={(e) =>
                        setSettings((s) =>
                          s.fnType == "polar"
                            ? ({
                                ...s,
                                fnType: "polar",
                                graphType: "polyline",
                                scope: {
                                  ...s.scope,
                                  gamma: e.target.value
                                    ? 0
                                    : Number(e.target.value),
                                },
                              } as functionSetting)
                            : s
                        )
                      }
                    />
                  </div>
                </>
              ) : null}
              <div className="flex gap-3 items-center mt-3">
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    setSettings({ ...initialSetting });
                    setMode("view");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() => {
                    console.log("settings", settings);
                    updateSetting(settings);
                    setMode("view");
                  }}
                >
                  Save
                </Button>
              </div>
            </>
          )}
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
