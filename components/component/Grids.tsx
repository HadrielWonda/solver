import React from "react";

export default function Grids({
  x,
  y,
  boundary,
}: {
  x: number;
  y: number;
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
      className={`max-h-full max-w-[70%] relative border-[3px] border-black ${
        boundary.t.type === "dirichlet" ? "" : " border-t-red-400"
      } ${boundary.b.type === "dirichlet" ? "" : " border-b-red-400"} ${
        boundary.l.type === "dirichlet" ? "" : " border-l-red-400"
      } ${boundary.r.type === "dirichlet" ? "" : " border-r-red-400"}`}
      style={{
        aspectRatio: `${x + 1}/${y + 1}`,
      }}
    >
      <div className="w-full h-full flex flex-col justify-evenly absolute top-[-3px] right-[-3px] border-[3px] border-transparent box-content">
        {Array.from({ length: y }).map((_, j) => (
          <div key={j} className="w-full h-[1px] bg-black"></div>
        ))}
      </div>
      <div className="w-full h-full flex justify-evenly">
        {Array.from({ length: x }).map((_, i) => (
          <div
            key={i}
            className="w-[1px] bg-black flex flex-col justify-evenly items-stretch"
          >
            {Array.from({ length: y }).map((_, j) => (
              <div
                key={j}
                className="w-[10px] h-[10px] rounded-full bg-red-400"
                style={{
                  width: Math.max(x, y) > 10 ? "5px" : "10px",
                  height: Math.max(x, y) > 10 ? "5px" : "10px",
                  transform: `translateX(${Math.max(x, y) > 10 ? -2 : -4}px)`,
                }}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
