import React from "react";

export default function RodGrid({
  boundary,
  nx,
  x,
  dx,
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
}) {
  return (
    <div className="w-[60%] mx-auto flex justify-center items-center px-10">
      <div className="relative w-full mt-12 mb-14">
        <div className="w-full h-0.5 bg-black absolute top-1/2 translate-y-0.25" />

        <div className="w-full flex justify-between items-center translate-x-[-1px] relative">
          <div className="flex flex-col gap-2 justify-center items-center h-4 relative">
            <p className="text text-xs absolute top-[-24px] whitespace-nowrap">
              x = 0
            </p>
            <div className="w-[2px] bg-black h-4" />
            <p className="text text-xs absolute bottom-[-24px] whitespace-nowrap">
              {boundary.l.type === "dirichlet" ? (
                <math>
                  <msub>
                    <mi>T</mi>
                    <mn>0</mn>
                  </msub>
                  {boundary.l.value ? (
                    <>
                      <mo>=</mo>
                      <mn>{boundary.l.value}</mn>
                    </>
                  ) : null}
                </math>
              ) : (
                <math>
                  <mfrac>
                    <mi>dT</mi>
                    <mi>dx</mi>
                  </mfrac>
                  {boundary.l.value ? (
                    <>
                      <mo>=</mo>
                      <mn>{boundary.l.value}</mn>
                    </>
                  ) : null}
                </math>
              )}
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
                  <math>
                    <msub>
                      <mi>T</mi>
                      <mn>{i + 1}</mn>
                    </msub>
                  </math>
                </p>
              </div>
            ))}
          <div className="flex flex-col gap-2 justify-center items-center translate-x-[1px] h-4 relative">
            <p className="text text-xs absolute top-[-24px] whitespace-nowrap">
              {x}
            </p>
            <div className="w-[2px] bg-black h-4" />
            <p className="text text-xs absolute bottom-[-24px] whitespace-nowrap">
              {boundary.r.type === "dirichlet" ? (
                <math>
                  <msub>
                    <mi>T</mi>
                    <mn>{nx + 1}</mn>
                  </msub>
                  {boundary.r.value ? (
                    <>
                      <mo>=</mo>
                      <mn>{boundary.r.value}</mn>
                    </>
                  ) : null}
                </math>
              ) : (
                <math>
                  <mfrac>
                    <mi>dT</mi>
                    <mi>dx</mi>
                  </mfrac>
                  {boundary.r.value ? (
                    <>
                      <mo>=</mo>
                      <mn>{boundary.r.value}</mn>
                    </>
                  ) : null}
                </math>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
