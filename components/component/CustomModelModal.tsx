import React, { useEffect, useRef, useState } from "react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Parargraph } from "../ui/blocks";
import { MathBlock, MathData, MathRow } from "../ui/math";

export default function CustomModelModal({
  saveChanges,
}: {
  saveChanges: (v: { x: string; y: string }) => void;
}) {
  const mf = useRef<any>(null);

  const [eq, setEq] = useState({
    x: "",
    y: "",
  });

  // Customize the mathfield when it is created
  useEffect(() => {
    if (mf.current) {
      mf.current.mathVirtualKeyboardPolicy = "manual";
      mf.current.addEventListener("focusin", () =>
        window.mathVirtualKeyboard.show()
      );
      mf.current.addEventListener("focusout", () =>
        window.mathVirtualKeyboard.hide()
      );
      mf.current.menuItems = [];
      mf.current.mathVirtualKeyboardPolicy = "manual";
      mf.current.addEventListener("focusin", () =>
        window.mathVirtualKeyboard.show()
      );
      mf.current.addEventListener("focusout", () =>
        window.mathVirtualKeyboard.hide()
      );
    }
  }, []);
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add Custom Modal</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you are done.
        </DialogDescription>
      </DialogHeader>
      <div>
        <MathBlock className="my-1 mx-1 text-[1.2rem]">
          <MathRow>
            <MathData>
              <mi>y</mi>
            </MathData>
            <MathData>
              <mo>=</mo>
            </MathData>
            <MathData>
              <mi>f(x)</mi>
            </MathData>
          </MathRow>
        </MathBlock>
        <p className="text-sm">
          is your function. Linearize the function and derive the functions for
          y&#772; and x&#772; as shown below.
        </p>
        <MathBlock className="my-1 mx-1 text-[1.2rem]">
          <MathRow>
            <MathData>
              <mi>y&#772;</mi>
            </MathData>
            <MathData>
              <mo>=</mo>
            </MathData>
            <MathData>
              <mi>m</mi>
              <mi>x&#772;</mi>
              <mo>+</mo>
              <mi>c</mi>
            </MathData>
          </MathRow>
        </MathBlock>
        <p className="text-sm">such that m and c are constants.</p>
      </div>
      <div className=" space-y-4">
        <div className="pb-3 overflow-hidden flex gap-2">
          <label className="text-base font-medium text-gray-900 whitespace-nowrap">
            y&#772; =
          </label>
          <math-field
            ref={mf}
            onInput={(evt) => {
              setEq((s) => ({
                ...s,
                y: (evt.target as HTMLInputElement).value,
              }));
            }}
            style={{
              width: "100%",
              maxWidth: "353px",
              flex: 1,
            }}
          >
            {eq.y}
          </math-field>
        </div>
        <div className="pb-3 overflow-hidden flex gap-2">
          <label className="text-base font-medium text-gray-900 whitespace-nowrap">
            x&#772; =
          </label>
          <math-field
            ref={mf}
            onInput={(evt) => {
              setEq((s) => ({
                ...s,
                x: (evt.target as HTMLInputElement).value,
              }));
            }}
            style={{
              width: "100%",
              maxWidth: "353px",
              flex: 1,
            }}
          >
            {eq.x}
          </math-field>
        </div>
      </div>
      <DialogFooter>
        <DialogClose>
          <Button type="submit" onClick={() => saveChanges(eq)}>
            Save changes
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
