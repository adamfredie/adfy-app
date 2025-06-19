import * as React from "react";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={`aduffy-input ${className || ""}`}
      {...props}
    />
  );
}

export { Input };
