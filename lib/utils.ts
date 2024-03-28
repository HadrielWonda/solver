import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ReplacementRule {
  pattern: RegExp;
  replacement: string;
}

export function latexToMathjs(latexString: string): string {
  const rules: ReplacementRule[] = [
    { pattern: /\\frac\{(.*?)\}\{(.*?)\}/g, replacement: "(($1)/($2))" }, // Fraction conversion
    // { pattern: /\\frac\{(\d)(\d)\}/g, replacement: "(($1)/($2))" }, // Fraction conversion
    { pattern: /\^\{(.*)\}/g, replacement: "^($1)" }, // Fraction conversion
    { pattern: /\\left\((.*?)\\right\)/g, replacement: "($1)" }, // Left and right parenthesis removal
    { pattern: /\\sin/g, replacement: "sin" }, // Trigonometric function conversion
    { pattern: /\\cos/g, replacement: "cos" },
    { pattern: /\\tan/g, replacement: "tan" },
    { pattern: /\\sqrt\{(.*?)\}/g, replacement: "sqrt($1)" }, // Square root conversion
    { pattern: /\\pi/g, replacement: "PI" }, // Mathematical constant pi
    { pattern: /\\theta/g, replacement: "theta" }, // Theta symbol
    { pattern: /\\gamma/g, replacement: "gamma" }, // Gamma symbol
    { pattern: /\\exponentialE\^{(.*?)}/g, replacement: "exp($1)" }, // Exponential function with ^ notation
    { pattern: /\\exponentialE\^(\d)/g, replacement: "exp($1)" }, // Exponential function of a constant with ^ notation
    { pattern: /\\exp/g, replacement: "exp" }, // Exponential function with \left and \right notation
    { pattern: /\\log/g, replacement: "log" }, // Exponential function with \left and \right notation
    { pattern: /\\ln/g, replacement: "ln" }, // Exponential function with \left and \right notation
    { pattern: /\\cdot/g, replacement: "*" }, // Multiplication symbol replacement
    { pattern: /\\cdot/g, replacement: "*" }, // Multiplication symbol replacement
    // Add more replacements as needed
  ];

  try {
    let mathjsString = latexString;
    for (const rule of rules) {
      mathjsString = mathjsString.replace(rule.pattern, rule.replacement);
    }
    return mathjsString;
  } catch (error) {
    console.error("Error converting LaTeX to MathJS:", error);
    return latexString; // or throw an error, depending on your preference
  }
}
