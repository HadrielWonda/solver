import { cn } from "@/lib/utils";
import React, { ReactNode, useEffect, useRef } from "react";
import * as mathlive from "mathlive";
import "mathlive/static.css";

export function MathBlock({
  children,
  ...props
}: {
  children: ReactNode;
  props?: any;
}) {
  return (
    <math className="my-4 mx-4 text-[1.2rem]" {...props}>
      <mtable className="border-spacing-y-2">{children}</mtable>
    </math>
  );
}

export function MathRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <mtr className={cn("py-3", className)}>{children}</mtr>;
}
export function MathData({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <mtd className={className}>{children}</mtd>;
}

export function MathField({
  label,
  children,
  className,
  labelClassName,
  style,
  onInput,
}: {
  label?: string;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
  style?: React.CSSProperties;
  onInput?: React.FormEventHandler<MathMLElement>;
}) {
  const mf = useRef<any>(null);
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
    <div className={cn("pb-3 overflow-hidden", className)}>
      <label
        className={cn(
          "text-sm font-medium text-gray-900 whitespace-nowrap block mb-1",
          labelClassName
        )}
        // htmlFor={id}
      >
        {label}
      </label>
      <math-field
        ref={mf}
        onInput={onInput}
        style={{
          width: "100%",
          maxWidth: "353px",
          ...style,
        }}
      >
        {children}
      </math-field>
    </div>
  );
}
