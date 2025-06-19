import * as React from "react";

function Card({ className = "", ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={`aduffy-card ${className}`.trim()}
      {...props}
    />
  );
}

function CardHeader({ className = "", ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={`aduffy-card-header ${className}`.trim()}
      {...props}
    />
  );
}

function CardTitle({ className = "", ...props }: React.ComponentProps<"div">) {
  return (
    <h4
      data-slot="card-title"
      className={`aduffy-card-title ${className}`.trim()}
      {...props}
    />
  );
}

function CardDescription({ className = "", ...props }: React.ComponentProps<"div">) {
  return (
    <p
      data-slot="card-description"
      className={`aduffy-card-description ${className}`.trim()}
      {...props}
    />
  );
}

function CardAction({ className = "", ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={`aduffy-card-action ${className}`.trim()}
      {...props}
    />
  );
}

function CardContent({ className = "", ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={`aduffy-card-content ${className}`.trim()}
      {...props}
    />
  );
}

function CardFooter({ className = "", ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={`aduffy-card-footer ${className}`.trim()}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
