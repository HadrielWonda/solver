"use client";
import { FunctionPlot } from "@/lib/graph/FunctionPlot";
import React, { useMemo, useState } from "react";

export default function Page() {
  const [equation, setEquation] = useState("x^2");
  const [plottedEquation, setPlottedEquation] = useState("x^2");

  const plotEquation = () => {
    setPlottedEquation(equation);
  };

  const Graph = useMemo(
    () => (
      <FunctionPlot
        options={{
          data: [
            {
              fn: plottedEquation,
            },
          ],
        }}
      />
    ),
    [plottedEquation]
  );

  return (
    <>
      {Graph}
      <input value={equation} onChange={(e) => setEquation(e.target.value)} />
      <button onClick={plotEquation}>Plot</button>
    </>
  );
}
