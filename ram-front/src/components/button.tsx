// (c) Delta Software 2023, rights reserved.

// This file is an example component and most components should probably be
// really similar to this one.

import React from "react";

// We can define variants for a component using enums
export enum Variant {
  Primary = "primary",
  Secondary = "secondary",
}

// We can extend the regular prosp of the base element
export interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  // We add properties in here
  variant?: Variant;
}

const variants = {
  primary: "bg-blue-400 text-white border-none",
  secondary: "bg-gnp-primary-orange text-white border-1 border-gray-400",
};

export function Button({
  // We can add default values for props
  variant = Variant.Primary,
  type = "button",
  className,
  children,
  ...rest
}: Props) {
  const varclass = variants[variant];

  // We can override class name like this
  return (
    <button
      className={`${varclass}  w-full mx-auto bg-gnp-blue-500 text-white px-4 py-2 rounded shadow-lg hover:scale-x-105 hover:bg-gnp-blue-700 transition duration-300 ease-in-out active:scale-x-100 ${className}`}
      type={type}
      {...rest}
    >
      {children}
    </button>
  );
}

Button.Primary = Variant.Primary;
Button.Secondary = Variant.Secondary;
