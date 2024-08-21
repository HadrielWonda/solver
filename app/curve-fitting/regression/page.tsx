/* eslint-disable react/no-unescaped-entities */
"use client";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import "../../../public/prism.css";
import Prism from "../../../public/prism.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdError } from "react-icons/md";
import { Sidebar, regressionSettings } from "./Sidebar";
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
import { FunctionPlot, FunctionPlotProps } from "@/lib/graph/FunctionPlot";
import { capitalize, generatePolynomialEqaution } from "@/lib/utils";

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
        <DialogTitle>Linear Regression</DialogTitle>
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
                    <BreadcrumbPage>Least-Squares Regression</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
          <div className="space-y-2">
            <div className="mb-12 mt-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-center mb-4">
                Least-Squares Regression
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
              {/* <NewtonCotesSection /> */}
              <section>
                {/* <h4 className="bold font-bold my-2 text-left">
                  Linear Regression
                </h4> */}

                <Parargraph>
                  Regression is a statistical technique that relates a dependent
                  variable to one or more independent variables. A regression
                  model is able to show whether changes observed in the
                  dependent variable are associated with changes in one or more
                  of the independent variables.
                </Parargraph>
                <h4 className="bold font-bold mb-2 mt-4 text-left">
                  Linear Regression is a simple method to fit set of data that
                  tends to vary linearly. The fitted function is assumed in the
                  form:
                </h4>
                <MathBlock>
                  <MathRow>
                    <MathData>
                      <mi>g</mi>
                      <mo>(</mo>
                      <mi>x</mi>
                      <mo>)</mo>
                    </MathData>
                    <MathData>
                      <mo>=</mo>
                    </MathData>
                    <MathData>
                      <msub>
                        <mi>a</mi>
                        <mn>0</mn>
                      </msub>
                      <mo>+</mo>
                      <msub>
                        <mi>a</mi>
                        <mn>1</mn>
                      </msub>
                      <mi>x</mi>
                    </MathData>
                  </MathRow>
                </MathBlock>
                <Parargraph>
                  Where a0 and a1 are the unknown coefficients to be determined
                  later.
                </Parargraph>
                <Image
                  src="/images/linear-regression.png"
                  alt="linear regression"
                  width={544}
                  height={370}
                  className="mx-auto max-w-full my-4"
                />
                <Parargraph>
                  As shown above, the data{" "}
                  <math>
                    <msub>
                      <mi>y</mi>
                      <mi>i</mi>
                    </msub>
                  </math>{" "}
                  at a typical location{" "}
                  <math>
                    <msub>
                      <mi>x</mi>
                      <mi>i</mi>
                    </msub>
                  </math>{" "}
                  differs from the value of the fitted function g(x) as{" "}
                  <math>
                    <mi>d</mi>
                    <mo>(</mo>
                    <msub>
                      <mi>x</mi>
                      <mi>i</mi>
                    </msub>
                    <mo>)</mo>
                  </math>
                  . The idea behind the least-squares method is to minimize the
                  squares of the differences between the data and the fitted
                  function. The sum of the squares of the differences is given
                  by:
                </Parargraph>
                <MathBlock>
                  <MathRow>
                    <MathData>
                      <mi>E</mi>
                    </MathData>
                    <MathData>
                      <mo>=</mo>
                    </MathData>
                    <MathData>
                      <msubsup>
                        {/* @ts-ignore */}
                        <mo stretchy={true}>∑</mo>
                        <mrow>
                          <mi>i</mi>
                          <mo>=</mo>
                          <ms>1</ms>
                        </mrow>
                        <mi>n</mi>
                      </msubsup>
                      <msup>
                        <mrow>
                          <mo>[</mo>
                          <mo>d</mo>
                          <mo>(</mo>
                          <msub>
                            <mi>x</mi>
                            <mi>i</mi>
                          </msub>
                          <mo>)</mo>
                          <mo>]</mo>
                        </mrow>
                        <mn>2</mn>
                      </msup>
                    </MathData>
                  </MathRow>
                  <MathRow>
                    <MathData>
                      <mi>E</mi>
                    </MathData>
                    <MathData>
                      <mo>=</mo>
                    </MathData>
                    <MathData>
                      <msubsup>
                        {/* @ts-ignore */}
                        <mo stretchy={true}>∑</mo>
                        <mrow>
                          <mi>i</mi>
                          <mo>=</mo>
                          <ms>1</ms>
                        </mrow>
                        <mi>n</mi>
                      </msubsup>
                      <msup>
                        <mrow>
                          <mo>[</mo>
                          <msub>
                            <mi>y</mi>
                            <mi>i</mi>
                          </msub>
                          <mo>-</mo>
                          <mo>g</mo>
                          <mo>(</mo>
                          <msub>
                            <mi>x</mi>
                            <mi>i</mi>
                          </msub>
                          <mo>)</mo>
                          <mo>]</mo>
                        </mrow>
                        <mn>2</mn>
                      </msup>
                    </MathData>
                  </MathRow>
                  <MathRow>
                    <MathData>
                      <mi>E</mi>
                    </MathData>
                    <MathData>
                      <mo>=</mo>
                    </MathData>
                    <MathData>
                      <msubsup>
                        {/* @ts-ignore */}
                        <mo stretchy={true}>∑</mo>
                        <mrow>
                          <mi>i</mi>
                          <mo>=</mo>
                          <ms>1</ms>
                        </mrow>
                        <mi>n</mi>
                      </msubsup>
                      <msup>
                        <mrow>
                          <mo>[</mo>
                          <msub>
                            <mi>y</mi>
                            <mi>i</mi>
                          </msub>
                          <mo>-</mo>
                          <mo>(</mo>
                          <msub>
                            <mi>a</mi>
                            <mi>0</mi>
                          </msub>
                          <mo>+</mo>
                          <msub>
                            <mi>a</mi>
                            <mi>1</mi>
                          </msub>
                          <msub>
                            <mi>x</mi>
                            <mi>i</mi>
                          </msub>
                          <mo>)</mo>
                          <mo>]</mo>
                        </mrow>
                        <mn>2</mn>
                      </msup>
                    </MathData>
                  </MathRow>
                </MathBlock>
                <Parargraph>
                  The least square method is based on results from calculus
                  demonstration that a function has a minimum value when its
                  partial derivates are zero. Thus by performing minimization of
                  the function E with respect to the unknown co-efficients, two
                  equations are obtained. By using Crammer's rule to solve these
                  equations, the two unknkow co-efficients can be obtained as
                  follow:
                </Parargraph>
                <MathBlock>
                  <MathRow>
                    <MathData>
                      <msub>
                        <mi>a</mi>
                        <mn>0</mn>
                      </msub>
                    </MathData>
                    <MathData>
                      <mo>=</mo>
                    </MathData>
                    <MathData>
                      <mfrac>
                        <mrow>
                          {/* @ts-ignore */}
                          <mo stretchy={true}>(</mo>
                          <msubsup>
                            {/* @ts-ignore */}
                            <mo stretchy={true}>∑</mo>
                            <mrow>
                              <mi>i</mi>
                              <mo>=</mo>
                              <ms>1</ms>
                            </mrow>
                            <mi>n</mi>
                          </msubsup>
                          <msub>
                            <mi>y</mi>
                            <mi>i</mi>
                          </msub>
                          {/* @ts-ignore */}
                          <mo stretchy={true}>)</mo>
                          {/* @ts-ignore */}
                          <mo stretchy={true}>(</mo>
                          <msubsup>
                            {/* @ts-ignore */}
                            <mo stretchy={true}>∑</mo>
                            <mrow>
                              <mi>i</mi>
                              <mo>=</mo>
                              <ms>1</ms>
                            </mrow>
                            <mi>n</mi>
                          </msubsup>
                          <msubsup>
                            <mi>x</mi>
                            <mi>i</mi>
                            <mn>2</mn>
                          </msubsup>
                          {/* @ts-ignore */}
                          <mo stretchy={true}>)</mo>
                          <mo>-</mo>
                          {/* @ts-ignore */}
                          <mo stretchy={true}>(</mo>
                          <msubsup>
                            {/* @ts-ignore */}
                            <mo stretchy={true}>∑</mo>
                            <mrow>
                              <mi>i</mi>
                              <mo>=</mo>
                              <ms>1</ms>
                            </mrow>
                            <mi>n</mi>
                          </msubsup>
                          <msub>
                            <mi>x</mi>
                            <mi>i</mi>
                          </msub>
                          <msub>
                            <mi>y</mi>
                            <mi>i</mi>
                          </msub>
                          {/* @ts-ignore */}
                          <mo stretchy={true}>)</mo>
                          {/* @ts-ignore */}
                          <mo stretchy={true}>(</mo>
                          <msubsup>
                            {/* @ts-ignore */}
                            <mo stretchy={true}>∑</mo>
                            <mrow>
                              <mi>i</mi>
                              <mo>=</mo>
                              <ms>1</ms>
                            </mrow>
                            <mi>n</mi>
                          </msubsup>
                          <msub>
                            <mi>x</mi>
                            <mi>i</mi>
                          </msub>
                          {/* @ts-ignore */}
                          <mo stretchy={true}>)</mo>
                        </mrow>
                        <mrow>
                          <mi>n</mi>
                          {/* @ts-ignore */}
                          <mo stretchy={true}>(</mo>
                          <msubsup>
                            {/* @ts-ignore */}
                            <mo stretchy={true}>∑</mo>
                            <mrow>
                              <mi>i</mi>
                              <mo>=</mo>
                              <ms>1</ms>
                            </mrow>
                            <mi>n</mi>
                          </msubsup>
                          <msubsup>
                            <mi>x</mi>
                            <mi>i</mi>
                            <mn>2</mn>
                          </msubsup>
                          {/* @ts-ignore */}
                          <mo stretchy={true}>)</mo>
                          <mo>-</mo>
                          <msup>
                            {/* @ts-ignore */}
                            <mo stretchy={true}>(</mo>
                            <msubsup>
                              {/* @ts-ignore */}
                              <mo stretchy={true}>∑</mo>
                              <mrow>
                                <mi>i</mi>
                                <mo>=</mo>
                                <ms>1</ms>
                              </mrow>
                              <mi>n</mi>
                            </msubsup>
                            <msub>
                              <mi>x</mi>
                              <mi>i</mi>
                            </msub>
                            {/* @ts-ignore */}

                            <mo stretchy={true}>)</mo>
                            <mn>2</mn>
                          </msup>
                        </mrow>
                      </mfrac>
                    </MathData>
                  </MathRow>
                  <MathRow>
                    <MathData>
                      <msub>
                        <mi>a</mi>
                        <mn>1</mn>
                      </msub>
                    </MathData>
                    <MathData>
                      <mo>=</mo>
                    </MathData>
                    <MathData>
                      <mfrac>
                        <mrow>
                          <mi>n</mi>
                          {/* @ts-ignore */}
                          <mo stretchy={true}>(</mo>
                          <msubsup>
                            {/* @ts-ignore */}
                            <mo stretchy={true}>∑</mo>
                            <mrow>
                              <mi>i</mi>
                              <mo>=</mo>
                              <ms>1</ms>
                            </mrow>
                            <mi>n</mi>
                          </msubsup>
                          <msub>
                            <mi>x</mi>
                            <mi>i</mi>
                          </msub>
                          <msub>
                            <mi>y</mi>
                            <mi>i</mi>
                          </msub>
                          {/* @ts-ignore */}
                          <mo stretchy={true}>)</mo>
                          <mo>-</mo>
                          {/* @ts-ignore */}
                          <mo stretchy={true}>(</mo>
                          <msubsup>
                            {/* @ts-ignore */}
                            <mo stretchy={true}>∑</mo>
                            <mrow>
                              <mi>i</mi>
                              <mo>=</mo>
                              <ms>1</ms>
                            </mrow>
                            <mi>n</mi>
                          </msubsup>
                          <msub>
                            <mi>x</mi>
                            <mi>i</mi>
                          </msub>
                          {/* @ts-ignore */}
                          <mo stretchy={true}>)</mo>
                          {/* @ts-ignore */}
                          <mo stretchy={true}>(</mo>
                          <msubsup>
                            {/* @ts-ignore */}
                            <mo stretchy={true}>∑</mo>
                            <mrow>
                              <mi>i</mi>
                              <mo>=</mo>
                              <ms>1</ms>
                            </mrow>
                            <mi>n</mi>
                          </msubsup>
                          <msub>
                            <mi>y</mi>
                            <mi>i</mi>
                          </msub>
                          {/* @ts-ignore */}
                          <mo stretchy={true}>)</mo>
                        </mrow>
                        <mrow>
                          <mi>n</mi>
                          {/* @ts-ignore */}
                          <mo stretchy={true}>(</mo>
                          <msubsup>
                            {/* @ts-ignore */}
                            <mo stretchy={true}>∑</mo>
                            <mrow>
                              <mi>i</mi>
                              <mo>=</mo>
                              <ms>1</ms>
                            </mrow>
                            <mi>n</mi>
                          </msubsup>
                          <msubsup>
                            <mi>x</mi>
                            <mi>i</mi>
                            <mn>2</mn>
                          </msubsup>
                          {/* @ts-ignore */}
                          <mo stretchy={true}>)</mo>
                          <mo>-</mo>
                          <msup>
                            {/* @ts-ignore */}
                            <mo stretchy={true}>(</mo>
                            <msubsup>
                              {/* @ts-ignore */}
                              <mo stretchy={true}>∑</mo>
                              <mrow>
                                <mi>i</mi>
                                <mo>=</mo>
                                <ms>1</ms>
                              </mrow>
                              <mi>n</mi>
                            </msubsup>
                            <msub>
                              <mi>x</mi>
                              <mi>i</mi>
                            </msub>
                            {/* @ts-ignore */}

                            <mo stretchy={true}>)</mo>
                            <mn>2</mn>
                          </msup>
                        </mrow>
                      </mfrac>
                    </MathData>
                  </MathRow>
                </MathBlock>
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

  const [data, setData] = useState<undefined | string[][]>();

  const [models, setModels] = useState<
    | {
        x: number[];
        y: number[];
        models: (
          | {
              type: "linear";
              name: string;
              x: string;
              y: string;
            }
          | {
              degree: string;
              type: "polynomial";
              name: string;
            }
        )[];
      }
    | undefined
  >();
  // {
  //   models: [{ type: "linear", x: "log(x)", y: "log(y)" }],
  // }

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
          "https://solver-python-api.onrender.com/regression/linear",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(models),
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

        return result as Promise<
          (
            | {
                m: string;
                c: string;
                y_expr: string;
                type: "linear";
                name: string;
              }
            | {
                a: string[];
                degree: string;
                type: "polynomial";
                name: string;
              }
          )[]
        >;
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

  useEffect(() => {
    if (!data) reset();
  }, [data, reset]);

  // console.log("data", results);
  // console.log("resultError", resultError?.response);

  // Graph logics
  const [size, setSize] = useState<
    undefined | { width: number; height: number }
  >();

  const elementRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      setSize({
        width: rect.width,
        height: rect.height,
      }); // Should now be non-zero
    }
  }, []);

  const [resultIndex, setResultIndex] = useState(0);

  const points = useMemo(() => {
    if (!data || data.length > 2) return [];
    return Array(data[0].length)
      .fill(0)
      .map((_, i) => [Number(data[1][i]), Number(data[0][i])]);
  }, [data]);

  const options = useMemo(() => {
    if (!data || !size) return;

    const minX = Math.min(...data[1].map(Number));
    const maxX = Math.max(...data[1].map(Number)),
      toleranceX = (maxX - minX) / 6;

    const minY = Math.min(...data[0].map(Number));
    const maxY = Math.max(...data[0].map(Number)),
      toleranceY = (maxY - minY) / 6;
    return {
      data: [
        ...(results
          ? [
              {
                points,
                fnType: "points",
                color: "red",
                graphType: "scatter",
              },
              {
                fn:
                  results[resultIndex].type == "linear"
                    ? (
                        results[resultIndex] as {
                          m: string;
                          c: string;
                          y_expr: string;
                          type: "linear";
                          name: string;
                        }
                      ).y_expr.replace("**", "^")
                    : generatePolynomialEqaution(
                        (
                          results[resultIndex] as {
                            a: string[];
                            degree: string;
                            type: "polynomial";
                            name: string;
                          }
                        ).a
                      ),
                color: "blue",
              },
            ]
          : [
              {
                points,
                fnType: "points",
                color: "red",
                graphType: "scatter",
              },
            ]),
      ],
      grid: true,
      xAxis: {
        type: "linear",
        domain: [minX - toleranceX, maxX + toleranceX],
      },
      yAxis: {
        type: "linear",
        domain: [minY - toleranceY, maxY + toleranceY],
      },
      tip: undefined,
      ...(results ? { width: size?.width, height: size.height - 60 } : size),
      ...(results
        ? {
            title: `y = ${
              results[resultIndex].type == "linear"
                ? (
                    results[resultIndex] as {
                      m: string;
                      c: string;
                      y_expr: string;
                      type: "linear";
                      name: string;
                    }
                  ).y_expr.replace("**", "^")
                : generatePolynomialEqaution(
                    (
                      results[resultIndex] as {
                        a: string[];
                        degree: string;
                        type: "polynomial";
                        name: string;
                      }
                    ).a
                  )
            }`,
            xAxis: {
              label: "x - axis",
              type: "linear",
              domain: [minX - toleranceX, maxX + toleranceX],
            },
            yAxis: {
              label: "y - axis",

              type: "linear",
              domain: [minY - toleranceY, maxY + toleranceY],
            },
          }
        : {}),
    };
  }, [size, points, results, resultIndex, data]);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      setSize({
        width: rect.width,
        height: rect.height,
      }); // Should now be non-zero
    }
  }, [setSidebarOpen]);

  const openSidebar = useCallback(() => {
    setSidebarOpen(true);
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      setSize({
        width: rect.width,
        height: rect.height,
      }); // Should now be non-zero
    }
  }, [setSidebarOpen]);

  return (
    <div className="w-full h-screen flex">
      {/* <Component /> */}

      <Sidebar
        open={sidebarOpen}
        close={closeSidebar}
        setInitialSettings={(settings: regressionSettings) => {
          if (!data) return;
          setModels({
            ...settings,
            x: data[1].map(Number),
            y: data[0].map(Number),
          });
          setTimeout(() => {
            trigger();
          }, 200);
        }}
        running={isMutating}
        data={data}
        setData={setData}
      />
      <div className="flex-1 flex flex-col w-full h-screen relative overflow-y-hidden">
        <div className="pt-3 px-5 flex items-center gap-3 justify-between w-full">
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
                    <BreadcrumbPage>Linear Regression</BreadcrumbPage>
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

        {results && data?.length == 2 ? (
          <div className="px-5 pt-3">
            <Tabs
              defaultValue={models?.models[0].name}
              // className="w-[400px]"
            >
              <TabsList className="w-fit">
                {models?.models.map((model, i) => (
                  <TabsTrigger
                    key={i}
                    value={model.name}
                    onClick={() => setResultIndex(i)}
                  >
                    {capitalize(model.name)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        ) : null}

        <div ref={elementRef} className="flex-1">
          {data && data.length == 2 ? (
            // Graph
            <FunctionPlot options={options as any} />
          ) : (
            <>
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
                        <TableHead>x0</TableHead>
                        <TableHead>x1</TableHead>
                        <TableHead>x2</TableHead>
                        <TableHead className="">xr</TableHead>
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
                        <TableCell className="text-right">
                          <Skeleton className="h-4 w-[50%]" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-4 w-[50%]" />
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
                        <TableCell className="text-right">
                          <Skeleton className="h-4 w-[50%]" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-4 w-[50%]" />
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
                        <TableCell className="text-right">
                          <Skeleton className="h-4 w-[50%]" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-4 w-[50%]" />
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
                        <TableCell className="text-right">
                          <Skeleton className="h-4 w-[50%]" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-4 w-[50%]" />
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
                        <TableCell className="text-right">
                          <Skeleton className="h-4 w-[50%]" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-4 w-[50%]" />
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
                      {resultError?.response}
                    </h3>
                    <p className="max-w-[600px] text-gray-500 dark:text-gray-400">
                      Edit parameters and run computation to generate results
                    </p>
                  </div>
                </div>
              ) : results ? (
                <div className="flex items-center justify-center w-full min-h-[400px] flex-col gap-2 p-4 text-center h-full">
                  <div className="py-8 px-5">
                    <div className="flex flex-1 gap-2 overflow-hidden text-ellipsis mb-6">
                      <span className="whitespace-nowrap font-[1.2rem]">
                        f(x) ={" "}
                      </span>
                      {/* <span
                      dangerouslySetInnerHTML={{
                        __html: mathlive.convertLatexToMarkup(latex),
                      }}
                      style={{
                        fontSize: "1.2rem",
                      }}
                    /> */}
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold">
                        {/* <span>dy/dx: </span> <span>{results}</span> */}
                      </p>
                      {/* <p className="t text-gray-500 font-normal text-sm">
          <span>Relative Absolute Error: </span>{" "}
          <span>{results.results[results.results.length - 1].ea}%</span>
        </p>
        <p className="t text-gray-500 font-normal text-sm">
          <span>Number of iterations: </span>{" "}
          <span>{results.results.length}</span>
        </p> */}
                    </div>
                  </div>
                  <div className="flex gap-4 mt-8">
                    <Button onClick={() => trigger()}>Rerun</Button>
                    <Button
                      onClick={() => {
                        reset();
                        setModels(undefined);
                      }}
                      variant="destructive"
                    >
                      Reset
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// $$ \frac{668.06}{x}\cdot\left(1-\exp\left(-0.146843\cdot x\right)\right)-40 $$

{
  /* <div className="flex-1">
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
        <TableHead>x0</TableHead>
        <TableHead>x1</TableHead>
        <TableHead>x2</TableHead>
        <TableHead className="">xr</TableHead>
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
        <TableCell className="text-right">
          <Skeleton className="h-4 w-[50%]" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-4 w-[50%]" />
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
        <TableCell className="text-right">
          <Skeleton className="h-4 w-[50%]" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-4 w-[50%]" />
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
        <TableCell className="text-right">
          <Skeleton className="h-4 w-[50%]" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-4 w-[50%]" />
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
        <TableCell className="text-right">
          <Skeleton className="h-4 w-[50%]" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-4 w-[50%]" />
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
        <TableCell className="text-right">
          <Skeleton className="h-4 w-[50%]" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-4 w-[50%]" />
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
</div>; */
}
