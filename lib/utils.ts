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
    { pattern: /\\frac\{(\d)(\d)\}/g, replacement: "(($1)/($2))" }, // Fraction conversion
    { pattern: /\\frac\{(.*?)\}\{(.*?)\}/g, replacement: "(($1)/($2))" }, // Fraction conversion
    { pattern: /\^\{(.*)\}/g, replacement: "^($1)" }, // Fraction conversion
    { pattern: /\\left\((.*?)\\right\)/g, replacement: "($1)" }, // Left and right parenthesis removal
    // { pattern: /\\left(.*?)\\right/g, replacement: "($1)" }, // Left and right parenthesis removal
    { pattern: /\\sin/g, replacement: "sin" }, // Trigonometric function conversion
    { pattern: /\\cos/g, replacement: "cos" },
    { pattern: /\\tan/g, replacement: "tan" },
    { pattern: /\\sqrt\{(.*?)\}/g, replacement: "sqrt($1)" }, // Square root conversion
    { pattern: /\\pi/g, replacement: "PI" }, // Mathematical constant pi
    { pattern: /\\theta/g, replacement: "theta" }, // Theta symbol
    { pattern: /\\gamma/g, replacement: "gamma" }, // Gamma symbol
    { pattern: /\\log/g, replacement: "log" }, // Exponential function with \left and \right notation
    { pattern: /\\ln/g, replacement: "ln" }, // Exponential function with \left and \right notation
    { pattern: /\\cdot/g, replacement: "*" }, // Multiplication symbol replacement
    { pattern: /\\exponentialE[\^*]?(\d)/g, replacement: "exp($1)" },
    { pattern: /\\exponentialE\^(\d)/g, replacement: "exp($1)" }, // Exponential function of a constant with ^ notation
    { pattern: /\\exponentialE[\^*]?/g, replacement: "exp" },
    { pattern: /\\exp[\^*]?/g, replacement: "exp" }, // Exponential function with \left and \right notation
    { pattern: /\\left\((.*?)\\right\)/g, replacement: "($1)" },
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

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const generatePolynomialEqaution = (constants: string[]) => {
  return constants.reduce((acc, constant, index) => {
    if (index === 0) {
      return `${constant}`;
    }
    if (Number(constant) == 0) {
      return acc;
    }
    return `${acc} + ${constant}x^${index}`;
  }, "");
};
