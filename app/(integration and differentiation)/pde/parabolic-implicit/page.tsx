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
import PDES from "@/components/PDESection";
import RodGrid from "@/components/component/RodGrid";
import ParabolicResults2D from "@/components/component/ParabolicResults2D";
import ParabolicResults1D from "@/components/component/ParabolicResults1D";

class ResponseError extends Error {
  response: string;
  detail?: string;
  constructor(message: string, res: string, detail?: string) {
    super(message);
    this.response = res;
    this.detail = detail;
  }
}

// const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());

const csvConfig = mkConfig({ useKeysAsHeaders: true });

type paramMode = "intro" | "solve" | "steps" | null;

export type parabolicResults =
  | {
      dimension: "2";
      result: {
        time: string;
        matrix: string[][];
      }[];
    }
  | {
      dimension: "1";
      result: {
        time: string;
        matrix: string[];
      }[];
    };

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
        <DialogTitle>Parabolic Equations: Implicit Method</DialogTitle>
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
                    <BreadcrumbPage>
                      Parabolic Equations: Implicit Method
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
          <div className="space-y-2">
            <div className="mb-12 mt-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-center mb-4">
                Parabolic Equations: Implicit Method
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
              <PDES />
              <section>
                <h4 className="bold font-bold my-2 text-left">
                  Parabolic Equations: Implicit Method
                </h4>
                <Parargraph>
                  Explicit finite-difference formulations have problems related
                  to stability. In addition, they exclude information that has a
                  bearing on the solution. Implicit methods overcome both these
                  diffi culties at the expense of somewhat more complicated
                  algorithms.
                </Parargraph>
                <Parargraph>
                  In implicit methods, the spatial derivative is approximated at
                  an advanced time level (l + 1). For example, the second
                  derivative would be approximated by
                </Parargraph>
                <MathBlock>
                  <MathRow>
                    <MathData>
                      <mfrac>
                        <mi>ẟ²T</mi>
                        <mi>ẟx²</mi>
                      </mfrac>
                    </MathData>
                    <MathData>
                      <mo>=</mo>
                    </MathData>
                    <MathData>
                      <mfrac>
                        <mrow>
                          <msubsup>
                            <mi>T</mi>
                            <mrow>
                              <mi>i</mi>
                              <mo>+</mo>
                              <mn>1</mn>
                            </mrow>
                            <mrow>
                              <mi>l</mi>
                              <mo>+</mo>
                              <mn>1</mn>
                            </mrow>
                          </msubsup>
                          <mo>-</mo>
                          <mn>2</mn>
                          <msubsup>
                            <mi>T</mi>
                            <mrow>
                              <mi>i</mi>
                            </mrow>
                            <mrow>
                              <mi>l</mi>
                              <mo>+</mo>
                              <mn>1</mn>
                            </mrow>
                          </msubsup>
                          <mo>+</mo>
                          <msubsup>
                            <mi>T</mi>
                            <mrow>
                              <mi>i</mi>
                              <mo>-</mo>
                              <mn>1</mn>
                            </mrow>
                            <mrow>
                              <mi>l</mi>
                              <mo>+</mo>
                              <mn>1</mn>
                            </mrow>
                          </msubsup>
                        </mrow>
                        <mrow>
                          <mi>Δx</mi>
                          <mo>²</mo>
                        </mrow>
                      </mfrac>
                    </MathData>
                  </MathRow>
                </MathBlock>
                <Parargraph>
                  When this relationship is substituted into the original PDE,
                  the resulting difference equation contains several unknowns.
                  Thus, it cannot be solved explicitly. Instead, the entire
                  system of equations must be solved simultaneously. This is
                  possible because, along with the boundary conditions, the
                  implicit formulations result in a set of linear algebraic
                  equations with the same number of unknowns. Thus, the method
                  reduces to the solution of a set of simultaneous equations at
                  each point in time.
                </Parargraph>
                <MathBlock>
                  <MathRow>
                    <MathData>
                      <mi>k</mi>
                      <mfrac>
                        <mrow>
                          <msubsup>
                            <mi>T</mi>
                            <mrow>
                              <mi>i</mi>
                              <mo>+</mo>
                              <mn>1</mn>
                            </mrow>
                            <mrow>
                              <mi>l</mi>
                              <mo>+</mo>
                              <mn>1</mn>
                            </mrow>
                          </msubsup>
                          <mo>-</mo>
                          <mn>2</mn>
                          <msubsup>
                            <mi>T</mi>
                            <mrow>
                              <mi>i</mi>
                            </mrow>
                            <mrow>
                              <mi>l</mi>
                              <mo>+</mo>
                              <mn>1</mn>
                            </mrow>
                          </msubsup>
                          <mo>+</mo>
                          <msubsup>
                            <mi>T</mi>
                            <mrow>
                              <mi>i</mi>
                              <mo>-</mo>
                              <mn>1</mn>
                            </mrow>
                            <mrow>
                              <mi>l</mi>
                              <mo>+</mo>
                              <mn>1</mn>
                            </mrow>
                          </msubsup>
                        </mrow>
                        <mrow>
                          <mi>Δx</mi>
                          <mo>²</mo>
                        </mrow>
                      </mfrac>
                    </MathData>
                    <MathData>
                      <mo>=</mo>
                    </MathData>
                    <MathData>
                      <mfrac>
                        <mrow>
                          <msubsup>
                            <mi>T</mi>
                            <mi>i</mi>
                            <mrow>
                              <mi>l</mi>
                              <mo>+</mo>
                              <mn>1</mn>
                            </mrow>
                          </msubsup>
                          <mo>-</mo>
                          <msubsup>
                            <mi>T</mi>
                            <mi>i</mi>
                            <mi>l</mi>
                          </msubsup>
                        </mrow>
                        <mi>Δt</mi>
                      </mfrac>
                    </MathData>
                  </MathRow>
                </MathBlock>
                <Parargraph>which can be solved for</Parargraph>
                <MathBlock>
                  <MathRow>
                    <MathData>
                      <mo>-</mo>
                      <mi>λ</mi>
                      <msubsup>
                        <mi>T</mi>
                        <mrow>
                          <mi>i</mi>
                          <mo>-</mo>
                          <mn>1</mn>
                        </mrow>
                        <mrow>
                          <mi>l</mi>
                          <mo>+</mo>
                          <mn>1</mn>
                        </mrow>
                      </msubsup>
                      <mo>+</mo>
                      <mo>(</mo>
                      <mn>1</mn>
                      <mo>+</mo>
                      <mn>2</mn>
                      <mi>λ</mi>
                      <mo>)</mo>
                      <msubsup>
                        <mi>T</mi>
                        <mi>i</mi>
                        <mrow>
                          <mi>l</mi>
                          <mo>+</mo>
                          <mn>1</mn>
                        </mrow>
                      </msubsup>
                      <mo>-</mo>
                      <mi>λ</mi>
                      <msubsup>
                        <mi>T</mi>
                        <mrow>
                          <mi>i</mi>
                          <mo>+</mo>
                          <mn>1</mn>
                        </mrow>
                        <mrow>
                          <mi>l</mi>
                          <mo>+</mo>
                          <mn>1</mn>
                        </mrow>
                      </msubsup>
                    </MathData>
                    <MathData>
                      <mo>=</mo>
                    </MathData>
                    <MathData>
                      <msubsup>
                        <mi>T</mi>
                        <mi>i</mi>
                        <mi>l</mi>
                      </msubsup>
                    </MathData>
                  </MathRow>
                </MathBlock>
                <Parargraph>where</Parargraph>
                <MathBlock>
                  <MathRow>
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
                    </MathData>
                  </MathRow>
                </MathBlock>
                <Parargraph>
                  This equation applies to all but the fi rst and the last
                  interior nodes, which must be modifi ed to refl ect the
                  boundary conditions.
                </Parargraph>
                <Parargraph>
                  In addition, the method has the added bonus that the system is
                  tridiagonal. Thus, we can utilize the extremely effi cient
                  solution algorithms that are available for tridiagonal
                  systems.
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

  const [initialValues, setInitialValues] = useState<{
    equationType: "heat" | "others";
    equation: string;
    latex: string;
    dimension: "1" | "2";
    k: string;
    x: string;
    dx: string;
    y: string;
    t: string;
    dt: string;
    T: string;
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
  }>({
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
  const [latex, setLatex] = useState("");

  const nx =
    initialValues.x && initialValues.dx
      ? Number(initialValues?.x) / Number(initialValues?.dx) - 1
      : 0;
  const ny =
    initialValues.y && initialValues.dx
      ? Number(initialValues?.y) / Number(initialValues?.dx) - 1
      : 0;

  const {
    trigger,
    data: results,
    isMutating,
    error: resultError,
    reset,
  } = useSWRMutation(
    "/api/user",
    async () => {
      const res = await fetch("http://127.0.0.1:8000/pde/parabolic-Implicit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nx,
          ny,
          boundary: initialValues?.bondary,
          equationType: initialValues?.equationType,
          dimension: Number(initialValues?.dimension),
          k: Number(initialValues?.k),
          x: Number(initialValues?.x),
          dx: Number(initialValues?.dx),
          y: Number(initialValues?.y),
          t: Number(initialValues?.t),
          dt: Number(initialValues?.dt),
          T: Number(initialValues?.T),
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        if (typeof result.detail == "string") {
          throw Error(result.detail);
        } else {
          throw Error(result.detail[0].loc[1] + " " + result.detail[0].msg);
        }
      }

      return result as Promise<parabolicResults>;
    },
    {
      async onError(err, key, config) {
        toast.error((err as ResponseError).response);
        // console.log("err.message", err.response);
      },
    }
  );

  const valid =
    initialValues.k != "" &&
    !isNaN(Number(initialValues.k)) &&
    initialValues.t &&
    !isNaN(Number(initialValues.t)) &&
    initialValues.dt &&
    !isNaN(Number(initialValues.dt)) &&
    initialValues.dx &&
    !isNaN(Number(initialValues.dx)) &&
    initialValues.x &&
    !isNaN(Number(initialValues.x)) &&
    initialValues.bondary.l.value &&
    !isNaN(Number(initialValues.bondary.l.value)) &&
    initialValues.bondary.r.value &&
    !isNaN(Number(initialValues.bondary.r.value)) &&
    (initialValues.dimension == "1" ||
      (initialValues.y &&
        !isNaN(Number(initialValues.y)) &&
        initialValues.bondary.t.value &&
        !isNaN(Number(initialValues.bondary.t.value)) &&
        initialValues.bondary.b.value &&
        !isNaN(Number(initialValues.bondary.b.value))));

  useEffect(() => {
    if (resultError) {
      setSideMode("edit");
    }
  }, [resultError]);

  return (
    <div className="w-full h-screen flex">
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
                      Parabolic Equations: Implicit Method
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
              <h3 className="text-2xl font-bold text-red-600">Error!</h3>
              <p className="max-w-[600px] text-gray-500 dark:text-gray-400">
                {resultError?.message ??
                  "Edit parameters and run computation to generate results"}
              </p>
            </div>
          </div>
        ) : results && initialValues ? (
          results.dimension == "1" ? (
            <ParabolicResults1D
              boundary={initialValues.bondary}
              nx={nx}
              x={Number(initialValues.x)}
              dx={Number(initialValues.dx)}
              results={results.result}
              t={Number(initialValues.t)}
            />
          ) : (
            <ParabolicResults2D
              results={results.result}
              boundary={initialValues.bondary}
              t={Number(initialValues.t)}
            />
          )
        ) : sideMode == "set" && initialValues ? (
          <div className="h-full flex justify-center flex-col p-4">
            <h4 className="font-semibold mb-4">Bondary Conditions:</h4>
            {initialValues.dimension == "2" ? (
              <div className="mx-auto mb-4 flex flex-col gap-1.5">
                <Tabs
                  defaultValue={initialValues.bondary.t.type}
                  className="mx-auto mb-2"
                >
                  <TabsList className="w-fit">
                    <TabsTrigger
                      value="dirichlet"
                      onClick={() =>
                        setInitialValues((s) => {
                          const cpy = { ...s };
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
                          const cpy = { ...s };
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
                <div className="flex items-center gap-4 max-w-sm">
                  <div className="flex items-center gap-1.5">
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
                          const cpy = { ...s };
                          cpy.bondary.t.value = e.target.value;
                          return cpy;
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            ) : null}
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
                          const cpy = { ...s };
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
                          const cpy = { ...s };
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
                          <mi>dx</mi>
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
                        const cpy = { ...s };
                        cpy.bondary.l.value = e.target.value;
                        return cpy;
                      })
                    }
                  />
                </div>
              </div>
              {initialValues.dimension == "2" ? (
                <Grids x={nx} y={ny} boundary={initialValues.bondary} />
              ) : (
                <RodGrid
                  boundary={initialValues.bondary}
                  nx={nx}
                  x={Number(initialValues.x)}
                  dx={Number(initialValues.dx)}
                />
              )}
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
                          const cpy = { ...s };
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
                          const cpy = { ...s };
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
                          <mi>dx</mi>
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
                        const cpy = { ...s };
                        cpy.bondary.r.value = e.target.value;
                        return cpy;
                      })
                    }
                  />
                </div>
              </div>
            </div>
            {initialValues.dimension == "2" ? (
              <div className="mx-auto mt-4 flex flex-col gap-1.5">
                <Tabs
                  defaultValue={initialValues.bondary.b.type}
                  className="mx-auto mb-2"
                >
                  <TabsList className="w-fit">
                    <TabsTrigger
                      value="dirichlet"
                      onClick={() =>
                        setInitialValues((s) => {
                          const cpy = { ...s };
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
                          const cpy = { ...s };
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
                <div className="flex items-center gap-4 max-w-sm">
                  <div className="flex items-center gap-1.5">
                    <Label
                      htmlFor="email"
                      className="text-nowrap whitespace-nowrap"
                    >
                      {initialValues.bondary.b.type == "dirichlet" ? (
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
                          const cpy = { ...s };
                          cpy.bondary.b.value = e.target.value;
                          return cpy;
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            ) : null}
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
