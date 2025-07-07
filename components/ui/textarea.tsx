import * as React from "react";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={`aduffy-textarea ${className || ""}`}
      onPaste={e => e.preventDefault()}
      {...props}
    />
  );
}

export { Textarea };
