import * as React from "react";

function Alert({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`aduffy-alert ${className}`} {...props} />
  );
}

export { Alert };
