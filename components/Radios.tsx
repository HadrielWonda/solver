"use client";
import React, { useId } from "react";

type radioOption = {
  id: string;
  value: string;
  label: string;
};

export default function Radios({
  title,
  options,
  selectedOption,
  setSelectedOption,
}: {
  title?: string;
  options: radioOption[];
  selectedOption?: string;
  setSelectedOption: (option: radioOption) => void;
}) {
  const id = useId();
  return (
    <div className="block">
      {<h3>{title}</h3>}
      {options.map((option) => (
        <Radio
          key={id + option.id}
          name={id}
          option={option}
          selectedOption={selectedOption}
          select={setSelectedOption}
        />
      ))}
    </div>
  );
}

export function Radio({
  name,
  option,
  selectedOption,
  select,
}: {
  name: string;
  option: radioOption;
  selectedOption?: string;
  select: (option: radioOption) => void;
}) {
  return (
    <div>
      <label>
        <input
          type="radio"
          id={option.id}
          name={name}
          value={option.value}
          onChange={() => select(option)}
          checked={option.value == selectedOption}
        />
        {/*   <label htmlFor="html">{option.label}</label> */}
        <span
          style={{
            display: "inline-block",
            marginLeft: "0.25rem",
          }}
        >
          {option.label}
        </span>
        <br />
      </label>
    </div>
  );
}
