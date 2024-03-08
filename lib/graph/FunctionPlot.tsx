import React, { useEffect, useRef } from "react";
import functionPlot, { FunctionPlotOptions } from "function-plot";

export interface FunctionPlotProps {
  options?: Omit<FunctionPlotOptions, "target">;
}

export function FunctionPlot({ options }: FunctionPlotProps) {
  const rootEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      functionPlot(
        Object.assign({}, options, {
          target: rootEl.current,
        }) as FunctionPlotOptions
      );
    } catch (e) {}
  });

  return <div ref={rootEl} />;
}

// export const FunctionPlot: React.FC<FunctionPlotProps> = React.memo(
//   function Graph({ options }) {
//     const rootEl = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//       try {
//         functionPlot(
//           Object.assign({}, options, {
//             target: rootEl.current,
//           }) as FunctionPlotOptions
//         );
//       } catch (e) {}
//     });

//     return <div ref={rootEl} />;
//   },
//   (prevProps, nextProps) =>
//     JSON.stringify(prevProps) == JSON.stringify(nextProps)
// );
