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
import { Sidebar, differentiationSettings } from "./Sidebar";
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
        <DialogTitle>Richardson Extrapolation</DialogTitle>
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
                    <BreadcrumbPage>Richardson Extrapolation</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
          <div className="space-y-2">
            <div className="mb-12 mt-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-center mb-4">
                Richardson Extrapolation
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
                  Richardson Extrapolation
                </h4> */}

                <Parargraph>
                  An approach to improve derivative estimates when employing
                  finite divided differences based on Richardson extrapolation,
                  uses two derivative estimates to compute a third, more
                  accurate approximation
                </Parargraph>
                <MathBlock>
                  <MathRow>
                    <MathData>
                      <mi>D</mi>
                    </MathData>
                    <MathData>
                      <mo>=</mo>
                    </MathData>
                    <MathData>
                      <mfrac>
                        <mn>4</mn>
                        <mn>3</mn>
                      </mfrac>
                      <mo>D</mo>
                      <mo>(</mo>
                      <msub>
                        <mi>h</mi>
                        <mn>2</mn>
                      </msub>
                      <mo>)</mo>
                      <mo>-</mo>
                      <mfrac>
                        <mn>1</mn>
                        <mn>3</mn>
                      </mfrac>
                      <mo>D</mo>
                      <mo>(</mo>
                      <msub>
                        <mi>h</mi>
                        <mn>1</mn>
                      </msub>
                      <mo>)</mo>
                    </MathData>
                  </MathRow>
                </MathBlock>
                <Parargraph>
                  where D(h1) and D(h2) are differential estimates using two
                  step sizes h1 and h2. Because of its convenience when
                  expressed as a computer algorithm, this formula is usually
                  written for the case where h2 = h1/2
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
        dataType: "equation" | "data";
        type: "forward" | "backward" | "central";
        order: number;
        equation: string;
        latex: string;
        x: number;
        h1: number;
        h2: number;
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
          "http://127.0.0.1:8000/differentiation/richardson",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(initialValues),
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

        return result as Promise<{ D: number; D1: number; D2: number }>;
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
        setInitialSettings={(settings: differentiationSettings) => {
          setInitialValues({
            ...settings,
            order: Number(settings.order),
            x: Number(settings.x),
            h1: Number(settings.h1),
            h2: Number(settings.h2),
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
                    <BreadcrumbPage>Richardson Extrapolation</BreadcrumbPage>
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
                <div className="flex gap-4 justify-center">
                  <p>d({initialValues?.h1}): = </p> <p>{results.D1}</p>
                  <p>d({initialValues?.h2}): = </p> <p>{results.D2}</p>
                </div>
                <p className="font-semibold">
                  <span>dy/dx: </span> <span>{results.D}</span>
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
                  setInitialValues(undefined);
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
