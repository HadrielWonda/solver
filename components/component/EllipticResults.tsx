import { ellipticResults } from "@/app/(integration and differentiation)/pde/fd-elliptic/page";
import React, { useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MdOutlineFullscreen } from "react-icons/md";

export default function EllipticResults({
  results,
  boundary,
}: {
  results: ellipticResults;
  boundary: {
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
}) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(results.length - 1);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    api?.scrollTo(results.length - 1);
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api, results.length]);

  useEffect(() => {}, []);

  return (
    <div className="h-full flex flex-col p-4">
      <h4 className="font-semibold mb-4">Results:</h4>
      <Carousel
        // className={styles.bigblue}
        className="carousel w-full flex-1 mx-auto *:h-full"
        setApi={setApi}
      >
        <CarouselContent className="h-full">
          {results.map((itr, index) => (
            <CarouselItem key={index} className="h-full w-full">
              <Dialog>
                <div className="p-1 flex flex-col h-full">
                  <div className="flex gap-4 justify-center items-center mb-2">
                    <h4 className="font-semibold text-center">
                      {index == 0 ? "Initial State" : `Iteration ${index}`}
                    </h4>
                    <p className="text-center">
                      Rel. Error: {Number(itr.abre).toFixed(4) ?? 100}%
                    </p>
                  </div>
                  <DialogTrigger className="mb-8">
                    <Button className="gap-2">
                      <span>Open Full View</span>
                      <MdOutlineFullscreen size={24} />
                    </Button>
                  </DialogTrigger>
                  <div className="w-full h-4" />
                  <div className="w-full h-full flex justify-center gap-4">
                    <IterationGrids
                      x={results[0].matrix[0].length - 2}
                      y={results[0].matrix.length - 2}
                      boundary={boundary}
                      result={itr.matrix}
                    />
                  </div>
                  <div className="w-full h-4" />
                  <DialogContent className="w-[80vw] h-[90vh] max-w-[80vw] max-h-[90vh] flex flex-col">
                    <div className="w-full h-4" />
                    <div className="w-full flex-1">
                      <div className="w-full h-full flex justify-center gap-4">
                        <IterationGrids
                          x={results[0].matrix[0].length - 2}
                          y={results[0].matrix.length - 2}
                          result={itr.matrix}
                          big
                          boundary={boundary}
                        />
                      </div>
                    </div>
                    <div className="w-full h-4" />
                    {/* <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </DialogDescription>
                      </DialogHeader> */}
                    {/* <IterationGrids
                        x={results[0].matrix[0].length - 2}
                        y={results[0].matrix.length - 2}
                        result={itr.matrix}
                      /> */}
                  </DialogContent>
                </div>
              </Dialog>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="mt-8 mx-auto flex justify-center items-end h-[55px] min-w-[50%] max-w-[70%] gap-[1px]">
        {results.map((result, i) => (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <div
                className="ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-muted text-primary-foreground hover:bg-primary/90"
                style={{
                  height: `${
                    ((result.abre ?? 100) > 100 ? 100 : result.abre) / 2 + 5
                  }px`,
                  maxWidth: "100px",
                  minWidth: "3px",
                  flex: "1",
                  ...(current == i
                    ? { background: "hsl(var(--primary))" }
                    : {}),
                  // background:
                  //   current == i ? "hsl(var(--primary))" : "hsl(var(--muted))",
                }}
                onClick={() => api?.scrollTo(i)}
              ></div>
            </TooltipTrigger>
            <TooltipContent>
              {i == 0 ? <p>Initial State</p> : <p>Iteration {i}</p>}
              {i !== 0 ? (
                <p>% rel. error: {Number(result.abre).toFixed(4) ?? 100}%</p>
              ) : null}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      <div className="flex w-[50%] mt-8 justify-between items-center mx-auto">
        <Button
          onClick={() => api?.scrollPrev()}
          disabled={!api?.canScrollPrev()}
        >
          Prev
        </Button>
        <Button
          onClick={() => api?.scrollNext()}
          disabled={!api?.canScrollNext()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export function IterationGrids({
  x,
  y,
  result,
  big,
  boundary,
}: {
  x: number;
  y: number;
  result: number[][];
  big?: boolean;
  boundary: {
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
}) {
  return (
    <div
      className="max-h-full max-w-[70%] relative border-[3px] border-black"
      style={{
        aspectRatio: `${x + 1}/${y + 1}`,
      }}
    >
      <div className="w-full h-full flex flex-col justify-evenly">
        {Array.from({ length: y }).map((_, j) => (
          <div key={j} className="w-full h-[1px] bg-black"></div>
        ))}
      </div>
      <div className="w-full h-full flex justify-evenly absolute top-[-3px] right-[-3px] border-[3px] border-transparent box-content">
        {Array.from({ length: x }).map((_, i) => (
          <div
            key={i}
            className="w-[1px] bg-black flex flex-col justify-evenly items-stretch"
          >
            {Array.from({ length: y }).map((_, j) => (
              <div
                key={j}
                className="relative"
                style={{
                  // width: Math.max(x, y) > 10 ? "5px" : "10px",
                  // height: Math.max(x, y) > 10 ? "5px" : "10px",
                  fontSize:
                    Math.max(x, y) > 10
                      ? big
                        ? "10px"
                        : "7px"
                      : big
                      ? "16px"
                      : "12px",

                  // transform: `translateX(${Math.max(x, y) > 10 ? -2 : -4}px)`,
                }}
              >
                <Tooltip key={i}>
                  <TooltipTrigger asChild>
                    <p className="bg-white w-fit translate-x-[-50%] hover:z-10 cursor-context-menu hover:bg-red-300">
                      {Number(result[j + 1][i + 1]).toFixed(
                        Math.max(x, y) > 10 ? 2 : 4
                      )}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent className="font-bold text-lg">
                    <math>
                      <msub>
                        <mi>T</mi>
                        <ms>
                          {j + 1}, {i + 1}
                        </ms>
                      </msub>
                    </math>
                    = {Number(result[j + 1][i + 1]).toFixed(8)}
                  </TooltipContent>
                </Tooltip>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="w-full absolute top-0 h-[1px] flex justify-between items-stretch">
        {boundary.t.type == "dirichlet" ? (
          <p className=" text-center font-semibold -mt-6 mx-auto">
            T = {boundary.t.value}
          </p>
        ) : (
          <>
            {result[0].map((row, i) => (
              <div
                key={i}
                style={{
                  fontSize:
                    Math.max(x, y) > 10
                      ? big
                        ? "10px"
                        : "7px"
                      : big
                      ? "16px"
                      : "12px",
                  marginTop: "-9px",
                  width: "1px",

                  // transform: `translateX(${Math.max(x, y) > 10 ? -2 : -4}px)`,
                }}
              >
                <Tooltip key={i}>
                  <TooltipTrigger asChild>
                    <p className="bg-white w-fit hover:z-10 cursor-context-menu hover:bg-red-300 -translate-x-1/2 px-[2px]">
                      {Number(row).toFixed(Math.max(x, y) > 10 ? 2 : 4)}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent className="font-bold text-lg">
                    <math>
                      <msub>
                        <mi>T</mi>
                        <ms>
                          {0}, {i + 1}
                        </ms>
                      </msub>
                    </math>
                    = {Number(row).toFixed(8)}
                  </TooltipContent>
                </Tooltip>
              </div>
            ))}
          </>
        )}
      </div>
      <div className="w-full absolute bottom-0 h-[1px] flex justify-between items-stretch">
        {boundary.b.type == "dirichlet" ? (
          <p className=" text-center font-semibold -mb-6 mx-auto">
            T = {boundary.b.value}
          </p>
        ) : (
          <>
            {result[y + 1].map((row, i) => (
              <div
                key={i}
                style={{
                  fontSize:
                    Math.max(x, y) > 10
                      ? big
                        ? "10px"
                        : "7px"
                      : big
                      ? "16px"
                      : "12px",
                  marginBottom: "-9px",
                  width: "1px",

                  // transform: `translateX(${Math.max(x, y) > 10 ? -2 : -4}px)`,
                }}
              >
                <Tooltip key={i}>
                  <TooltipTrigger asChild>
                    <p className="bg-white w-fit hover:z-10 cursor-context-menu hover:bg-red-300 -translate-x-1/2 -translate-y-1/2 px-[2px]">
                      {Number(row).toFixed(Math.max(x, y) > 10 ? 2 : 4)}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent className="font-bold text-lg">
                    <math>
                      <msub>
                        <mi>T</mi>
                        <ms>
                          {y + 1}, {i + 1}
                        </ms>
                      </msub>
                    </math>
                    = {Number(row).toFixed(8)}
                  </TooltipContent>
                </Tooltip>
              </div>
            ))}
          </>
        )}
      </div>
      <div className="h-full absolute left-0 top-0 w-[1px] flex flex-col justify-evenly items-stretch">
        {boundary.l.type == "dirichlet" ? (
          <p className=" text-center font-semibold pr-2 mx-auto text-nowrap -translate-x-full">
            T = {boundary.l.value}
          </p>
        ) : (
          <>
            {result
              .map((row) => row[0])
              .filter((_, idx) => (idx == 0 || idx == y + 1 ? false : true))
              .map((row, i) => (
                <div
                  key={i}
                  style={{
                    fontSize:
                      Math.max(x, y) > 10
                        ? big
                          ? "10px"
                          : "7px"
                        : big
                        ? "16px"
                        : "12px",
                    // marginBottom: "-9px",
                    width: "1px",
                    height: "1px",

                    // transform: `translateX(${Math.max(x, y) > 10 ? -2 : -4}px)`,
                  }}
                >
                  <Tooltip key={i}>
                    <TooltipTrigger asChild>
                      <p className="bg-white w-fit hover:z-10 cursor-context-menu hover:bg-red-300 -translate-x-1/2 -translate-y-1/2 px-[2px]">
                        {Number(row).toFixed(Math.max(x, y) > 10 ? 2 : 4)}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent className="font-bold text-lg">
                      <math>
                        <msub>
                          <mi>T</mi>
                          <ms>
                            {i + 1}, {0}
                          </ms>
                        </msub>
                      </math>
                      = {Number(row).toFixed(8)}
                    </TooltipContent>
                  </Tooltip>
                </div>
              ))}
          </>
        )}
      </div>
      <div className="h-full absolute right-0 top-0 w-[1px] flex flex-col justify-evenly items-stretch">
        {boundary.r.type == "dirichlet" ? (
          <p className=" text-center font-semibold pl-2 mx-auto text-nowrap">
            T = {boundary.r.value}
          </p>
        ) : (
          <>
            {result
              .map((row) => row[x + 1])
              .filter((_, idx) => (idx == 0 || idx == y + 1 ? false : true))
              .map((row, i) => (
                <div
                  key={i}
                  style={{
                    fontSize:
                      Math.max(x, y) > 10
                        ? big
                          ? "10px"
                          : "7px"
                        : big
                        ? "16px"
                        : "12px",
                    // marginBottom: "-9px",
                    width: "1px",
                    height: "1px",

                    // transform: `translateX(${Math.max(x, y) > 10 ? -2 : -4}px)`,
                  }}
                >
                  <Tooltip key={i}>
                    <TooltipTrigger asChild>
                      <p className="bg-white w-fit hover:z-10 cursor-context-menu hover:bg-red-300 -translate-x-1/2 -translate-y-1/2 px-[2px]">
                        {Number(row).toFixed(Math.max(x, y) > 10 ? 2 : 4)}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent className="font-bold text-lg">
                      <math>
                        <msub>
                          <mi>T</mi>
                          <ms>
                            {i + 1}, {x + 1}
                          </ms>
                        </msub>
                      </math>
                      = {Number(row).toFixed(8)}
                    </TooltipContent>
                  </Tooltip>
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
}
