import React from "react";
import { Parargraph } from "./ui/blocks";
import { MathBlock, MathData, MathRow } from "./ui/math";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ODES() {
  return (
    <Card className="mb-12">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="py-0 pr-6">
            <CardHeader>
              <CardTitle>ODE Introduction</CardTitle>
              <CardDescription className="text-left">
                Click to expand section
              </CardDescription>
            </CardHeader>
          </AccordionTrigger>
          <AccordionContent>
            <CardContent>
              <Parargraph>
                For solving ordinary differential equations of the form:
              </Parargraph>
              <MathBlock>
                <MathRow>
                  <MathData>
                    <mfrac>
                      <mi>dy</mi>
                      <mi>dx</mi>
                    </mfrac>
                  </MathData>
                  <MathData>
                    <mo>=</mo>
                  </MathData>
                  <MathData>
                    <mi>f</mi>
                    <mo>(</mo>
                    <mi>x</mi>
                    <mo>,</mo>
                    <mi>y</mi>
                    <mo>)</mo>
                  </MathData>
                </MathRow>
              </MathBlock>
              <Parargraph>
                Numerical method to solve such an equation have the general
                form:
              </Parargraph>
              <Parargraph className="mt-3">
                New value = old value + slope x step size
              </Parargraph>
              <Parargraph className="mt-3">
                or, in mathematical terms,
              </Parargraph>
              <MathBlock>
                <MathRow>
                  <MathData>
                    <msub>
                      <mi>y</mi>
                      <mrow>
                        <mi>i</mi>
                        <mo>+</mo>
                        <mn>1</mn>
                      </mrow>
                    </msub>
                  </MathData>

                  <MathData>
                    <mo>=</mo>
                  </MathData>
                  <MathData>
                    <msub>
                      <mi>y</mi>
                      <mi>i</mi>
                    </msub>
                    <mo>+</mo>
                    <mo>ϕ</mo>
                    <mo>&#x2219;</mo>
                    <mi>h</mi>
                  </MathData>
                </MathRow>
              </MathBlock>
              <Parargraph>
                According to this equation, the slope estimate of ϕ is used to
                extrapolate from an old value yi to a new value yi+1 over a
                distance h. This formula can be applied step by step to compute
                out into the future and, hence, trace out the trajectory of the
                solution.
              </Parargraph>
              <Parargraph className="mt-3">
                All one-step methods can be expressed in this general form, with
                the only difference being the manner in which the slope is
                estimated. As in the falling parachutist problem, the simplest
                approach is to use the differential equation to estimate the
                slope in the form of the first derivative at xi. In other words,
                the slope at the beginning of the interval is taken as an
                approximation of the average slope over the whole interval. This
                approach is called <strong>Euler’s method</strong>. Other
                one-step methods that employ alternative slope estimates that
                result in more accurate predictions are generally called{" "}
                <strong>Runge-Kutta methods</strong>.
              </Parargraph>
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
