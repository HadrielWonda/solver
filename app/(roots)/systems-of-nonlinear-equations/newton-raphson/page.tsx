/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { Sidebar } from "./Sidebar";
import { equationsFixedPointResult, fixedPointResult, result } from "@/types";
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
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
        <DialogTitle>
          Newton-Raphson Method for Sytem of Nonlinear Equations
        </DialogTitle>
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
                    <BreadcrumbPage>Newton-Raphson Method</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
          <div className="space-y-2">
            <div className="mb-12 mt-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-center mb-4">
                Newton-Raphson Method for Sytem of Nonlinear Equations
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
            <section>
              <Parargraph>
                The Newton-Raphson method estimate was based on a first-order
                Taylor series expansion. The multiequation form is derived in an
                identical fashion. However, a multivariable Taylor series must
                be used to account for the fact that more than one independent
                variable contributes to the determination of the root. For the
                two-variable case, a firstorder Taylor series can be written for
                each nonlinear equation (u and v) as
              </Parargraph>
              <MathBlock>
                <MathRow>
                  <MathData>
                    <msub>
                      <mi>u</mi>
                      <mrow>
                        <mi>i</mi>
                        <mo>+</mo>
                        <mn>1</mn>
                      </mrow>
                    </msub>
                  </MathData>
                  <MathData>
                    <mo>=</mo>
                  </MathData>
                  <MathData>
                    <msub>
                      <mi>u</mi>
                      <mi>i</mi>
                    </msub>
                    <mo>+</mo>
                    <mo>(</mo>
                    <msub>
                      <mi>x</mi>
                      <mrow>
                        <mi>i</mi>
                        <mo>+</mo>
                        <mn>1</mn>
                      </mrow>
                    </msub>
                    <mo>-</mo>
                    <msub>
                      <mi>x</mi>
                      <mi>i</mi>
                    </msub>
                    <mo>)</mo>
                    <mfrac>
                      <mrow>
                        <mo>ẟ</mo>
                        <msub>
                          <mi>u</mi>
                          <mi>i</mi>
                        </msub>
                      </mrow>
                      <mrow>
                        <mo>ẟ</mo>
                        <mi>x</mi>
                      </mrow>
                    </mfrac>
                    <mo>+</mo>
                    <mo>(</mo>
                    <msub>
                      <mi>y</mi>
                      <mrow>
                        <mi>i</mi>
                        <mo>+</mo>
                        <mn>1</mn>
                      </mrow>
                    </msub>
                    <mo>-</mo>
                    <msub>
                      <mi>y</mi>
                      <mi>i</mi>
                    </msub>
                    <mo>)</mo>
                    <mfrac>
                      <mrow>
                        <mo>ẟ</mo>
                        <msub>
                          <mi>u</mi>
                          <mi>i</mi>
                        </msub>
                      </mrow>
                      <mrow>
                        <mo>ẟ</mo>
                        <mi>y</mi>
                      </mrow>
                    </mfrac>
                  </MathData>
                </MathRow>
              </MathBlock>
              <Parargraph>and</Parargraph>
              <MathBlock>
                <MathRow>
                  <MathData>
                    <msub>
                      <mi>v</mi>
                      <mrow>
                        <mi>i</mi>
                        <mo>+</mo>
                        <mn>1</mn>
                      </mrow>
                    </msub>
                  </MathData>
                  <MathData>
                    <mo>=</mo>
                  </MathData>
                  <MathData>
                    <msub>
                      <mi>v</mi>
                      <mi>i</mi>
                    </msub>
                    <mo>+</mo>
                    <mo>(</mo>
                    <msub>
                      <mi>x</mi>
                      <mrow>
                        <mi>i</mi>
                        <mo>+</mo>
                        <mn>1</mn>
                      </mrow>
                    </msub>
                    <mo>-</mo>
                    <msub>
                      <mi>x</mi>
                      <mi>i</mi>
                    </msub>
                    <mo>)</mo>
                    <mfrac>
                      <mrow>
                        <mo>ẟ</mo>
                        <msub>
                          <mi>v</mi>
                          <mi>i</mi>
                        </msub>
                      </mrow>
                      <mrow>
                        <mo>ẟ</mo>
                        <mi>x</mi>
                      </mrow>
                    </mfrac>
                    <mo>+</mo>
                    <mo>(</mo>
                    <msub>
                      <mi>y</mi>
                      <mrow>
                        <mi>i</mi>
                        <mo>+</mo>
                        <mn>1</mn>
                      </mrow>
                    </msub>
                    <mo>-</mo>
                    <msub>
                      <mi>y</mi>
                      <mi>i</mi>
                    </msub>
                    <mo>)</mo>
                    <mfrac>
                      <mrow>
                        <mo>ẟ</mo>
                        <msub>
                          <mi>v</mi>
                          <mi>i</mi>
                        </msub>
                      </mrow>
                      <mrow>
                        <mo>ẟ</mo>
                        <mi>y</mi>
                      </mrow>
                    </mfrac>
                  </MathData>
                </MathRow>
              </MathBlock>
              <Parargraph>
                Just as for the single-equation version, the root estimate
                corresponds to the values of x and y, where ui11 and yi11 equal
                zero. For this situation can be rearranged to give
              </Parargraph>
              <MathBlock>
                <MathRow>
                  <MathData>
                    <mfrac>
                      <mrow>
                        <mo>ẟ</mo>
                        <msub>
                          <mi>u</mi>
                          <mi>i</mi>
                        </msub>
                      </mrow>
                      <mrow>
                        <mo>ẟ</mo>
                        <mi>x</mi>
                      </mrow>
                    </mfrac>
                    <msub>
                      <mi>x</mi>
                      <mrow>
                        <mi>i</mi>
                        <mo>+</mo>
                        <mn>1</mn>
                      </mrow>
                    </msub>
                    <mo>+</mo>
                    <mfrac>
                      <mrow>
                        <mo>ẟ</mo>
                        <msub>
                          <mi>u</mi>
                          <mi>i</mi>
                        </msub>
                      </mrow>
                      <mrow>
                        <mo>ẟ</mo>
                        <mi>y</mi>
                      </mrow>
                    </mfrac>
                    <msub>
                      <mi>y</mi>
                      <mrow>
                        <mi>i</mi>
                        <mo>+</mo>
                        <mn>1</mn>
                      </mrow>
                    </msub>
                  </MathData>
                  <MathData>
                    <mo>=</mo>
                  </MathData>
                  <MathData>
                    <mo>-</mo>
                    <msub>
                      <mi>u</mi>
                      <mi>i</mi>
                    </msub>
                    <mo>+</mo>
                    <msub>
                      <mi>x</mi>
                      <mi>i</mi>
                    </msub>
                    <mfrac>
                      <mrow>
                        <mo>ẟ</mo>
                        <msub>
                          <mi>u</mi>
                          <mi>i</mi>
                        </msub>
                      </mrow>
                      <mrow>
                        <mo>ẟ</mo>
                        <mi>x</mi>
                      </mrow>
                    </mfrac>
                    <mo>+</mo>
                    <msub>
                      <mi>y</mi>
                      <mi>i</mi>
                    </msub>
                    <mfrac>
                      <mrow>
                        <mo>ẟ</mo>
                        <msub>
                          <mi>u</mi>
                          <mi>i</mi>
                        </msub>
                      </mrow>
                      <mrow>
                        <mo>ẟ</mo>
                        <mi>y</mi>
                      </mrow>
                    </mfrac>
                  </MathData>
                </MathRow>
                <MathRow>
                  <MathData>
                    <mfrac>
                      <mrow>
                        <mo>ẟ</mo>
                        <msub>
                          <mi>v</mi>
                          <mi>i</mi>
                        </msub>
                      </mrow>
                      <mrow>
                        <mo>ẟ</mo>
                        <mi>x</mi>
                      </mrow>
                    </mfrac>
                    <msub>
                      <mi>x</mi>
                      <mrow>
                        <mi>i</mi>
                        <mo>+</mo>
                        <mn>1</mn>
                      </mrow>
                    </msub>
                    <mo>+</mo>
                    <mfrac>
                      <mrow>
                        <mo>ẟ</mo>
                        <msub>
                          <mi>v</mi>
                          <mi>i</mi>
                        </msub>
                      </mrow>
                      <mrow>
                        <mo>ẟ</mo>
                        <mi>y</mi>
                      </mrow>
                    </mfrac>
                    <msub>
                      <mi>y</mi>
                      <mrow>
                        <mi>i</mi>
                        <mo>+</mo>
                        <mn>1</mn>
                      </mrow>
                    </msub>
                  </MathData>
                  <MathData>
                    <mo>=</mo>
                  </MathData>
                  <MathData>
                    <mo>-</mo>
                    <msub>
                      <mi>v</mi>
                      <mi>i</mi>
                    </msub>
                    <mo>+</mo>
                    <msub>
                      <mi>x</mi>
                      <mi>i</mi>
                    </msub>
                    <mfrac>
                      <mrow>
                        <mo>ẟ</mo>
                        <msub>
                          <mi>v</mi>
                          <mi>i</mi>
                        </msub>
                      </mrow>
                      <mrow>
                        <mo>ẟ</mo>
                        <mi>x</mi>
                      </mrow>
                    </mfrac>
                    <mo>+</mo>
                    <msub>
                      <mi>y</mi>
                      <mi>i</mi>
                    </msub>
                    <mfrac>
                      <mrow>
                        <mo>ẟ</mo>
                        <msub>
                          <mi>v</mi>
                          <mi>i</mi>
                        </msub>
                      </mrow>
                      <mrow>
                        <mo>ẟ</mo>
                        <mi>y</mi>
                      </mrow>
                    </mfrac>
                  </MathData>
                </MathRow>
              </MathBlock>
              <Parargraph>
                Because all values subscripted with i’s are known (they
                correspond to the latest guess or approximation), the only
                unknowns are xi+1 and yi+1. Consequently, algebraic
                manipulations (for example, Cramer’s rule) can be employed to
                solve for
              </Parargraph>
              <MathBlock>
                <MathRow>
                  <MathData>
                    <msub>
                      <mi>x</mi>
                      <mrow>
                        <mi>i</mi>
                        <mo>+</mo>
                        <mn>1</mn>
                      </mrow>
                    </msub>
                  </MathData>
                  <MathData>
                    <mo>=</mo>
                  </MathData>
                  <MathData className="te text-[1.5rem]">
                    <mfrac>
                      <mrow>
                        <msub>
                          <mi>u</mi>
                          <mi>i</mi>
                        </msub>
                        <mfrac>
                          <mrow>
                            <mo>ẟ</mo>
                            <msub>
                              <mi>v</mi>
                              <mi>i</mi>
                            </msub>
                          </mrow>
                          <mrow>
                            <mo>ẟ</mo>
                            <mi>y</mi>
                          </mrow>
                        </mfrac>
                        <mo>-</mo>
                        <msub>
                          <mi>v</mi>
                          <mi>i</mi>
                        </msub>
                        <mfrac>
                          <mrow>
                            <mo>ẟ</mo>
                            <msub>
                              <mi>u</mi>
                              <mi>i</mi>
                            </msub>
                          </mrow>
                          <mrow>
                            <mo>ẟ</mo>
                            <mi>y</mi>
                          </mrow>
                        </mfrac>
                      </mrow>
                      <mrow>
                        <mfrac>
                          <mrow>
                            <mo>ẟ</mo>
                            <msub>
                              <mi>u</mi>
                              <mi>i</mi>
                            </msub>
                          </mrow>
                          <mrow>
                            <mo>ẟ</mo>
                            <mi>x</mi>
                          </mrow>
                        </mfrac>
                        <mfrac>
                          <mrow>
                            <mo>ẟ</mo>
                            <msub>
                              <mi>v</mi>
                              <mi>i</mi>
                            </msub>
                          </mrow>
                          <mrow>
                            <mo>ẟ</mo>
                            <mi>y</mi>
                          </mrow>
                        </mfrac>
                        <mo>-</mo>
                        <mfrac>
                          <mrow>
                            <mo>ẟ</mo>
                            <msub>
                              <mi>u</mi>
                              <mi>i</mi>
                            </msub>
                          </mrow>
                          <mrow>
                            <mo>ẟ</mo>
                            <mi>y</mi>
                          </mrow>
                        </mfrac>
                        <mfrac>
                          <mrow>
                            <mo>ẟ</mo>
                            <msub>
                              <mi>v</mi>
                              <mi>i</mi>
                            </msub>
                          </mrow>
                          <mrow>
                            <mo>ẟ</mo>
                            <mi>x</mi>
                          </mrow>
                        </mfrac>
                      </mrow>
                    </mfrac>
                  </MathData>
                </MathRow>
                <MathRow>
                  <MathData>
                    <msub>
                      <mi>y</mi>
                      <mrow>
                        <mi>i</mi>
                        <mo>+</mo>
                        <mn>1</mn>
                      </mrow>
                    </msub>
                  </MathData>
                  <MathData>
                    <mo>=</mo>
                  </MathData>
                  <MathData className="te text-[1.5rem]">
                    <mfrac>
                      <mrow>
                        <msub>
                          <mi>v</mi>
                          <mi>i</mi>
                        </msub>
                        <mfrac>
                          <mrow>
                            <mo>ẟ</mo>
                            <msub>
                              <mi>u</mi>
                              <mi>i</mi>
                            </msub>
                          </mrow>
                          <mrow>
                            <mo>ẟ</mo>
                            <mi>x</mi>
                          </mrow>
                        </mfrac>
                        <mo>-</mo>
                        <msub>
                          <mi>u</mi>
                          <mi>i</mi>
                        </msub>
                        <mfrac>
                          <mrow>
                            <mo>ẟ</mo>
                            <msub>
                              <mi>v</mi>
                              <mi>i</mi>
                            </msub>
                          </mrow>
                          <mrow>
                            <mo>ẟ</mo>
                            <mi>x</mi>
                          </mrow>
                        </mfrac>
                      </mrow>
                      <mrow>
                        <mfrac>
                          <mrow>
                            <mo>ẟ</mo>
                            <msub>
                              <mi>u</mi>
                              <mi>i</mi>
                            </msub>
                          </mrow>
                          <mrow>
                            <mo>ẟ</mo>
                            <mi>x</mi>
                          </mrow>
                        </mfrac>
                        <mfrac>
                          <mrow>
                            <mo>ẟ</mo>
                            <msub>
                              <mi>v</mi>
                              <mi>i</mi>
                            </msub>
                          </mrow>
                          <mrow>
                            <mo>ẟ</mo>
                            <mi>y</mi>
                          </mrow>
                        </mfrac>
                        <mo>-</mo>
                        <mfrac>
                          <mrow>
                            <mo>ẟ</mo>
                            <msub>
                              <mi>u</mi>
                              <mi>i</mi>
                            </msub>
                          </mrow>
                          <mrow>
                            <mo>ẟ</mo>
                            <mi>y</mi>
                          </mrow>
                        </mfrac>
                        <mfrac>
                          <mrow>
                            <mo>ẟ</mo>
                            <msub>
                              <mi>v</mi>
                              <mi>i</mi>
                            </msub>
                          </mrow>
                          <mrow>
                            <mo>ẟ</mo>
                            <mi>x</mi>
                          </mrow>
                        </mfrac>
                      </mrow>
                    </mfrac>
                  </MathData>
                </MathRow>
              </MathBlock>
              <Parargraph>
                The denominator of each of these equations is formally referred
                to as the determinant of the Jacobian of the system.
              </Parargraph>
              <Parargraph>
                This is the two-equation version of the Newton-Raphson method.
                As in the following example, it can be employed iteratively to
                home in on the roots of two simultaneous equations.
              </Parargraph>
            </section>
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, [setSidebarOpen]);
  const openSidebar = useCallback(() => {
    setSidebarOpen(true);
  }, [setSidebarOpen]);

  const [variablesList, setVariablesList] = useState<string[]>([]);
  const [initialValues, setInitialValues] = useState<{ [key: string]: string }>(
    {}
  );
  const [stoppingCriteria, setStoppingCriteria] = useState<{
    stoppingCriteria?: string;
    maxIterations: string;
    maxError: string;
  }>({
    maxIterations: "1000",
    maxError: "0.0000000000001",
  });
  const [governingEquations, setGoverningEquations] = useState<
    {
      [key: string]: string;
    }[]
  >([]);
  const [latex, setLatex] = useState<
    {
      [key: string]: string;
    }[]
  >([]);

  const [autoDifferentiate, setAutoDifferentiate] = useState(false);

  // const [results, setResults] = useState<result[] | undefined>(iterationResult);

  const {
    trigger,
    data: results,
    isMutating,
    error: resultError,
  } = useSWRMutation(
    "/api/user",
    async () => {
      const newInitialValue: { [key: string]: number } = {};
      for (const variable of variablesList) {
        newInitialValue[variable] = Number(initialValues[variable]);
      }
      const value = {
        variables: variablesList,
        eqns: governingEquations,
        initial_values: initialValues,
        stopping_criteria: {
          max_iterations: stoppingCriteria.maxIterations,
          max_error: stoppingCriteria.maxError,
        },
        auto_differentiate: autoDifferentiate,
      };
      console.log("values: ", JSON.stringify(value));
      let response: Response;
      const res = await fetch(
        "https://solver-python-api.onrender.com/systems-of-nonlinear-equations/newton-raphson",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(value),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        console.log("result error", result);
        if (typeof result.detail == "string") {
          throw new ResponseError("Bad fetch response", result.detail);
        } else {
          throw new ResponseError(
            "Bad fetch response",
            result.detail[0].loc[1] + " " + result.detail[0].msg
          );
        }
      }

      return result as Promise<{
        results: {
          iteration: number;
          values: { [key: string]: number };
          errors: { [key: string]: number };
        }[];
        diverge: boolean;
      }>;
    },
    {
      async onError(err, key, config) {
        toast.error((err as ResponseError).response);
        console.log("err.message", err.response);
      },
    }
  );

  console.log("data", results);
  console.log("resultError", resultError?.response);

  return (
    <div className="w-full h-screen flex">
      {/* <Component /> */}

      <Sidebar
        open={sidebarOpen}
        close={closeSidebar}
        setInitialSettings={(VL, IV, SC, GE, L, AD) => {
          setInitialValues(IV);
          setVariablesList(VL);
          setLatex(L);
          setStoppingCriteria(SC);
          setGoverningEquations(GE);
          setAutoDifferentiate(AD);
          setTimeout(() => {
            trigger();
          }, 200);
        }}
        running={isMutating}
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
                    <BreadcrumbPage>Newton-Raphson Method</BreadcrumbPage>
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
        {isMutating ? (
          <div className="flex-1">
            <div className="py-8 px-5">
              <Skeleton className="h-12 w-[300px] mb-6" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-[340px]" />
                <Skeleton className="h-4 w-[340px]" />
                <Skeleton className="h-4 w-[340px]" />
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Iteration</TableHead>
                  <TableHead>xi</TableHead>
                  <TableHead className="">Abs. Rel. Error (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    <Skeleton className="h-4 w-[80%]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[60%]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[70%]" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <Skeleton className="h-4 w-[80%]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[60%]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[70%]" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <Skeleton className="h-4 w-[80%]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[60%]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[70%]" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <Skeleton className="h-4 w-[80%]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[60%]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[70%]" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    <Skeleton className="h-4 w-[80%]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[60%]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[70%]" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <div className="my-6 flex justify-end px-5">
              <Skeleton className="h-12 w-[300px]" />
            </div>
          </div>
        ) : resultError ? (
          <div className="flex items-center justify-center w-full min-h-[400px] flex-col gap-2 p-4 text-center h-full">
            <MdError className="text-red-600" size={64} />

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-red-600">
                {(resultError as ResponseError).response}
              </h3>
              <p className="max-w-[600px] text-gray-500 dark:text-gray-400">
                Edit parameters and run computation to generate results
              </p>
            </div>
          </div>
        ) : results?.results.length ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="pt-8 px-5 pb-5">
              <p className="t text-gray-500 font-normal text-sm">
                <span>Number of iterations: </span>{" "}
                <span>{results.results.length}</span>
              </p>
              <div className="space-y-2">
                {variablesList.map((varible) => (
                  <p className="font-semibold" key={varible}>
                    <span>{varible}: </span>{" "}
                    <span>
                      {
                        results.results[results.results.length - 1].values[
                          varible
                        ]
                      }
                    </span>
                  </p>
                ))}
              </div>
            </div>
            {results.diverge && (
              <div className="px-5 pb-8">
                <Alert variant="destructive">
                  <ExclamationTriangleIcon className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Iteration was terminated because results were not
                    converging! Consider restructuring your governing equation.
                  </AlertDescription>
                </Alert>
              </div>
            )}
            <Table className="flex-1 overflow-scroll">
              {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
              <TableHeader className="sticky top-0 bg-white">
                <TableRow>
                  <TableHead className="w-[100px]">Iteration</TableHead>
                  {variablesList.map((varible) => (
                    <>
                      <TableCell>{varible}i</TableCell>
                      <TableCell>{varible}- Abs. Rel. Error (%)</TableCell>
                    </>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="h-100% overflow-auto">
                {results.results.map((r) => (
                  <TableRow key={r.iteration}>
                    <TableCell>{r.iteration}</TableCell>
                    {variablesList.map((varible) => (
                      <>
                        <TableCell>{r.values[varible]}</TableCell>
                        <TableCell>{r.errors[varible]}</TableCell>
                      </>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="my-6 flex justify-end px-5">
              <Button
                onClick={() => {
                  const newResults = [...results.results].map((r) => ({
                    itr: r.iteration,
                    ...r.values,
                  }));
                  const csv = generateCsv(csvConfig)(newResults);
                  download(csvConfig)(csv);
                }}
              >
                Export as CSV
              </Button>
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

// $$ \frac{668.06}{x}\cdot\left(1-\exp\left(-0.146843\cdot x\right)\right)-40 $$
