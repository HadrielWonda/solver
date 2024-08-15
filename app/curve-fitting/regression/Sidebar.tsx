import { AnimatePresence, motion } from "framer-motion";
import { AiOutlineRollback } from "react-icons/ai";
import * as mathlive from "mathlive";
import "mathlive/static.css";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { latexToMathjs } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import TableUploadModal from "@/components/component/TableUploadModal";
import { Checkbox } from "@/components/ui/checkbox";
import CustomModelModal from "@/components/component/CustomModelModal";

// export type equationSettings = {
//   dataType: "equation" | "data";
//   equation: string;
//   latex: string;
//   a: string;
//   b: string;
//   n: string;
// };

export type regressionSettings = {
  models: (
    | {
        type: "linear";
        name: string;
        x: string;
        y: string;
        "x-latex"?: string;
        "y-latex"?: string;
      }
    | {
        type: "polynomial";
        name: string;
        degree: string;
      }
  )[];
};

export const Sidebar = ({
  open,
  close,
  setInitialSettings,
  running,
  data,
  setData,
}: // solve,
{
  open: boolean;
  close: () => void;
  setInitialSettings: (settings: regressionSettings) => void;
  data: string[][] | undefined;
  setData: Dispatch<SetStateAction<string[][] | undefined>>;
  // solve: any;
  running: boolean;
}) => {
  // const [mode, setMode] = useState<"edit" | "visualize">("edit");
  const id = useId();
  const [settings, setSettings] = useState<regressionSettings>({
    models: [],
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

  const valid = data && settings.models.length > 0;

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
            <h3 className="font-semibold mb-4 text-xl">Linear Regression</h3>
            <Dialog>
              {data ? (
                <div>
                  <p className="font-bold text-lg my-3">
                    {data.length == 2 ? (
                      <span>y = f(x)</span>
                    ) : (
                      <>
                        <span>y = f(x1</span>
                        {Array(data.length - 2)
                          .fill(0)
                          .map((_, i) => (
                            <span key={i + 2}>, x{i + 2}</span>
                          ))}
                        <span>)</span>
                      </>
                    )}
                  </p>

                  <div className="flex gap-4">
                    <DialogTrigger className="flex-1">
                      <div className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full">
                        Edit Data
                      </div>
                    </DialogTrigger>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setData(undefined);
                      }}
                      className="flex-1"
                    >
                      Clear Data
                    </Button>
                  </div>
                </div>
              ) : (
                <DialogTrigger className="w-full">
                  <div className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full">
                    Add Data
                  </div>
                </DialogTrigger>
              )}
              <TableUploadModal initialData={data} setInitialData={setData} />
            </Dialog>
            <div className="space-y-3 mt-8">
              <h4 className="font-semibold mb-4">Select/Add Models</h4>
              <div className="space-y-4">
                <div className="items-top flex items-center space-x-2">
                  <Checkbox
                    id="linear"
                    checked={settings.models.some(
                      (model) => model.name === "linear"
                    )}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSettings({
                          models: [
                            ...settings.models,
                            {
                              type: "linear",
                              name: "linear",
                              x: "x",
                              y: "y",
                            },
                          ],
                        });
                      } else {
                        setSettings({
                          models: settings.models.filter(
                            (model) => model.name !== "linear"
                          ),
                        });
                      }
                    }}
                  />
                  <div className="grid gap-1 leading-none">
                    <label
                      htmlFor="terms1"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Linear equation
                    </label>
                    <p className="text-sm text-muted-foreground">
                      <math>
                        <mrow>
                          <mi>y</mi>
                          <mo>=</mo>
                          <mi>a</mi>
                          <mo>+</mo>
                          <mi>b</mi>
                          <mi>x</mi>
                        </mrow>
                      </math>
                    </p>
                  </div>
                </div>
                {/* <div className="items-top flex items-center space-x-2">
                  <Checkbox
                    id="power"
                    checked={settings.models.some(
                      (model) => model.name === "power"
                    )}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSettings({
                          models: [
                            ...settings.models,
                            {
                              type: "linear",
                              name: "power",
                              x: "log(x)",
                              y: "log(y)",
                            },
                          ],
                        });
                      } else {
                        setSettings({
                          models: settings.models.filter(
                            (model) => model.name !== "power"
                          ),
                        });
                      }
                    }}
                  />
                  <div className="grid gap-1 leading-none">
                    <label
                      htmlFor="terms1"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Power equation
                    </label>
                    <p className="text-sm text-muted-foreground">
                      <math>
                        <mrow>
                          <mi>y</mi>
                          <mo>=</mo>
                          <mi>a</mi>
                          <mo>&#8290;</mo>
                          <msup>
                            <mi>x</mi>
                            <mi>b</mi>
                          </msup>
                        </mrow>
                      </math>
                      <span className="px-3">{`=>`}</span>
                      <math>
                        <mrow>
                          <mo>log</mo>
                          <mi>y</mi>
                          <mo>=</mo>
                          <mi>a</mi>
                          <mo>+</mo>
                          <mi>b</mi>
                          <mo>log</mo>
                          <mi>x</mi>
                        </mrow>
                      </math>
                    </p>
                  </div>
                </div> */}
                <div className="items-top flex items-center space-x-2">
                  <Checkbox
                    id="exponential"
                    checked={settings.models.some(
                      (model) => model.name === "exponential"
                    )}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSettings({
                          models: [
                            ...settings.models,
                            {
                              type: "linear",
                              name: "exponential",
                              x: "x",
                              y: "log(y)",
                            },
                          ],
                        });
                      } else {
                        setSettings({
                          models: settings.models.filter(
                            (model) => model.name !== "exponential"
                          ),
                        });
                      }
                    }}
                  />
                  <div className="grid gap-1 leading-none">
                    <label
                      htmlFor="terms1"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Exponential equation
                    </label>
                    <p className="text-sm text-muted-foreground">
                      <math>
                        <mrow>
                          <mi>y</mi>
                          <mo>=</mo>
                          <mi>a</mi>
                          <mo>&#8290;</mo>
                          <msup>
                            <mi>e</mi>
                            <mrow>
                              <mi>b</mi>
                              <mi>x</mi>
                            </mrow>
                          </msup>
                        </mrow>
                      </math>
                      <span className="px-3">{`=>`}</span>
                      <math>
                        <mrow>
                          <mo>ln</mo>
                          <mi>y</mi>
                          <mo>=</mo>
                          <mo>ln</mo>
                          <mi>a</mi>
                          <mo>+</mo>
                          <mi>b</mi>
                          <mi>x</mi>
                        </mrow>
                      </math>
                    </p>
                  </div>
                </div>
                {settings.models
                  .filter((model) => model.type === "linear")
                  .filter((model) => model.name.includes("custom"))
                  .map((model) => (
                    <div
                      key={model.name}
                      className="items-top flex items-center space-x-2"
                    >
                      <Checkbox
                        id={model.name}
                        checked={settings.models.some(
                          (m) => m.name === model.name
                        )}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSettings({
                              models: [...settings.models, model],
                            });
                          } else {
                            setSettings({
                              models: settings.models.filter(
                                (m) => m.name !== model.name
                              ),
                            });
                          }
                        }}
                      />
                      <div className="grid gap-1 leading-none">
                        <label
                          htmlFor={model.name}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {model.name}
                        </label>
                        <p className="text-sm text-muted-foreground">
                          <math>
                            <mrow>
                              <mi>y&#772;</mi>
                              <mo>=</mo>
                              <mi>a</mi>
                              <mo>+</mo>
                              <mi>b</mi>
                              <mi>x&#772;</mi>
                            </mrow>
                          </math>
                          <span className="px-3">{`=>`}</span>
                          y&#772; =
                          <span
                            dangerouslySetInnerHTML={{
                              __html: mathlive.convertLatexToMarkup(
                                model["y-latex"] as string
                              ),
                            }}
                          />
                          , x&#772; =
                          <span
                            dangerouslySetInnerHTML={{
                              __html: mathlive.convertLatexToMarkup(
                                model["x-latex"] as string
                              ),
                            }}
                          />
                        </p>
                      </div>
                    </div>
                  ))}
                {settings.models
                  .filter((model) => model.type == "polynomial")
                  .map((model) => (
                    <div
                      key={model.name}
                      className="items-top flex items-center space-x-2"
                    >
                      <Checkbox
                        id={model.name}
                        checked={settings.models.some(
                          (m) => m.name === model.name
                        )}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSettings({
                              models: [...settings.models, model],
                            });
                          } else {
                            setSettings({
                              models: settings.models.filter(
                                (m) => m.name !== model.name
                              ),
                            });
                          }
                        }}
                      />
                      <div className="grid gap-1 leading-none">
                        <label
                          htmlFor={model.name}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {model.name}
                        </label>
                        <p className="text-sm text-muted-foreground">
                          {model.degree} order polynomial
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full mt-1">
                    Add Polynomial/Custom Model
                  </Button>
                </DialogTrigger>
                <CustomModelModal
                  saveChanges={({ x, y }, degree, type) => {
                    setSettings({
                      models: [
                        ...settings.models,
                        type === "polynomial"
                          ? {
                              type: "polynomial",
                              name: `polynomial ${settings.models.length + 1}`,
                              degree,
                            }
                          : {
                              type: "linear",
                              name: `custom ${settings.models.length + 1}`,
                              x: latexToMathjs(x),
                              y: latexToMathjs(y),
                              "x-latex": x,
                              "y-latex": y,
                            },
                      ],
                    });
                  }}
                />
              </Dialog>
            </div>

            <div className="mt-12">
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
