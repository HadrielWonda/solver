import React, { useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MdOutlineFullscreen } from "react-icons/md";

export default function ParabolicResults1D({
  results,
  boundary,
  t,
  nx,
  dx,
  x,
}: {
  results: {
    time: string;
    matrix: string[];
  }[];
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
  nx: number;
  dx: number;
  x: number;
  t: number;
}) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(results.length - 1);
  const [count, setCount] = React.useState(0);

  // ${((Number(result.time) / T) * 100) / 2 + 5}
  // console.log("Time", results[0].time, T);
  // console.log("Number Time", Number(results[0].time), T);
  // console.log(
  //   "  ${((Number(result.time) / T) * 100) / 2 + 5}",
  //   ((Number(results[0].time) / T) * 100) / 2 + 5
  // );

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
                      {index == 0 ? "Initial State => " : ""} Time ={" "}
                      {Number(itr.time).toFixed(4)}s
                    </h4>
                  </div>
                  <DialogTrigger className="mb-8">
                    <Button className="gap-2">
                      <span>Open Full View</span>
                      <MdOutlineFullscreen size={24} />
                    </Button>
                  </DialogTrigger>
                  <div className="w-full h-4" />
                  <div className="w-full h-full flex justify-center gap-4">
                    <RodGrid
                      x={x}
                      boundary={boundary}
                      result={itr.matrix}
                      nx={nx}
                      dx={dx}
                    />
                  </div>
                  <div className="w-full h-4" />
                  <DialogContent className="w-[80vw] h-[90vh] max-w-[80vw] max-h-[90vh] flex flex-col">
                    <div className="w-full h-4" />
                    <div className="w-full flex-1">
                      <div className="w-full h-full flex justify-center gap-4">
                        <RodGrid
                          x={x}
                          result={itr.matrix}
                          big
                          boundary={boundary}
                          nx={nx}
                          dx={dx}
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
                  height: `${((Number(result.time) / t) * 100) / 2 + 5}px`,
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
              {i == 0 ? <p>{"Initial State => "}</p> : null}
              <p>Time = {Number(result.time).toFixed(4)}s</p>
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

export function RodGrid({
  boundary,
  nx,
  x,
  dx,
  result,
  big,
}: {
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
  nx: number;
  dx: number;
  x: number;
  result: string[];
  big?: boolean;
}) {
  return (
    <div className="h-full w-[90%] mx-auto flex justify-center items-center px-10">
      <div className="relative w-full mt-12 mb-14">
        <div className="w-full h-0.5 bg-black absolute top-1/2 translate-y-0.25" />

        <div className="w-full flex justify-between items-center translate-x-[-1px] relative">
          <div className="flex flex-col gap-2 justify-center items-center h-4 relative">
            <p className="text text-xs absolute top-[-24px] whitespace-nowrap">
              x = 0
            </p>
            <div className="w-[2px] bg-black h-4" />
            <p className="text text-xs absolute bottom-[-24px] whitespace-nowrap">
              {result[0]}
              {boundary.l.type === "neumann" ? (
                <>
                  {"\n"}
                  <math>
                    <mfrac>
                      <mi>dT</mi>
                      <mi>dx</mi>
                    </mfrac>
                    <mo>=</mo>
                    <mn>{boundary.l.value}</mn>
                  </math>
                </>
              ) : null}
            </p>
          </div>
          {Array(nx)
            .fill(0)
            .map((_, i) => (
              <div
                className="flex flex-col gap-2 justify-center items-center"
                key={i}
              >
                <p className="text text-xs whitespace-nowrap">{(i + 1) * dx}</p>
                <div className="w-[2px] bg-black h-4" />
                <p className="text text-xs whitespace-nowrap">
                  {result[i + 1]}
                </p>
              </div>
            ))}
          <div className="flex flex-col gap-2 justify-center items-center translate-x-[1px] h-4 relative">
            <p className="text text-xs absolute top-[-24px] whitespace-nowrap">
              {x}
            </p>
            <div className="w-[2px] bg-black h-4" />
            <p className="text text-xs absolute bottom-[-24px] whitespace-nowrap">
              {result[nx + 1]}
              {boundary.r.type === "neumann" ? (
                <>
                  {"\n"}
                  <math>
                    <mfrac>
                      <mi>dT</mi>
                      <mi>dx</mi>
                    </mfrac>
                    <mo>=</mo>
                    <mn>{boundary.r.value}</mn>
                  </math>
                </>
              ) : null}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
