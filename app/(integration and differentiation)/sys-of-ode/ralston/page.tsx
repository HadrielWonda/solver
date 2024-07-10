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
import { Sidebar, odeSysSettings } from "./Sidebar";
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
import RKSection from "@/components/RKSection";

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
        <DialogTitle>Second-Order Runge-Kutta: Ralston’s Method</DialogTitle>
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
                      Second-Order Runge-Kutta: Ralston’s Method
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
          <div className="space-y-2">
            <div className="mb-12 mt-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-center mb-4">
                Second-Order Runge-Kutta: Ralston’s Method
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
              <RKSection />
              <section>
                <h4 className="bold font-bold my-2 text-left">
                  Second-Order Runge-Kutta: Ralston’s Method
                </h4>

                <Parargraph>
                  The second-order Runge-Kutta equation is
                </Parargraph>
                <MathBlock>
                  <MathRow>
                    <MathData>
                      <msubsup>
                        <mi>y</mi>
                        <mrow>
                          <mi>i</mi>
                          <mo>+</mo>
                          <mn>1</mn>
                        </mrow>
                      </msubsup>
                    </MathData>
                    <MathData>
                      <mo>=</mo>
                    </MathData>
                    <MathData>
                      <mi>y</mi>
                      <mi>i</mi>
                      <mo>+</mo>
                      <mo>(</mo>
                      <msub>
                        <mi>a</mi>
                        <mn>1</mn>
                      </msub>
                      <msub>
                        <mi>k</mi>
                        <mn>1</mn>
                      </msub>
                      <mo> </mo>
                      <mo>+</mo>
                      <mo> </mo>
                      <msub>
                        <mi>a</mi>
                        <mn>2</mn>
                      </msub>
                      <msub>
                        <mi>k</mi>
                        <mn>2</mn>
                      </msub>
                      <mo>)</mo>
                      <mo>&#x2219;</mo>
                      <mi>h</mi>
                    </MathData>
                  </MathRow>
                </MathBlock>
                <Parargraph>Where:</Parargraph>
                <MathBlock>
                  <MathRow>
                    <MathData>
                      <msub>
                        <mi>k</mi>
                        <mn>1</mn>
                      </msub>
                    </MathData>
                    <MathData>
                      <mo>=</mo>
                    </MathData>
                    <MathData>
                      <mi>f</mi>
                      <mo>(</mo>
                      <msub>
                        <mi>x</mi>
                        <mi>i</mi>
                      </msub>
                      <mo>,</mo>
                      <msub>
                        <mi>y</mi>
                        <mi>i</mi>
                      </msub>
                      <mo>)</mo>
                    </MathData>
                  </MathRow>
                  <MathRow>
                    <MathData>
                      <msub>
                        <mi>k</mi>
                        <mn>2</mn>
                      </msub>
                    </MathData>
                    <MathData>
                      <mo>=</mo>
                    </MathData>
                    <MathData>
                      <mi>f</mi>
                      <mo>(</mo>
                      <msub>
                        <mi>x</mi>
                        <mi>i</mi>
                      </msub>
                      <mo>+</mo>
                      <msub>
                        <mi>p</mi>
                        <mn>1</mn>
                      </msub>
                      <mi>h</mi>
                      <mo>,</mo>
                      <mo> </mo>
                      <msub>
                        <mi>y</mi>
                        <mi>i</mi>
                        <mo>+</mo>
                        <msub>
                          <mi>q</mi>
                          <mn>11</mn>
                        </msub>
                        <msub>
                          <mi>k</mi>
                          <mn>1</mn>
                        </msub>
                        <mo>&#x2219;</mo>
                        <mi>h</mi>
                      </msub>
                      <mo>)</mo>
                    </MathData>
                  </MathRow>
                </MathBlock>
                <Parargraph>
                  Values for al, a2, p1, and q11 are evaluated by setting the
                  equation equal to a Taylor series expansion to the
                  second-order term. By doing this, we derive three equations to
                  evaluate the four unknown constants. The three equations are
                </Parargraph>
                <MathBlock>
                  <MathRow>
                    <MathData>
                      <msub>
                        <mi>a</mi>
                        <mn>1</mn>
                      </msub>
                      <mo>+</mo>
                      <msub>
                        <mi>a</mi>
                        <mn>2</mn>
                      </msub>
                    </MathData>
                    <MathData>
                      <mo>=</mo>
                    </MathData>
                    <MathData>
                      <mn>1</mn>
                    </MathData>
                  </MathRow>
                  <MathRow>
                    <MathData>
                      <msub>
                        <mi>a</mi>
                        <mn>2</mn>
                      </msub>
                      <msub>
                        <mi>p</mi>
                        <mn>1</mn>
                      </msub>
                    </MathData>
                    <MathData>
                      <mo>=</mo>
                    </MathData>
                    <MathData>
                      <mfrac>
                        <mn>1</mn>
                        <mn>2</mn>
                      </mfrac>
                    </MathData>
                  </MathRow>
                  <MathRow>
                    <MathData>
                      <msub>
                        <mi>a</mi>
                        <mn>2</mn>
                      </msub>
                      <msub>
                        <mi>q</mi>
                        <mn>11</mn>
                      </msub>
                    </MathData>
                    <MathData>
                      <mo>=</mo>
                    </MathData>
                    <MathData>
                      <mfrac>
                        <mn>1</mn>
                        <mn>2</mn>
                      </mfrac>
                    </MathData>
                  </MathRow>
                </MathBlock>
                <Parargraph>
                  Ralston (1962) and Ralston and Rabinowitz (1978) determined
                  that choosing{" "}
                  <math>
                    <msub>
                      <mi>a</mi>
                      <mn>2</mn>
                    </msub>
                    <mo>=</mo>{" "}
                    <mfrac>
                      <mn>2</mn>
                      <mn>3</mn>
                    </mfrac>
                  </math>{" "}
                  provides a minimum bound on the truncation error for the
                  second-order RK algorithms. For this version,{" "}
                  <math>
                    <msub>
                      <mi>a</mi>
                      <mn>1</mn>
                    </msub>
                    <mo>=</mo>{" "}
                    <mfrac>
                      <mn>1</mn>
                      <mn>3</mn>
                    </mfrac>
                  </math>{" "}
                  and{" "}
                  <math>
                    <msub>
                      <mi>p</mi>
                      <mn>1</mn>
                    </msub>
                    <mo>=</mo>{" "}
                    <msub>
                      <mi>q</mi>
                      <mn>11</mn>
                    </msub>
                    <mo>=</mo>{" "}
                    <mfrac>
                      <mn>3</mn>
                      <mn>4</mn>
                    </mfrac>
                  </math>{" "}
                  and yields
                </Parargraph>
                <MathBlock>
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
                    <MathData>
                      <mi>y</mi>
                      <mi>i</mi>
                      <mo>+</mo>

                      <mo>(</mo>
                      <mfrac>
                        <mn>1</mn>
                        <mn>3</mn>
                      </mfrac>
                      <msub>
                        <mi>k</mi>
                        <mn>1</mn>
                      </msub>
                      <mo>+</mo>
                      <mfrac>
                        <mn>2</mn>
                        <mn>3</mn>
                      </mfrac>
                      <msub>
                        <mi>k</mi>
                        <mn>2</mn>
                      </msub>
                      <mo>)</mo>
                      <mo>&#x2219;</mo>
                      <mi>h</mi>
                    </MathData>
                  </MathRow>
                </MathBlock>
                <Parargraph>Where</Parargraph>
                <MathBlock>
                  <MathRow>
                    <MathData>
                      <msub>
                        <mi>k</mi>
                        <mn>1</mn>
                      </msub>
                    </MathData>
                    <MathData>
                      <mo>=</mo>
                    </MathData>
                    <MathData>
                      <mi>f</mi>
                      <mo>(</mo>
                      <msub>
                        <mi>x</mi>
                        <mi>i</mi>
                      </msub>
                      <mo>,</mo>
                      <msub>
                        <mi>y</mi>
                        <mi>i</mi>
                      </msub>
                      <mo>)</mo>
                    </MathData>
                  </MathRow>
                  <MathRow>
                    <MathData>
                      <msub>
                        <mi>k</mi>
                        <mn>2</mn>
                      </msub>
                    </MathData>
                    <MathData>
                      <mo>=</mo>
                    </MathData>
                    <MathData>
                      <mi>f</mi>
                      <mo>(</mo>
                      <msub>
                        <mi>x</mi>
                        <mi>i</mi>
                      </msub>
                      <mo>+</mo>
                      <mfrac>
                        <mn>3</mn>
                        <mn>4</mn>
                      </mfrac>
                      <mi>h</mi>
                      <mo>, </mo>
                      <msub>
                        <mi>y</mi>
                        <mi>i</mi>
                      </msub>
                      <mo>+</mo>
                      <mfrac>
                        <mn>3</mn>
                        <mn>4</mn>
                      </mfrac>
                      <msub>
                        <mi>k</mi>
                        <mn>1</mn>
                      </msub>
                      <mo>&#x2219;</mo>
                      <mi>h</mi>
                      <mo>)</mo>
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
  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, [setSidebarOpen]);
  const openSidebar = useCallback(() => {
    setSidebarOpen(true);
  }, [setSidebarOpen]);

  const [initialValues, setInitialValues] = useState<
    | {
        equations: {
          equation: string;
          latex: string;
        }[];
        initialValues: number[];
        x1: number;
        x2: number;
        h: number;
      }
    | undefined
  >();

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
        const res = await fetch("http://127.0.0.1:8000/sys-of-ode/ralston", {
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

        return result as Promise<
          {
            iteration: number;
            x: number;
            y: number[];
          }[]
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

  // console.log("data", results);
  // console.log("resultError", resultError?.response);

  return (
    <div className="w-full h-screen flex">
      {/* <Component /> */}

      <Sidebar
        open={sidebarOpen}
        close={closeSidebar}
        setInitialSettings={(settings: odeSysSettings) => {
          setInitialValues({
            ...settings,
            x1: Number(settings.x1),
            x2: Number(settings.x2),
            h: Number(settings.h),
            initialValues: settings.initialValues.map((v) => Number(v)),
          });
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
                    <BreadcrumbPage>
                      Second-Order Runge-Kutta: Ralston’s Method
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
                  <TableHead>
                    <math>
                      <msub>
                        <mi>x</mi>
                        <mi>i</mi>
                      </msub>
                    </math>
                  </TableHead>
                  <TableHead>
                    <math>
                      <msub>
                        <mi>y</mi>
                        <mi>1</mi>
                      </msub>
                    </math>
                  </TableHead>
                  <TableHead className="">
                    <math>
                      <msub>
                        <mi>y</mi>
                        <mi>2</mi>
                      </msub>
                    </math>
                  </TableHead>
                  <TableHead className="">
                    <math>
                      <msub>
                        <mi>y</mi>
                        <mi>3</mi>
                      </msub>
                    </math>
                  </TableHead>
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
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="py-8 px-5">
              <h3 className="text-2xl font-bold text-gray-500">Results</h3>
              <div className="flex flex-col gap-2 mb-6">
                {initialValues?.equations.map((eq, i) => (
                  <div
                    className="flex flex-1 gap-2 overflow-hidden text-ellipsis"
                    key={i}
                  >
                    <span className="whitespace-nowrap font-[1.2rem]">
                      <math>
                        <mfrac>
                          <mrow>
                            <mi>d</mi>
                            <msub>
                              <mi>y</mi>
                              <mn>{i + 1}</mn>
                            </msub>
                          </mrow>
                          <mrow>
                            <mi>d</mi>
                            <mi>x</mi>
                          </mrow>
                        </mfrac>
                      </math>{" "}
                      =
                    </span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: mathlive.convertLatexToMarkup(eq.latex),
                      }}
                      style={{
                        fontSize: "1.2rem",
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <p>Initial values</p>
                <div className="flex flex-col gap-2">
                  {initialValues?.initialValues.map((v, i) => (
                    <p className="t text-gray-500 font-normal text-sm" key={i}>
                      <span>
                        <math>
                          <msub>
                            <mi>y</mi>
                            <mn>{i + 1}</mn>
                          </msub>
                        </math>
                        :{" "}
                      </span>
                      <span>{v}</span>
                    </p>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="t text-gray-500 font-normal text-sm">
                  <span>x: </span>{" "}
                  <span>
                    {initialValues?.x1} - {initialValues?.x2}
                  </span>
                </p>
                <p className="t text-gray-500 font-normal text-sm">
                  <span>Step size (h): </span> <span>{initialValues?.h}</span>
                </p>
              </div>
            </div>
            <Table className="flex-1 overflow-scroll">
              {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
              <TableHeader className="sticky top-0 bg-white">
                <TableRow>
                  <TableHead className="w-[100px]">Iteration</TableHead>
                  <TableHead>
                    <math>
                      <msub>
                        <mi>x</mi>
                        <mi>i</mi>
                      </msub>
                    </math>
                  </TableHead>
                  {results[0].y.map((_, i) => (
                    <TableHead key={i}>
                      <math>
                        <msub>
                          <mi>y</mi>
                          <mi>{i + 1}</mi>
                        </msub>
                      </math>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="h-100% overflow-auto">
                {results.map((r) => (
                  <TableRow key={r.iteration}>
                    <TableCell>{r.iteration}</TableCell>
                    <TableCell>{r.x}</TableCell>
                    {r.y.map((y, i) => (
                      <TableCell key={i} className="font-medium">
                        {y}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="my-6 flex justify-end px-5">
              <Button
                onClick={() => {
                  const newResults = [...results];
                  // newResults[0].ea = 0;
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
