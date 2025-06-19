import * as React from "react";

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className = "", ...props }, ref) => {
  return (
    <button
      className={`aduffy-button ${className}`.trim()}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button };