export type result = {
  itr: number;
  xl: number;
  xu: number;
  xr: number;
  ea?: number;
};

export type fixedPointResult = {
  itr: number;
  xi: number;
  ea?: number;
};

export type equationsFixedPointResult = {
  itr: number;
  values: { [key: string]: number };
  ea: { [key: string]: number };
};

export type brentResult = {
  itr: number;
  method: "quadratic" | "secant" | "bisection";
  xi: number;
  xj: number;
  xk: number;
  xr: number;
  ea: number | undefined;
};
