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
import { fixedPointResult, result } from "@/types";
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
  response: any;
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
        <DialogTitle>Simple Fixed-Point Iteration</DialogTitle>
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
                      Simple Fixed-Point Iteration
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
          <div className="space-y-2">
            <div className="mb-12 mt-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-center mb-4">
                Simple Fixed-Point Iteration
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
                Open methods employ a formula to predict the root. Such a
                formula can be developed for simple fixed-point iteration (or,
                as it is also called, one-point iteration or successive
                substitution) by rearranging the function f(x) 5 0 so that x is
                on the left-hand side of the equation:
              </Parargraph>
              <MathBlock>
                <MathRow>
                  <MathData>
                    <mi>x</mi>
                  </MathData>
                  <MathData>
                    <mo>=</mo>
                  </MathData>
                  <MathData>
                    <mi>g</mi>
                    <mo>(</mo>
                    <mi>x</mi>
                    <mo>)</mo>
                  </MathData>
                </MathRow>
              </MathBlock>
              <Parargraph>
                This transformation can be accomplished either by algebraic
                manipulation or by simply adding x to both sides of the original
                equation. For example,
              </Parargraph>
              <MathBlock>
                <MathRow>
                  <MathData>
                    <msup>
                      <mi>x</mi>
                      <mn>2</mn>
                    </msup>
                    <mo>-</mo>
                    <mn>2</mn>
                    <mi>x</mi>
                    <mo>+</mo>
                    <mn>3</mn>
                  </MathData>
                  <MathData>
                    <mo>=</mo>
                  </MathData>
                  <MathData>
                    <mn>0</mn>
                  </MathData>
                </MathRow>
              </MathBlock>
              <Parargraph>can be simply manipulated to yield</Parargraph>
              <MathBlock>
                <MathRow>
                  <MathData>
                    <mi>x</mi>
                  </MathData>
                  <MathData>
                    <mo>=</mo>
                  </MathData>
                  <MathData>
                    <mfrac>
                      <mrow>
                        <msup>
                          <mi>x</mi>
                          <mn>2</mn>
                        </msup>
                        <mo>+</mo>
                        <mn>3</mn>
                      </mrow>
                      <mrow>
                        <mn>2</mn>
                      </mrow>
                    </mfrac>
                  </MathData>
                </MathRow>
              </MathBlock>
              <Parargraph>
                whereas{" "}
                <math>
                  <mo>sin</mo>
                  <mo>(</mo>
                  <mi>x</mi>
                  <mo>)</mo>
                  <mo>=</mo>
                  <mn>0</mn>
                </math>{" "}
                could be put into the form by adding x to both sides to yield
              </Parargraph>
              <MathBlock>
                <MathRow>
                  <MathData>
                    <mi>x</mi>
                  </MathData>
                  <MathData>
                    <mo>=</mo>
                  </MathData>
                  <MathData>
                    <mo>sin</mo>
                    <mo>(</mo>
                    <mi>x</mi>
                    <mo>)</mo>
                    <mo>+</mo>
                    <mi>x</mi>
                  </MathData>
                </MathRow>
              </MathBlock>
              <Parargraph>
                The utility of this equation is that it provides a formula to
                predict a new value of x as a function of an old value of x.
                Thus, given an initial guess at the root{" "}
                <math>
                  <msub>
                    <mi>x</mi>
                    <mi>i</mi>
                  </msub>
                </math>
                , the equation can be used to compute a new estimate{" "}
                <math>
                  <msub>
                    <mi>x</mi>
                    <mrow>
                      <mi>i</mi>
                      <mo>+</mo>
                      <mn>1</mn>
                    </mrow>
                  </msub>
                </math>{" "}
                as expressed by the iterative formula
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
                  <MathData>
                    <mo>g</mo>
                    <mo>(</mo>
                    <msub>
                      <mi>x</mi>
                      <mi>i</mi>
                    </msub>
                    <mo>)</mo>
                  </MathData>
                </MathRow>
              </MathBlock>
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

  const [initialValues, setInitialValues] = useState<{
    equation: string;
    start: string;
    stoppingCriteria: "max_error" | "max_iterations";
    maxIterations: number;
    maxError: number;
  }>({
    equation: "",
    start: "",
    stoppingCriteria: "max_iterations",
    maxIterations: 1000,
    maxError: 0.0000000000001,
  });
  const [latex, setLatex] = useState("");

  // const [results, setResults] = useState<result[] | undefined>(iterationResult);

  const {
    trigger,
    data: results,
    isMutating,
    error: resultError,
  } = useSWRMutation(
    "/api/user",
    async () => {
      console.log("initialValues", initialValues);
      const res = await fetch("/simple-fixed-point/api", {
        method: "post",
        body: JSON.stringify(initialValues),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new ResponseError("Bad fetch response", result);
      }

      return result as Promise<{
        diverge: boolean;
        results: fixedPointResult[];
      }>;
    },
    {
      async onError(err, key, config) {
        // if (err instanceof ResponseError) {
        //   // Handle known errors
        // } else {
        //   // Handle unexpected errors
        // }
        toast.error(err.response);
        console.log("err.message", err.response);
      },
    }
  );

  console.log("data", results);
  console.log("resultError", resultError);

  return (
    <div className="w-full h-screen flex">
      {/* <Component /> */}

      <Sidebar
        open={sidebarOpen}
        close={closeSidebar}
        setInitialSettings={(v, l) => {
          setInitialValues(v);
          setLatex(l);
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
                      Simple Fixed-Point Iteration
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
                {resultError.response}
              </h3>
              <p className="max-w-[600px] text-gray-500 dark:text-gray-400">
                Edit parameters and run computation to generate results
              </p>
            </div>
          </div>
        ) : results?.results.length ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="pt-8 px-5 pb-5">
              <div className="flex flex-1 gap-2 overflow-hidden text-ellipsis mb-6">
                <span className="whitespace-nowrap font-[1.2rem]">f(x) = </span>
                <span
                  dangerouslySetInnerHTML={{
                    __html: mathlive.convertLatexToMarkup(latex),
                  }}
                  style={{
                    fontSize: "1.2rem",
                  }}
                />
              </div>
              <div className="space-y-2">
                <p className="font-semibold">
                  <span>Root: </span>{" "}
                  <span>{results.results[results.results.length - 1].xi}</span>
                </p>
                <p className="t text-gray-500 font-normal text-sm">
                  <span>Relative Absolute Error: </span>{" "}
                  <span>{results.results[results.results.length - 1].ea}%</span>
                </p>
                <p className="t text-gray-500 font-normal text-sm">
                  <span>Number of iterations: </span>{" "}
                  <span>{results.results.length}</span>
                </p>
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
                  <TableHead>xi</TableHead>
                  <TableHead className="">Abs. Rel. Error (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="h-100% overflow-auto">
                {results.results.map((r) => (
                  <TableRow key={r.itr}>
                    <TableCell>{r.itr}</TableCell>
                    <TableCell>{r.xi}</TableCell>
                    <TableCell className="">{r.ea}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="my-6 flex justify-end px-5">
              <Button
                onClick={() => {
                  const newResults = [...results.results];
                  newResults[0].ea = 0;
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
