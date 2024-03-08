"use client";

import { Sidebar } from "@/components/component/Sidebar";
import { GiHamburgerMenu } from "react-icons/gi";
import { FunctionPlot } from "@/lib/graph/FunctionPlot";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function Page() {
  const [equation, setEquation] = useState("x^2");
  const [plottedEquation, setPlottedEquation] = useState("x^2");
  const [size, setSize] = useState<
    undefined | { width: number; height: number }
  >();

  const plotEquation = () => {
    setPlottedEquation(equation);
  };

  const elementRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      setSize({
        width: rect.width,
        height: rect.height,
      }); // Should now be non-zero
    }
  }, []);

  const Graph = useMemo(
    () =>
      size ? (
        <FunctionPlot
          options={{
            ...size,
            data: [
              {
                fn: plottedEquation,
              },
            ],
          }}
        />
      ) : null,
    [plottedEquation, size]
  );

  // Get a ref to the mathfield element
  // (see `ref={mf}` in the markup below)
  const mf = useRef<any>(null);

  // Customize the mathfield when it is created
  // useEffect(() => {
  //   mf.current.mathVirtualKeyboardPolicy = "manual";
  //   mf.current.addEventListener("focusin", () =>
  //     window.mathVirtualKeyboard.show()
  //   );
  //   mf.current.addEventListener("focusout", () =>
  //     window.mathVirtualKeyboard.hide()
  //   );
  //   mf.current.menuItems = [];
  //   mf.current.mathVirtualKeyboardPolicy = "manual";
  //   mf.current.addEventListener("focusin", () =>
  //     window.mathVirtualKeyboard.show()
  //   );
  //   mf.current.addEventListener("focusout", () =>
  //     window.mathVirtualKeyboard.hide()
  //   );
  // }, []);

  const [value, setValue] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      setSize({
        width: rect.width,
        height: rect.height,
      }); // Should now be non-zero
    }
  }, [setSidebarOpen]);
  const openSidebar = useCallback(() => {
    setSidebarOpen(true);
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      setSize({
        width: rect.width,
        height: rect.height,
      }); // Should now be non-zero
    }
  }, [setSidebarOpen]);

  return (
    <div className="w-full h-screen flex">
      {/* <Component /> */}

      <Sidebar open={sidebarOpen} close={closeSidebar} />
      <div ref={elementRef} className="flex-1 h-screen relative">
        <div className="absolute top-3 left-5 flex items-center gap-3">
          {!sidebarOpen && (
            <button
              onClick={openSidebar}
              className="p-3 border-2 border-zinc-800 rounded-xl z-10 bg-white"
              aria-label="toggle sidebar"
            >
              <GiHamburgerMenu />
            </button>
          )}

          <div className="p-3 bg-white border-2 border-zinc-800 rounded-xl z-10">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/roots">Roots</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/roots/bracketing-methods">
                    Bracketing Methods
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>2D Graph</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
        {Graph}
      </div>
    </div>
  );
}
