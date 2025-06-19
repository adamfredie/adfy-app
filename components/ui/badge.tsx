import * as React from "react";

function Badge({ className = "", ...props }: React.ComponentProps<"span">) {
  return (
    <span data-slot="badge" className={`aduffy-badge ${className}`.trim()} {...props} />
  );
}

export { Badge };
