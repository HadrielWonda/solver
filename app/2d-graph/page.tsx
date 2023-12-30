"use client";
import { FunctionPlot } from "@/components/FunctionPlot";
import React, { useState } from "react";

export default function Graph() {
  const [equation, setEquation] = useState("x^2");
  const [plottedEquation, setPlottedEquation] = useState("x^2");

  const plotEquation = () => {
    setPlottedEquation(equation);
  };

  return (
    <>
      <FunctionPlot
        options={{
          data: [
            {
              fn: plottedEquation,
            },
          ],
        }}
      />
      <input value={equation} onChange={(e) => setEquation(e.target.value)} />
      <button onClick={plotEquation}>Plot</button>
    </>
  );
}
