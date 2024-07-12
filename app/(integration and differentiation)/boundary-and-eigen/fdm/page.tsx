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
import { Sidebar, boundarySettings } from "./Sidebar";
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
import NewtonCotesSection from "@/components/NewtonCotesSection";
import Image from "next/image";
import ODESection from "@/components/ODESection";

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, [setSidebarOpen]);
  const openSidebar = useCallback(() => {
    setSidebarOpen(true);
  }, [setSidebarOpen]);

  const [initialValues, setInitialValues] = useState<
    | {
        equation: string;
        latex: string;
        x_0: number;
        x_L: number;
        y_0: number;
        y_L: number;
        h: number;
        n: number;
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
        const res = await fetch("http://127.0.0.1:8000/bvp/finite-difference", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(initialValues),
        });

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

        return result as Promise<{
          disc_eqn: string;
          matrix: [number][];
          constant_matrix: [number][];
          solution: [number][];
        }>;
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

  // console.log("data", results);
  // console.log("resultError", resultError?.response);

  return (
    <div className="w-full h-screen flex">
      {/* <Component /> */}

      <Sidebar
        open={sidebarOpen}
        close={closeSidebar}
        setInitialSettings={(settings: boundarySettings) => {
          setInitialValues({
            ...settings,
            x_0: Number(settings.x_0),
            x_L: Number(settings.x_L),
            y_0: Number(settings.y_0),
            y_L: Number(settings.y_L),
            h: Number(settings.h),
            n:
              (Number(settings.x_L) - Number(settings.x_0)) /
              Number(settings.h),
          });
          setLatex(settings.equation);
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
                    <BreadcrumbPage>Finite Difference Method</BreadcrumbPage>
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
          <div className="flex items-center justify-center w-full min-h-[400px] flex-col gap-2 p-4 text-center h-full">
            {/* Data visuals */}
            <Image
              src="/images/ode.png"
              alt="single trapezoid"
              width={674}
              height={360}
              className="mx-auto max-w-full my-4"
            />

            <>
              <h3 className="text-2xl font-bold text-gray-500 mb-2">
                Running Computation
              </h3>
              <Button
                className="w-full max-w-96 mx-auto mt-8"
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
            </>
          </div>
        ) : resultError ? (
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
          <div className="flex-1 flex flex-col overflow-hidden px-8">
            <div className="w-[60%] mx-auto relative mt-12 mb-14">
              <div className="w-full h-0.5 bg-black absolute top-1/2 translate-y-0.25" />

              <div className="w-full flex justify-between items-center translate-x-[-1px] relative">
                <div className="flex flex-col gap-2 justify-center items-center h-4 relative">
                  <p className="text text-xs absolute top-[-24px] whitespace-nowrap">
                    x = {initialValues?.x_0}
                  </p>
                  <div className="w-[2px] bg-black h-4" />
                  <p className="text text-xs absolute bottom-[-24px] whitespace-nowrap">
                    y= {initialValues?.y_0}
                  </p>
                </div>
                {initialValues
                  ? Array(initialValues?.n - 1 ?? 2)
                      .fill(0)
                      .map((_, i) => (
                        <div
                          className="flex flex-col gap-2 justify-center items-center"
                          key={i}
                        >
                          <p className="text text-xs whitespace-nowrap">
                            {initialValues?.x_0 + (i + 1) * initialValues?.h}
                          </p>
                          <div className="w-[2px] bg-black h-4" />
                          <p className="text text-xs whitespace-nowrap">
                            <math>
                              <msub>
                                <mi>y</mi>
                                <mn>{i + 1}</mn>
                              </msub>
                            </math>
                          </p>
                        </div>
                      ))
                  : null}
                <div className="flex flex-col gap-2 justify-center items-center translate-x-[1px] h-4 relative">
                  <p className="text text-xs absolute top-[-24px] whitespace-nowrap">
                    {initialValues?.x_L}
                  </p>
                  <div className="w-[2px] bg-black h-4" />
                  <p className="text text-xs absolute bottom-[-24px] whitespace-nowrap">
                    {initialValues?.y_L}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <span>Governing Equation: </span>
              <span
                dangerouslySetInnerHTML={{
                  __html: mathlive.convertLatexToMarkup(
                    initialValues?.latex
                      .replaceAll("y2", "\\frac{d^2y}{dx^2}")
                      .replaceAll("y1", "\\frac{dy}{dx}")
                  ),
                }}
                style={{
                  fontSize: "1.2rem",
                }}
              />
              <span> = 0</span>
            </div>
            <div className="mb-6">
              <span>Discretized Equation: </span>
              <span
                style={{
                  fontSize: "1.1rem",
                }}
                dangerouslySetInnerHTML={{
                  __html: results.disc_eqn
                    .replaceAll("r", "k")
                    .replaceAll(
                      "p",
                      `<math><msub><mi>y</mi><mrow><mi>i</mi><mo>-</mo><mn>1</mn></mrow></msub></math>`
                    )
                    .replaceAll(
                      "q",
                      `<math><msub><mi>y</mi><mi>i</mi></msub></math>`
                    )
                    .replaceAll(
                      "k",
                      `<math><msub><mi>y</mi><mrow><mi>i</mi><mo>+</mo><mn>1</mn></mrow></msub></math>`
                    ),
                }}
              />
            </div>

            <div className="mb-8">
              <p className="mb-2">System of equations</p>

              <span
                dangerouslySetInnerHTML={{
                  __html: mathlive.convertLatexToMarkup(
                    `\\begin{bmatrix}
  ${results.matrix
    .map((arr) =>
      arr.reduce(
        (acc, curr, ind) => (ind == 0 ? String(curr) : acc + " & " + curr),
        ""
      )
    )
    .join("\\\\")}
\\end{bmatrix} \\begin{Bmatrix}
  ${Array(initialValues?.n - 1 ?? 2)
    .fill(0)
    .map((_, i) => `y_{${i + 1}}`)
    .join("\\\\")}
\\end{Bmatrix} = \\begin{bmatrix}
  ${results.constant_matrix
    .map((arr) =>
      arr.reduce(
        (acc, curr, ind) => (ind == 0 ? String(curr) : acc + " & " + curr),
        ""
      )
    )
    .join("\\\\")}
\\end{bmatrix}`
                  ),
                }}
                style={{
                  fontSize: "1.4rem",
                }}
              />
            </div>
            <div className="m text-lg font-bold">
              <p className="mb-2 font-bold">Solution</p>

              <span>{`{y} = `}</span>
              <span
                dangerouslySetInnerHTML={{
                  __html: mathlive.convertLatexToMarkup(
                    `\\begin{bmatrix}
  ${results.solution
    .map((arr) =>
      arr.reduce(
        (acc, curr, ind) => (ind == 0 ? String(curr) : acc + " & " + curr),
        ""
      )
    )
    .join("\\\\")}
\\end{bmatrix}`
                  ),
                }}
              />
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
