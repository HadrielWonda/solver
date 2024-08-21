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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export default function PDES() {
  return (
    <Card className="mb-12">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="py-0 pr-6">
            <CardHeader>
              <CardTitle>PDE Introduction</CardTitle>
              <CardDescription className="text-left">
                Click to expand section
              </CardDescription>
            </CardHeader>
          </AccordionTrigger>
          <AccordionContent>
            <CardContent>
              <Parargraph>
                Given a function u that depends on both x and y, the partial
                derivative of u with respect to x at an arbitrary point (x, y)
                is defined as
              </Parargraph>
              <MathBlock>
                <MathRow>
                  <MathData>
                    <mfrac>
                      <mi>ẟu</mi>
                      <mi>ẟx</mi>
                    </mfrac>
                  </MathData>
                  <MathData>
                    <mo>=</mo>
                  </MathData>
                  <MathData>
                    <msub>
                      {/* @ts-ignore */}
                      <ms stretchy={true}>lim</ms>
                      <mrow>
                        <mi>Δx</mi>
                        <mo>→</mo>
                        <ms>0</ms>
                      </mrow>
                    </msub>
                    <mfrac>
                      <mrow>
                        <mi>u</mi>
                        <mo>(</mo>
                        <mi>x</mi>
                        <mo>+</mo>
                        <mi>Δx</mi>
                        <mo>,</mo>
                        <mi>y</mi>
                        <mo>)</mo>
                        <mo>-</mo>
                        <mi>u</mi>
                        <mo>(</mo>
                        <mi>x</mi>
                        <mo>,</mo>
                        <mi>y</mi>
                        <mo>)</mo>
                      </mrow>
                      <mi>Δx</mi>
                    </mfrac>
                  </MathData>
                </MathRow>
              </MathBlock>
              <Parargraph>
                Similarly, the partial derivative with respect to y is defined
                as
              </Parargraph>
              <MathBlock>
                <MathRow>
                  <MathData>
                    <mfrac>
                      <mi>ẟu</mi>
                      <mi>ẟy</mi>
                    </mfrac>
                  </MathData>
                  <MathData>
                    <mo>=</mo>
                  </MathData>
                  <MathData>
                    <msub>
                      {/* @ts-ignore */}
                      <ms stretchy={true}>lim</ms>
                      <mrow>
                        <mi>Δy</mi>
                        <mo>→</mo>
                        <ms>0</ms>
                      </mrow>
                    </msub>
                    <mfrac>
                      <mrow>
                        <mi>u</mi>
                        <mo>(</mo>
                        <mi>x</mi>
                        <mo>,</mo>
                        <mi>y</mi>
                        <mo>+</mo>
                        <mi>Δy</mi>
                        <mo>)</mo>
                        <mo>-</mo>
                        <mi>u</mi>
                        <mo>(</mo>
                        <mi>x</mi>
                        <mo>,</mo>
                        <mi>y</mi>
                        <mo>)</mo>
                      </mrow>
                      <mi>Δy</mi>
                    </mfrac>
                  </MathData>
                </MathRow>
              </MathBlock>
              <Parargraph className="mt-3">
                An equation involving partial derivatives of an unknown function
                of two or more independent variables is called a partial
                differential equation, or PDE. Second Order PDEs can be
                expressed generally as follows:
              </Parargraph>
              <MathBlock>
                <MathRow>
                  <MathData>
                    <mi>A</mi>
                    <mfrac>
                      <mi>ẟ²u</mi>
                      <mi>ẟx²</mi>
                    </mfrac>

                    <mo>+</mo>
                    <mi>B</mi>
                    <mfrac>
                      <mi>ẟ²u</mi>
                      <mi>ẟxẟy</mi>
                    </mfrac>
                    <mo>+</mo>
                    <mi>C</mi>
                    <mfrac>
                      <mi>ẟ²u</mi>
                      <mi>ẟy²</mi>
                    </mfrac>
                    <mo>+</mo>
                    <mi>D</mi>
                  </MathData>

                  <MathData>
                    <mo>=</mo>
                  </MathData>
                  <MathData>
                    <mn>0</mn>
                  </MathData>
                </MathRow>
              </MathBlock>
              <Parargraph>
                where A, B, and C are functions of x and y and D is a function
                of x, y, u,{" "}
                <math>
                  <mfrac>
                    <mi>ẟu</mi>
                    <mi>ẟx</mi>
                  </mfrac>
                </math>
                , and{" "}
                <math>
                  <mfrac>
                    <mi>ẟu</mi>
                    <mi>ẟy</mi>
                  </mfrac>
                </math>
                . Depending on the values of the coefficients of the
                second-derivative terms—A, B, C— Second Order PDEs can be
                classified into one of three categories in the table below. This
                classification, which is based on the method of characteristics
                (for example, see Vichnevetsky, 1981, or Lapidus and Pinder,
                1981), is useful because each category relates to specific and
                distinct engineering problem contexts that demand special
                solution techniques.
              </Parargraph>
              <Table className="mt-4">
                <TableCaption>
                  Classification of Second Order PDEs by Coefficient Values
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">
                      <math>
                        <msup>
                          <mi>B</mi>
                          <mn>2</mn>
                        </msup>
                        <mo>-</mo>
                        <mn>4</mn>
                        <mi>AC</mi>
                      </math>
                    </TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Example</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">{`< 0`}</TableCell>
                    <TableCell>Elliptic</TableCell>
                    <TableCell>
                      Laplace equation (steady state with two spatial
                      dimensions)
                      {`\n`}
                      <math>
                        <msup>
                          <mi>ẟ²u</mi>
                          <mi>ẟx²</mi>
                        </msup>
                        <mo>+</mo>
                        <msup>
                          <mi>ẟ²u</mi>
                          <mi>ẟy²</mi>
                        </msup>
                        <mo>=</mo>
                        <mn>0</mn>
                      </math>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{`> 0`}</TableCell>
                    <TableCell>Hyperbolic</TableCell>
                    <TableCell>
                      Wave equation (time-dependent with one spatial dimension)
                      {`\n`}
                      <math>
                        <msup>
                          <mi>ẟ²u</mi>
                          <mi>ẟx²</mi>
                        </msup>
                        <mo>-</mo>
                        <msup>
                          <mi>ẟ²u</mi>
                          <mi>ẟt²</mi>
                        </msup>
                        <mo>=</mo>
                        <mn>0</mn>
                      </math>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{`= 0`}</TableCell>
                    <TableCell>Parabolic</TableCell>
                    <TableCell>
                      Heat equation (time-dependent with one spatial dimension)
                      {`\n`}
                      <math>
                        <msup>
                          <mi>ẟu</mi>
                          <mi>ẟt</mi>
                        </msup>
                        <mo>=</mo>
                        <mfrac>
                          <mi>ẟ²u</mi>
                          <mi>ẟx²</mi>
                        </mfrac>
                      </math>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
