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

export default function NewtonCotesSection() {
  return (
    <Card className="mb-12">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="py-0 pr-6">
            <CardHeader>
              <CardTitle>The Newton-Cotes Formulas Introduction</CardTitle>
              <CardDescription className="text-left">
                Click to expand section
              </CardDescription>
            </CardHeader>
          </AccordionTrigger>
          <AccordionContent>
            <CardContent>
              <Parargraph className="pt-4">
                The Newton-Cotes formulas are the most common numerical
                integration schemes. They are based on the strategy of replacing
                a complicated function or tabulated data with an approximating
                function that is easy to integrate:
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
                    <mo>f</mo>
                    <mo>(</mo>
                    <mi>x</mi>
                    <mo>)</mo>
                    <mi>dx</mi>
                  </MathData>
                  <MathData>
                    <mo>&#x2248;</mo>
                  </MathData>
                  <MathData>
                    <msubsup>
                      <mo>&#x222B;</mo>
                      <mn>a</mn>
                      <mn>b</mn>
                    </msubsup>
                    <msub>
                      <mo>f</mo>
                      <mi>n</mi>
                    </msub>
                    <mo>(</mo>
                    <mi>x</mi>
                    <mo>)</mo>
                    <mi>dx</mi>
                  </MathData>
                </MathRow>
              </MathBlock>
              <Parargraph>
                where{" "}
                <math>
                  <msub>
                    <mo>f</mo>
                    <mi>n</mi>
                  </msub>
                  <mo>(</mo>
                  <mi>x</mi>
                  <mo>)</mo>
                </math>{" "}
                is a polynomial of the form
              </Parargraph>
              <MathBlock>
                <MathRow>
                  <MathData>
                    <msub>
                      <mo>f</mo>
                      <mi>n</mi>
                    </msub>
                    <mo>(</mo>
                    <mi>x</mi>
                    <mo>)</mo>
                  </MathData>
                  <MathData>
                    <mo>=</mo>
                  </MathData>
                  <MathData>
                    <msub>
                      <mi>a</mi>
                      <mn>0</mn>
                    </msub>
                    <mo>+</mo>
                    <msub>
                      <mi>a</mi>
                      <mn>1</mn>
                    </msub>
                    <mi>x</mi>
                    <mo>+</mo>
                    <ms>...</ms>
                    <mo>+</mo>
                    <msub>
                      <mi>a</mi>
                      <mrow>
                        <mi>n</mi>
                        <mo>-</mo>
                        <mn>1</mn>
                      </mrow>
                    </msub>
                    <msup>
                      <mi>x</mi>
                      <mrow>
                        <mi>n</mi>
                        <mo>-</mo>
                        <mn>1</mn>
                      </mrow>
                    </msup>
                    <mo>+</mo>
                    <msub>
                      <mi>a</mi>
                      <mi>n</mi>
                    </msub>
                    <msup>
                      <mi>x</mi>
                      <mi>n</mi>
                    </msup>
                  </MathData>
                </MathRow>
              </MathBlock>
              <Parargraph>where n is the order of the polynomial.</Parargraph>
              <Parargraph>
                The integral can also be approximated using a series of
                polynomials applied piecewise to the function or data over
                segments of constant length.
              </Parargraph>
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
