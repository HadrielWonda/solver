/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { exprsCompiler } from "@/utils/compile";
import ComputationResults from "@/components/ComputationResults";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import TSCodeBlock from "./ts.mdx";
import PYCodeBlock from "./py.mdx";
import MLCodeBlock from "./ml.mdx";
// import "../../../../public/prism.js";
import "../../../../public/prism.css";
import Prism from "../../../../public/prism.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GiHamburgerMenu } from "react-icons/gi";
import { Sidebar } from "./Sidebar";
import { result } from "@/types";
import { RiFileList3Line } from "react-icons/ri";

export default function Page() {
  const [mode, setMode] = useState<"intro" | "solve" | "steps">("intro");

  return mode == "intro" ? (
    <BisectionIntro solve={() => setMode("solve")} />
  ) : (
    <BisectionSolve />
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
        <DialogTitle>Bisection Algorithm</DialogTitle>
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

const BisectionIntro = ({ solve }: { solve: () => void }) => {
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
                      Bisection / Balzano&apos;s Method
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
          <div className="space-y-2">
            <div className="mb-12 mt-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-center mb-4">
                Bisection / Balzano&apos;s Method
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
                f(x) changes sign on opposite sides of the root. In general, if
                f(x) is real and continuous in the interval from xl to xu and
                f(xl) and f(xu) have opposite signs, that is,
              </Parargraph>
              <MathBlock>
                <MathRow>
                  <MathData>
                    <mi>f</mi>
                    <mo>(</mo>
                    <msub>
                      <mi>x</mi>
                      <mn>l</mn>
                    </msub>
                    <mo>)</mo>
                    <mi>f</mi>
                    <mo>(</mo>
                    <msub>
                      <mi>x</mi>
                      <mn>u</mn>
                    </msub>
                    <mo>)</mo>
                  </MathData>
                  <MathData>
                    <mo>&lt;</mo>
                  </MathData>
                  <MathData>
                    <mn>0</mn>
                  </MathData>
                </MathRow>
              </MathBlock>
              <Parargraph>
                The bisection method, which is alternatively called binary
                chopping, interval halving, or Bolzano’s method, is one type of
                incremental search method in which the interval is always
                divided in half.
              </Parargraph>
              <MathBlock>
                <MathRow>
                  <MathData>
                    <msub>
                      <mi>x</mi>
                      <mn>r</mn>
                    </msub>
                  </MathData>
                  <MathData>
                    <mo>=</mo>
                  </MathData>
                  <MathData>
                    <mfrac>
                      <mrow>
                        <msub>
                          <mi>x</mi>
                          <mn>l</mn>
                        </msub>
                        <mo>+</mo>
                        <msub>
                          <mi>x</mi>
                          <mn>u</mn>
                        </msub>
                      </mrow>
                      <mrow>
                        <mn>2</mn>
                      </mrow>
                    </mfrac>
                  </MathData>
                </MathRow>
              </MathBlock>
              <Parargraph>
                If a function changes sign over an interval, the function value
                at the midpoint is evaluated. The location of the root is then
                determined as lying at the midpoint of the subinterval within
                which the sign change occurs. The process is repeated to obtain
                refined estimates.
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

const BisectionSolve = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, [setSidebarOpen]);
  const openSidebar = useCallback(() => {
    setSidebarOpen(true);
  }, [setSidebarOpen]);

  // const [showResults, setShowResults] = useState(false);
  const [running, setRunning] = useState(false);
  const [initialValues, setInitialValues] = useState<{
    equation: string;
    xu: number;
    xl: number;
    stoppingCriteria: "max_error" | "max_iterations";
    maxIterations: number;
    maxError: number;
  }>({
    equation: "",
    xu: 0,
    xl: 0,
    stoppingCriteria: "max_iterations",
    maxIterations: 1000,
    maxError: 0.0000000000001,
  });

  const [results, setResults] = useState<result[] | undefined>();

  return (
    <div className="w-full h-screen flex">
      {/* <Component /> */}

      <Sidebar
        open={sidebarOpen}
        close={closeSidebar}
        setInitialSettings={setInitialValues}
        running={running}
      />
      <div className="flex-1 flex flex-col w-full h-screen relative">
        <div className="pt-3 pl-5 flex items-center gap-3">
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
                    Bisection / Balzano&apos;s Method
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
        <div className="flex-1">
          {running ? (
            <></>
          ) : results?.length ? (
            <></>
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
          {/* {showResults && (
            <ComputationResults
              initialValues={initialValues}
              method="Bisection"
            />
          )} */}
        </div>
      </div>
    </div>
  );
};
