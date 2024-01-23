// import compile from "interval-arithmetic-eval";
import { Parser } from "expr-eval";

export const exprsCompiler = (exprs) => {
  const parser = new Parser();
  return parser.parse(exprs);
};
