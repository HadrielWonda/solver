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
import { Sidebar, equationSettings } from "./Sidebar";
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
        <DialogTitle>The Trapezoidal Rule</DialogTitle>
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
                    <BreadcrumbPage>The Trapezoidal Rule</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
          <div className="space-y-2">
            <div className="mb-12 mt-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-center mb-4">
                The Trapezoidal Rule
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
              <NewtonCotesSection />
              <section>
                <h4 className="bold font-bold my-2 text-left">
                  The Trapezoidal Rule
                </h4>

                <Parargraph>
                  The trapezoidal rule is the first of the Newton-Cotes closed
                  integration formulas. It corresponds to the case where the
                  polynomial is first order:
                </Parargraph>
                <Image
                  src="/images/trapezoid.png"
                  alt="single trapezoid"
                  width={378}
                  height={274}
                  className="mx-auto max-w-full my-4"
                />
                <Parargraph>
                  Recall that a straight line can be represented as
                </Parargraph>
                <MathBlock>
                  <MathRow>
                    <MathData>
                      <msub>
                        <mi>f</mi>
                        <mn>1</mn>
                      </msub>
                      <mo>(</mo>
                      <mi>x</mi>
                      <mo>)</mo>
                    </MathData>
                    <MathData>
                      <mo>=</mo>
                    </MathData>
                    <MathData>
                      <mo>f</mo>
                      <mo>(</mo>
                      <mi>a</mi>
                      <mo>)</mo>
                      <mo>+</mo>
                      <mfrac>
                        <mrow>
                          <mo>f</mo>
                          <mo>(</mo>
                          <mi>b</mi>
                          <mo>)</mo>
                          <mo>-</mo>
                          <mo>f</mo>
                          <mo>(</mo>
                          <mi>a</mi>
                          <mo>)</mo>
                        </mrow>
                        <mrow>
                          <mi>b</mi>
                          <mo>-</mo>
                          <mi>a</mi>
                        </mrow>
                      </mfrac>
                      <mo>(</mo>
                      <mi>x</mi>
                      <mo>-</mo>
                      <mi>a</mi>
                      <mo>)</mo>
                    </MathData>
                  </MathRow>
                </MathBlock>
                <Parargraph>
                  The area under this straight line is an estimate of the
                  integral of f(x) between the limits a and b:
                </Parargraph>
                <MathBlock>
                  <MathRow>
                    <MathData>
                      <mi>I</mi>
                    </MathData>
                    <MathData>
                      <mo>=</mo>
                    </MathData>
                    <MathData>
                      <msubsup>
                        <mo>&#x222B;</mo>
                        <mn>a</mn>
                        <mn>b</mn>
                      </msubsup>
                      <mo>[</mo>
                      <mo>f</mo>
                      <mo>(</mo>
                      <mi>a</mi>
                      <mo>)</mo>
                      <mo>+</mo>
                      <mfrac>
                        <mrow>
                          <mo>f</mo>
                          <mo>(</mo>
                          <mi>b</mi>
                          <mo>)</mo>
                          <mo>-</mo>
                          <mo>f</mo>
                          <mo>(</mo>
                          <mi>a</mi>
                          <mo>)</mo>
                        </mrow>
                        <mrow>
                          <mi>b</mi>
                          <mo>-</mo>
                          <mi>a</mi>
                        </mrow>
                      </mfrac>
                      <mo>(</mo>
                      <mi>x</mi>
                      <mo>-</mo>
                      <mi>a</mi>
                      <mo>)</mo>
                      <mo>]</mo>
                      <mi>dx</mi>
                    </MathData>
                  </MathRow>
                </MathBlock>
                <Parargraph>The result of the integration is:</Parargraph>
                <MathBlock>
                  <MathRow>
                    <MathData>
                      <mi>I</mi>
                    </MathData>
                    <MathData>
                      <mo>=</mo>
                    </MathData>
                    <MathData>
                      <mo>(</mo>
                      <mi>b</mi>
                      <mo>-</mo>
                      <mi>a</mi>
                      <mo>)</mo>
                      <mfrac>
                        <mrow>
                          <mo>f</mo>
                          <mo>(</mo>
                          <mi>a</mi>
                          <mo>)</mo>
                          <mo>+</mo>
                          <mo>f</mo>
                          <mo>(</mo>
                          <mi>b</mi>
                          <mo>)</mo>
                        </mrow>
                        <mrow>
                          <mn>2</mn>
                        </mrow>
                      </mfrac>
                    </MathData>
                  </MathRow>
                </MathBlock>
                <Parargraph>which is called the trapezoidal rule.</Parargraph>
                <Parargraph className="mt-4">
                  One way to improve the accuracy of the trapezoidal rule is to
                  divide the integration interval from a to b into a number of
                  segments and apply the method to each segment. The areas of
                  individual segments can then be added to yield the integral
                  for the entire interval. The resulting equations are called
                  multiple-application, or composite, integration formulas.
                </Parargraph>
                <Image
                  src="/images/trapezoid-composite.png"
                  alt="single trapezoid"
                  width={378}
                  height={274}
                  className="mx-auto max-w-full my-4"
                />
                <Parargraph>
                  The figure shows the general format and nomenclature we will
                  use to characterize multiple-application integrals. There are
                  n + 1 equally spaced base points{" "}
                  <math>
                    <mo>(</mo>
                    <msub>
                      <mi>x</mi>
                      <mn>0</mn>
                    </msub>
                    <ms>,</ms>
                    <msub>
                      <mi>x</mi>
                      <mn>1</mn>
                    </msub>
                    <ms>,</ms>
                    <msub>
                      <mi>x</mi>
                      <mn>1</mn>
                    </msub>
                    <ms>,...</ms>
                    <msub>
                      <mi>x</mi>
                      <mi>n</mi>
                    </msub>
                    <mo>)</mo>
                  </math>
                  . Consequently, there are n segments of equal width:
                </Parargraph>
                <MathBlock>
                  <MathRow>
                    <MathData>
                      <mi>h</mi>
                    </MathData>
                    <MathData>
                      <mo>=</mo>
                    </MathData>
                    <MathData>
                      <mfrac>
                        <mrow>
                          <mi>b</mi>
                          <mo>-</mo>
                          <mi>a</mi>
                        </mrow>
                        <mi>n</mi>
                      </mfrac>
                    </MathData>
                  </MathRow>
                </MathBlock>
                <Parargraph>
                  If a and b are designated as{" "}
                  <math>
                    <msub>
                      <mi>x</mi>
                      <mn>0</mn>
                    </msub>
                    <ms> and </ms>
                    <msub>
                      <mi>x</mi>
                      <mi>n</mi>
                    </msub>
                  </math>
                  , respectively, the total integral can be represented as
                </Parargraph>
                <MathBlock>
                  <MathRow>
                    <MathData>
                      <mi>I</mi>
                    </MathData>
                    <MathData>
                      <mo>=</mo>
                    </MathData>
                    <MathData>
                      <msubsup>
                        <mo>&#x222B;</mo>
                        <msub>
                          <mi>x</mi>
                          <mn>1</mn>
                        </msub>
                        <msub>
                          <mi>x</mi>
                          <mn>0</mn>
                        </msub>
                      </msubsup>
                      <mo>f</mo>
                      <mo>(</mo>
                      <mi>x</mi>
                      <mo>)</mo>
                      <mi>dx</mi>
                      <mo>+</mo>
                      <msubsup>
                        <mo>&#x222B;</mo>
                        <msub>
                          <mi>x</mi>
                          <mn>2</mn>
                        </msub>
                        <msub>
                          <mi>x</mi>
                          <mn>1</mn>
                        </msub>
                      </msubsup>
                      <mo>f</mo>
                      <mo>(</mo>
                      <mi>x</mi>
                      <mo>)</mo>
                      <mi>dx</mi>
                      <mo>+</mo>
                      <ms>...</ms>
                      <mo>+</mo>
                      <msubsup>
                        <mo>&#x222B;</mo>
                        <msub>
                          <mi>x</mi>
                          <mi>n</mi>
                        </msub>
                        <msub>
                          <mi>x</mi>
                          <mrow>
                            <mi>n</mi>
                            <mo>-</mo>
                            <mn>1</mn>
                          </mrow>
                        </msub>
                      </msubsup>
                      <mo>f</mo>
                      <mo>(</mo>
                      <mi>x</mi>
                      <mo>)</mo>
                      <mi>dx</mi>
                    </MathData>
                  </MathRow>
                </MathBlock>
                <Parargraph>
                  Substituting the trapezoidal rule for each integral yields
                </Parargraph>
                <MathBlock>
                  <MathRow>
                    <MathData>
                      <mi>I</mi>
                    </MathData>
                    <MathData>
                      <mo>=</mo>
                    </MathData>
                    <MathData>
                      <mi>h</mi>
                      <mfrac>
                        <mrow>
                          <mo>f</mo>
                          <mo>(</mo>
                          <msub>
                            <mi>x</mi>
                            <mn>0</mn>
                          </msub>
                          <mo>)</mo>
                          <mo>+</mo>
                          <mo>f</mo>
                          <mo>(</mo>
                          <msub>
                            <mi>x</mi>
                            <mn>1</mn>
                          </msub>
                          <mo>)</mo>
                        </mrow>
                        <mn>2</mn>
                      </mfrac>
                      <mo>+</mo>
                      <mi>h</mi>
                      <mfrac>
                        <mrow>
                          <mo>f</mo>
                          <mo>(</mo>
                          <msub>
                            <mi>x</mi>
                            <mn>1</mn>
                          </msub>
                          <mo>)</mo>
                          <mo>+</mo>
                          <mo>f</mo>
                          <mo>(</mo>
                          <msub>
                            <mi>x</mi>
                            <mn>2</mn>
                          </msub>
                          <mo>)</mo>
                        </mrow>
                        <mn>2</mn>
                      </mfrac>
                      <mo>+</mo>
                      <ms>...</ms>
                      <mo>+</mo>
                      <mi>h</mi>
                      <mfrac>
                        <mrow>
                          <mo>f</mo>
                          <mo>(</mo>
                          <msub>
                            <mi>x</mi>
                            <mrow>
                              <mi>n</mi>
                              <mo>-</mo>
                              <mn>1</mn>
                            </mrow>
                          </msub>
                          <mo>)</mo>
                          <mo>+</mo>
                          <mo>f</mo>
                          <mo>(</mo>
                          <msub>
                            <mi>x</mi>
                            <mi>n</mi>
                          </msub>
                          <mo>)</mo>
                        </mrow>
                        <mn>2</mn>
                      </mfrac>
                    </MathData>
                  </MathRow>
                </MathBlock>
                <Parargraph>or, grouping terms,</Parargraph>
                <MathBlock>
                  <MathRow>
                    <MathData>
                      <mi>I</mi>
                    </MathData>
                    <MathData>
                      <mo>=</mo>
                    </MathData>
                    <MathData>
                      <mfrac>
                        <mi>h</mi>
                        <mn>2</mn>
                      </mfrac>
                      <mo>[</mo>
                      <mo>f</mo>
                      <mo>(</mo>
                      <msub>
                        <mi>x</mi>
                        <mn>0</mn>
                      </msub>
                      <mo>)</mo>
                      <mo>+</mo>
                      <mn>2</mn>
                      <msubsup>
                        {/* @ts-ignore */}
                        <mo stretchy={true}>∑</mo>
                        <mrow>
                          <mi>i</mi>
                          <mo>=</mo>
                          <mn>1</mn>
                        </mrow>
                        <mrow>
                          <mi>n</mi>
                          <mo>-</mo>
                          <mn>1</mn>
                        </mrow>
                      </msubsup>
                      <mo>f</mo>
                      <mo>(</mo>
                      <msub>
                        <mi>x</mi>
                        <mi>i</mi>
                      </msub>
                      <mo>)</mo>
                      <mo>+</mo>
                      <mo>f</mo>
                      <mo>(</mo>
                      <msub>
                        <mi>x</mi>
                        <mi>n</mi>
                      </msub>
                      <mo>)</mo>
                      <mo>]</mo>
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
        dataType: "equation" | "data";
        equation: string;
        a: number;
        b: number;
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
      const res = await fetch(
        "https://solver-python-api.onrender.com/newton-cotes/trapezoidal",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(initialValues),
        }
      );

      const result = await res.json();

      console.log("result", result);
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

      return result as Promise<number>;
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
        setInitialSettings={(settings: equationSettings) => {
          setInitialValues({
            ...settings,
            a: Number(settings.a),
            b: Number(settings.b),
            n: Number(settings.n),
          });
          setLatex(settings.latex);
          reset();
        }}
        solve={trigger}
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
                    <BreadcrumbPage>The Trapezoidal Rule</BreadcrumbPage>
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
        ) : initialValues ? (
          <div className="flex items-center justify-center w-full min-h-[400px] flex-col gap-2 p-4 text-center h-full">
            {/* Data visuals */}
            <Image
              src="/images/trapezoid-composite.png"
              alt="single trapezoid"
              width={378}
              height={274}
              className="mx-auto max-w-full my-4"
            />

            {isMutating ? (
              <>
                <h3 className="text-2xl font-bold text-gray-500 mb-2">
                  Running Computation
                </h3>
                <Button
                  className="w-full max-w-96 mx-auto mt-8"
                  onClick={() => trigger()}
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
            ) : results !== undefined ? (
              <>
                <h3 className="text-2xl font-bold text-gray-500 mb-2">
                  Results
                </h3>
                <div className="space-y-2">
                  <div>
                    {/* <h4 className="font-semibold">Integral</h4> */}
                    <p className="">
                      <math>
                        <msubsup>
                          <mo
                            style={{
                              fontSize: "1.6rem",
                            }}
                          >
                            &#x222B;
                          </mo>
                          <msub>
                            <mn>{initialValues.a}</mn>
                          </msub>
                          <msub>
                            <mn>{initialValues.b}</mn>
                          </msub>
                        </msubsup>
                      </math>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: mathlive.convertLatexToMarkup(latex),
                        }}
                        // style={{
                        //   fontSize: "1.2rem",
                        // }}
                      />{" "}
                      <math>
                        <mi>dx</mi>
                      </math>
                    </p>
                    <p>n = {initialValues.n}</p>
                    <p className="font-bold text-2xl text-gray-600 dark:text-gray-300 mt-4">
                      I = {results}
                    </p>
                  </div>
                  {/* <div>
                    <h4 className="font-semibold">Latex</h4>
                    <MathBlock>{latex}</MathBlock>
                  </div> */}
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
              </>
            ) : (
              <>
                <div className="">
                  <h3 className="text-2xl font-bold text-gray-500 mb-2">
                    Parameters Set
                  </h3>
                  <p className="max-w-[600px] text-gray-500 dark:text-gray-400">
                    Confirm the plot then click "Run Computation" below to
                    calculate your integral.
                  </p>
                  <Button
                    className="w-full max-w-96 mx-auto mt-8"
                    onClick={() => trigger()}
                  >
                    Run Computation
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center w-full min-h-[400px] flex-col gap-2 p-4 text-center h-full">
            <Image
              src="/images/trapezoid-dummy.png"
              alt="single trapezoid"
              width={500}
              height={362}
              className="mx-auto max-w-full my-4 opacity-60"
            />
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
