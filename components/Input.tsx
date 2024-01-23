"use client";
import React, { InputHTMLAttributes, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, ...props }: InputProps) {
  const id = useId();
  return (
    <div>
      {label && (
        <div
          style={{
            marginBottom: 6,
          }}
        >
          <label htmlFor={id}>{label}</label>
        </div>
      )}
      <input type="text" id={id} {...props}></input>
    </div>
  );
}
