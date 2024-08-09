/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import "mathlive/static.css";
import { MathBlock, MathData, MathRow } from "@/components/ui/math";
import { Parargraph } from "@/components/ui/blocks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TSCodeBlock from "./ts.mdx";
import PYCodeBlock from "./py.mdx";
import MLCodeBlock from "./ml.mdx";
// import "../../../../public/prism.js";
import "../../../../public/prism.css";
import Prism from "../../../../public/prism.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdError } from "react-icons/md";
import { Sidebar, pdeSettings } from "./Sidebar";
import { RiFileList3Line } from "react-icons/ri";
import useSWRMutation from "swr/mutation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as mathlive from "mathlive";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import ODESection from "@/components/ODESection";
import Grids from "@/components/component/Grids";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import EllipticResults from "@/components/component/EllipticResults";

class ResponseError extends Error {
  response: string;
  constructor(message: string, res: any) {
    super(message);
    this.response = res;
  }
}

// const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());

const csvConfig = mkConfig({ useKeysAsHeaders: true });

type paramMode = "intro" | "solve" | "steps" | null;

export type ellipticResults = {
  itr: number;
  matrix: number[][];
  abre: number;
}[];

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("mode") as paramMode;
  const [mode, setMode] = useState<"intro" | "solve" | "steps">(
    search ? search : "intro"
  );

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  return mode == "intro" ? (
    <IntroSection
      solve={() => {
        router.push(pathname + "?" + createQueryString("mode", "solve"));
        setMode("solve");
      }}
    />
  ) : (
    <SolveSection
      intro={() => {
        router.push(pathname + "?" + createQueryString("mode", "intro"));
        setMode("intro");
      }}
    />
  );
}

const CodeDialog = () => {
  const [reRenderTrigger, setReRenderTrigger] = useState(false);
  useEffect(() => {
    console.log("re-render");
    Prism.highlightAll();
  }, [reRenderTrigger]);

  return (
    <DialogContent
      className="sm:max-w-[600px]"
      onAnimationStart={() => setReRenderTrigger((i) => !i)}
    >
      <DialogHeader>
        <DialogTitle>Finite Difference Method</DialogTitle>
        <DialogDescription>
          Copy code to make changes or run in a different enviroment.
        </DialogDescription>
      </DialogHeader>
      <div>
        <Tabs defaultValue="ts" className="w-full">
          <TabsList>
            <TabsTrigger
              onClick={() => setReRenderTrigger((i) => !i)}
              value="ts"
            >
              Typescript
            </TabsTrigger>
            <TabsTrigger
              onClick={() => setReRenderTrigger((i) => !i)}
              value="py"
            >
              Python
            </TabsTrigger>
            <TabsTrigger
              onClick={() => setReRenderTrigger((i) => !i)}
              value="ml"
            >
              Matlab
            </TabsTrigger>
          </TabsList>
          <TabsContent value="ts">
            <TSCodeBlock
              components={{
                pre: (props) => (
                  <pre
                    {...props}
                    className="overflow-scroll max-h-[25rem] w-full max-w-[555px]"
                  />
                ),
              }}
            />
          </TabsContent>
          <TabsContent value="py">
            <PYCodeBlock
              components={{
                pre: (props) => (
                  <pre
                    {...props}
                    className="overflow-scroll max-h-[25rem] w-full max-w-[555px]"
                  />
                ),
              }}
            />
          </TabsContent>
          <TabsContent value="ml">
            <MLCodeBlock
              components={{
                pre: (props) => (
                  <pre
                    {...props}
                    className="overflow-scroll max-h-[25rem] w-full max-w-[555px]"
                  />
                ),
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DialogContent>
  );
};

const IntroSection = ({ solve }: { solve: () => void }) => {
  return (
    <main className="dark:bg-gray-950 min-h-screen">
      <div className="pb-12 pt-4">
        <div className="container flex flex-col items-center justify-center max-w-5xl px-4 space-y-4 md:space-y-8 md:px-6">
          <div className="w-full flex mb-2">
            <div className="p-3 bg-white border-2 border-borderColor rounded-xl z-10">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Finite Difference Method</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
          <div className="space-y-2">
            <div className="mb-12 mt-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-center mb-4">
                Finite Difference Method
              </h1>
              <div className="flex gap-4 justify-center items-center">
                <Button onClick={solve}>Start Computation</Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">View Code</Button>
                  </DialogTrigger>
                  <CodeDialog />
                </Dialog>
              </div>
            </div>
            <div>
              <ODESection />
              <section>
                <h4 className="bold font-bold my-2 text-left">
                  Finite Difference Method
                </h4>

                <Parargraph>
                  The most common alternatives to the shooting method are fi
                  nite-difference approaches. In these techniques, fi nite
                  divided differences are substituted for the derivatives in the
                  original equation. Thus, a linear differential equation is
                  transformed into a set of simultaneous algebraic equations
                  that can be solved
                </Parargraph>

                <h3 className="bold font-bold mt-8 mb-2 text-left">
                  First Order Derivatives
                </h3>
                <ol>
                  <li>
                    <span>Forward Difference:</span>
                    <MathBlock className="my-0">
                      <MathRow>
                        <MathData>f'(x) ≈</MathData>
                        <MathData>
                          <mfrac>
                            <ms>f(x+h) - f(x)</ms>
                            <mi>h</mi>
                          </mfrac>
                        </MathData>
                      </MathRow>
                    </MathBlock>
                  </li>
                  <li>
                    <span>Backward Difference:</span>
                    <MathBlock className="my-0">
                      <MathRow>
                        <MathData>f'(x) ≈</MathData>
                        <MathData>
                          <mfrac>
                            <ms>f(x) - f(x-h)</ms>
                            <mi>h</mi>
                          </mfrac>
                        </MathData>
                      </MathRow>
                    </MathBlock>
                  </li>
                  <li>
                    <span>Central Difference:</span>
                    <MathBlock className="my-0">
                      <MathRow>
                        <MathData>f'(x) ≈</MathData>
                        <MathData>
                          <mfrac>
                            <ms>f(x+h) - f(x-h)</ms>
                            <mrow>
                              <mn>2</mn>
                              <mi>h</mi>
                            </mrow>
                          </mfrac>
                        </MathData>
                      </MathRow>
                    </MathBlock>
                  </li>
                </ol>

                <h3 className="bold font-bold mt-8 mb-2 text-left">
                  Second Order Derivatives
                </h3>
                <ol>
                  <li>
                    <span>Forward Difference:</span>
                    <MathBlock className="my-0">
                      <MathRow>
                        <MathData>f''(x) ≈</MathData>
                        <MathData>
                          <mfrac>
                            <ms>f(x+2h) - 2f(x+h) + f(x)</ms>
                            <mrow>
                              <msup>
                                <mi>h</mi>
                                <mn>2</mn>
                              </msup>
                            </mrow>
                          </mfrac>
                        </MathData>
                      </MathRow>
                    </MathBlock>
                  </li>
                  <li>
                    <span>Backward Difference:</span>
                    <MathBlock className="my-0">
                      <MathRow>
                        <MathData>f''(x) ≈</MathData>
                        <MathData>
                          <mfrac>
                            <ms>f(x) - 2f(x-h) + f(x-2h)</ms>
                            <mrow>
                              <msup>
                                <mi>h</mi>
                                <mn>2</mn>
                              </msup>
                            </mrow>
                          </mfrac>
                        </MathData>
                      </MathRow>
                    </MathBlock>
                  </li>
                  <li>
                    <span>Central Difference:</span>
                    <MathBlock className="my-0">
                      <MathRow>
                        <MathData>f''(x) ≈</MathData>
                        <MathData>
                          <mfrac>
                            <ms>f(x+h) - 2f(x) + f(x-h)</ms>
                            <mrow>
                              <msup>
                                <mi>h</mi>
                                <mn>2</mn>
                              </msup>
                            </mrow>
                          </mfrac>
                        </MathData>
                      </MathRow>
                    </MathBlock>
                  </li>
                </ol>

                <h3 className="bold font-bold mt-8 mb-2 text-left">
                  Third Order Derivatives
                </h3>
                <ol>
                  <li>
                    <span>Forward Difference:</span>
                    <MathBlock className="my-0">
                      <MathRow>
                        <MathData>f'''(x) ≈</MathData>
                        <MathData>
                          <mfrac>
                            <ms>f(x+3h) - 3f(x+2h) + 3f(x+h) - f(x)</ms>
                            <mrow>
                              <msup>
                                <mi>h</mi>
                                <mn>3</mn>
                              </msup>
                            </mrow>
                          </mfrac>
                        </MathData>
                      </MathRow>
                    </MathBlock>
                  </li>
                  <li>
                    <span>Backward Difference:</span>
                    <MathBlock className="my-0">
                      <MathRow>
                        <MathData>f'''(x) ≈</MathData>
                        <MathData>
                          <mfrac>
                            <ms>f(x) - 3f(x-h) + 3f(x-2h) - f(x-3h)</ms>
                            <mrow>
                              <msup>
                                <mi>h</mi>
                                <mn>3</mn>
                              </msup>
                            </mrow>
                          </mfrac>
                        </MathData>
                      </MathRow>
                    </MathBlock>
                  </li>
                  <li>
                    <span>Central Difference:</span>
                    <MathBlock className="my-0">
                      <MathRow>
                        <MathData>f'''(x) ≈</MathData>
                        <MathData>
                          <mfrac>
                            <ms>f(x+2h) - 2f(x+h) + 2f(x-h) - f(x-2h)</ms>
                            <mrow>
                              <mn>2</mn>
                              <msup>
                                <mi>h</mi>
                                <mn>3</mn>
                              </msup>
                            </mrow>
                          </mfrac>
                        </MathData>
                      </MathRow>
                    </MathBlock>
                  </li>
                </ol>

                <Parargraph className="mt-6">
                  These formulas are derived based on Taylor series expansions
                  and are used depending on the data points available and the
                  desired accuracy. Central differences generally provide a more
                  accurate approximation compared to forward and backward
                  differences because they use information from both sides of
                  the point of interest.
                </Parargraph>
              </section>
            </div>
            <div>
              <Button onClick={solve} className="mt-8">
                Start Computation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const SolveSection = ({ intro }: { intro: () => void }) => {
  const [sideMode, setSideMode] = useState<"edit" | "set">("edit");

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, [setSidebarOpen]);
  const openSidebar = useCallback(() => {
    setSidebarOpen(true);
  }, [setSidebarOpen]);

  const [initialValues, setInitialValues] = useState<
    | {
        equationType: "laplace" | "poisson" | "others";
        equation: string;
        latex: string;
        n: {
          x: string;
          y: string;
        };
        stoppingCriteria: "max_error" | "max_iterations";
        maxIterations: string;
        maxError: string;
        bondary: {
          t: {
            type: "dirichlet" | "neumann";
            value: string;
          };
          b: {
            type: "dirichlet" | "neumann";
            value: string;
          };
          l: {
            type: "dirichlet" | "neumann";
            value: string;
          };
          r: {
            type: "dirichlet" | "neumann";
            value: string;
          };
        };
        overRelaxation: string;
      }
    | undefined
  >();
  const [latex, setLatex] = useState("");

  const {
    trigger,
    data: results,
    isMutating,
    error: resultError,
    reset,
  } = useSWRMutation(
    "/api/user",
    async () => {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/pde/finite-difference-elliptic",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nx: Number(initialValues?.n.x),
              ny: Number(initialValues?.n.y),
              l: Number(initialValues?.bondary.l.value),
              r: Number(initialValues?.bondary.r.value),
              t: Number(initialValues?.bondary.t.value),
              b: Number(initialValues?.bondary.b.value),
              max_iterations: Number(initialValues?.maxIterations),
              max_error: Number(initialValues?.maxError),
              over_relaxation: Number(initialValues?.overRelaxation),
            }),
          }
        );

        const result = await res.json();

        if (!res.ok) {
          if (typeof result.detail == "string") {
            throw new ResponseError("Bad fetch response", result.detail);
          } else {
            throw new ResponseError(
              "Bad fetch response",
              result.detail[0].loc[1] + " " + result.detail[0].msg
            );
          }
        }

        return result as Promise<ellipticResults>;
      } catch (error: Error | any) {
        throw new ResponseError("Bad fetch response", String(error));
      }
    },
    {
      async onError(err, key, config) {
        toast.error((err as ResponseError).response);
        // console.log("err.message", err.response);
      },
    }
  );

  const valid =
    initialValues?.bondary.b.value &&
    initialValues?.bondary.t.value &&
    initialValues?.bondary.l.value &&
    initialValues?.bondary.r.value &&
    !isNaN(Number(initialValues?.bondary.b.value)) &&
    !isNaN(Number(initialValues?.bondary.t.value)) &&
    !isNaN(Number(initialValues?.bondary.l.value)) &&
    !isNaN(Number(initialValues?.bondary.r.value));

  // console.log("data", results);
  // console.log("resultError", resultError?.response);

  useEffect(() => {
    if (resultError) {
      setSideMode("edit");
    }
  }, [resultError]);

  return (
    <div className="w-full h-screen flex">
      {/* <Component /> */}

      <Sidebar
        open={sidebarOpen}
        close={closeSidebar}
        setInitialSettings={(settings: pdeSettings) => {
          setInitialValues({
            ...settings,
            bondary: {
              t: {
                type: "dirichlet",
                value: "",
              },
              b: {
                type: "dirichlet",
                value: "",
              },
              l: {
                type: "dirichlet",
                value: "",
              },
              r: {
                type: "dirichlet",
                value: "",
              },
            },
          });
          setLatex(settings.equation);
          setSideMode("set");
          reset();
          // setTimeout(() => {
          //   trigger();
          // }, 200);
        }}
        running={isMutating}
        mode={sideMode}
        setMode={setSideMode}
      />
      <div className="flex-1 flex flex-col w-full h-screen relative overflow-y-hidden">
        <div className="pt-3 px-5 flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button
                onClick={openSidebar}
                className="p-3 border-2 border-borderColor rounded-xl z-10 bg-white"
                aria-label="toggle sidebar"
              >
                <GiHamburgerMenu />
              </button>
            )}

            <div className="p-3 bg-white border-2 border-borderColor rounded-xl z-10">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      Finite Difference: Elliptic Equations
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
          <Tabs
            defaultValue="solve"
            // className="w-[400px]"
          >
            <TabsList className="w-fit">
              <TabsTrigger value="intro" onClick={intro}>
                Intro
              </TabsTrigger>
              <TabsTrigger value="solve">Solve</TabsTrigger>
              <TabsTrigger disabled value="steps">
                Steps
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {resultError ? (
          <div className="flex items-center justify-center w-full min-h-[400px] flex-col gap-2 p-4 text-center h-full">
            <MdError className="text-red-600" size={64} />

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-red-600">
                {resultError?.response}
              </h3>
              <p className="max-w-[600px] text-gray-500 dark:text-gray-400">
                Edit parameters and run computation to generate results
              </p>
            </div>
          </div>
        ) : results && initialValues ? (
          <EllipticResults results={results} />
        ) : sideMode == "set" && initialValues ? (
          <div className="h-full flex flex-col p-4">
            <h4 className="font-semibold mb-4">Bondary Conditions:</h4>
            <div className="w-[200px] mx-auto mb-4">
              <Tabs
                defaultValue={initialValues.bondary.t.type}
                className="mx-auto mb-2"
              >
                <TabsList className="w-fit">
                  <TabsTrigger
                    value="dirichlet"
                    onClick={() =>
                      setInitialValues((s) => {
                        const cpy = { ...initialValues };
                        cpy.bondary.t.type = "dirichlet";
                        return cpy;
                      })
                    }
                  >
                    Dirichlet
                  </TabsTrigger>
                  <TabsTrigger
                    value="neumann"
                    onClick={() =>
                      setInitialValues((s) => {
                        const cpy = { ...initialValues };
                        cpy.bondary.t.type = "neumann";
                        return cpy;
                      })
                    }
                    // disabled
                  >
                    Neumann
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex w-full max-w-sm items-center gap-1.5">
                <Label
                  htmlFor="email"
                  className="text-nowrap whitespace-nowrap"
                >
                  {initialValues.bondary.t.type == "dirichlet" ? (
                    "T"
                  ) : (
                    <math>
                      <mfrac>
                        <mi>dT</mi>
                        <mi>dx</mi>
                      </mfrac>
                    </math>
                  )}{" "}
                  =
                </Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={initialValues.bondary.t.value}
                  onChange={(e) =>
                    setInitialValues((s) => {
                      const cpy = { ...initialValues };
                      cpy.bondary.t.value = e.target.value;
                      return cpy;
                    })
                  }
                />
              </div>
            </div>
            <div className="w-full flex-1 flex justify-center gap-4">
              <div className="w-[200px] self-center">
                <Tabs
                  defaultValue={initialValues.bondary.l.type}
                  className="mx-auto mb-2"
                >
                  <TabsList className="w-fit">
                    <TabsTrigger
                      value="dirichlet"
                      onClick={() =>
                        setInitialValues((s) => {
                          const cpy = { ...initialValues };
                          cpy.bondary.l.type = "dirichlet";
                          return cpy;
                        })
                      }
                    >
                      Dirichlet
                    </TabsTrigger>
                    <TabsTrigger
                      value="neumann"
                      onClick={() =>
                        setInitialValues((s) => {
                          const cpy = { ...initialValues };
                          cpy.bondary.l.type = "neumann";
                          return cpy;
                        })
                      }
                      // disabled
                    >
                      Neumann
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="flex w-full max-w-sm items-center gap-1.5">
                  <Label
                    htmlFor="email"
                    className="text-nowrap whitespace-nowrap"
                  >
                    {initialValues.bondary.l.type == "dirichlet" ? (
                      "T"
                    ) : (
                      <math>
                        <mfrac>
                          <mi>dT</mi>
                          <mi>dy</mi>
                        </mfrac>
                      </math>
                    )}{" "}
                    =
                  </Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={initialValues.bondary.l.value}
                    onChange={(e) =>
                      setInitialValues((s) => {
                        const cpy = { ...initialValues };
                        cpy.bondary.l.value = e.target.value;
                        return cpy;
                      })
                    }
                  />
                </div>
              </div>
              <Grids
                x={Number(initialValues.n.x)}
                y={Number(initialValues.n.y)}
              />
              <div className="w-[200px] self-center">
                <Tabs
                  defaultValue={initialValues.bondary.r.type}
                  className="mx-auto mb-2"
                >
                  <TabsList className="w-fit">
                    <TabsTrigger
                      value="dirichlet"
                      onClick={() =>
                        setInitialValues((s) => {
                          const cpy = { ...initialValues };
                          cpy.bondary.r.type = "dirichlet";
                          return cpy;
                        })
                      }
                    >
                      Dirichlet
                    </TabsTrigger>
                    <TabsTrigger
                      value="neumann"
                      onClick={() =>
                        setInitialValues((s) => {
                          const cpy = { ...initialValues };
                          cpy.bondary.r.type = "neumann";
                          return cpy;
                        })
                      }
                      // disabled
                    >
                      Neumann
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="flex w-full max-w-sm items-center gap-1.5">
                  <Label
                    htmlFor="email"
                    className="text-nowrap whitespace-nowrap"
                  >
                    {initialValues.bondary.r.type == "dirichlet" ? (
                      "T"
                    ) : (
                      <math>
                        <mfrac>
                          <mi>dT</mi>
                          <mi>dy</mi>
                        </mfrac>
                      </math>
                    )}{" "}
                    =
                  </Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={initialValues.bondary.r.value}
                    onChange={(e) =>
                      setInitialValues((s) => {
                        const cpy = { ...initialValues };
                        cpy.bondary.r.value = e.target.value;
                        return cpy;
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="w-[200px] mx-auto mt-4">
              <Tabs
                defaultValue={initialValues.bondary.b.type}
                className="mx-auto mb-2"
              >
                <TabsList className="w-fit">
                  <TabsTrigger
                    value="dirichlet"
                    onClick={() =>
                      setInitialValues((s) => {
                        const cpy = { ...initialValues };
                        cpy.bondary.b.type = "dirichlet";
                        return cpy;
                      })
                    }
                  >
                    Dirichlet
                  </TabsTrigger>
                  <TabsTrigger
                    value="neumann"
                    onClick={() =>
                      setInitialValues((s) => {
                        const cpy = { ...initialValues };
                        cpy.bondary.b.type = "neumann";
                        return cpy;
                      })
                    }
                    // disabled
                  >
                    Neumann
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex w-full max-w-sm items-center gap-1.5">
                <Label
                  htmlFor="email"
                  className="text-nowrap whitespace-nowrap"
                >
                  {initialValues.bondary.t.type == "dirichlet" ? (
                    "T"
                  ) : (
                    <math>
                      <mfrac>
                        <mi>dT</mi>
                        <mi>dx</mi>
                      </mfrac>
                    </math>
                  )}{" "}
                  =
                </Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={initialValues.bondary.b.value}
                  onChange={(e) =>
                    setInitialValues((s) => {
                      const cpy = { ...initialValues };
                      cpy.bondary.b.value = e.target.value;
                      return cpy;
                    })
                  }
                />
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              {isMutating ? (
                <Button
                  className="w-full max-w-60"
                  // onClick={() => trigger()}
                  disabled
                >
                  <div className="lds-ellipsis">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </Button>
              ) : (
                <Button
                  className="w-full mx-auto max-w-60"
                  disabled={!valid || isMutating}
                  onClick={() => trigger()}
                >
                  Run Computation
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full min-h-[400px] flex-col gap-2 p-4 text-center h-full">
            <RiFileList3Line className="text-gray-500" size={64} />

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-500">
                No Results Created
              </h3>
              <p className="max-w-[600px] text-gray-500 dark:text-gray-400">
                Fill parameters and run computation to generate results
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
