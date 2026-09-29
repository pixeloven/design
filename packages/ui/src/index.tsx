import type { ComponentPropsWithRef } from "react";

export type ButtonProps = ComponentPropsWithRef<"button"> & {
  /** Use primary for the main action in a group. */
  variant?: "primary" | "secondary";
};
export type InputProps = ComponentPropsWithRef<"input">;
export type SelectProps = ComponentPropsWithRef<"select">;
export type LabelProps = ComponentPropsWithRef<"label">;

function classes(...values: (string | false | undefined)[]) {
  return values.filter(Boolean).join(" ");
}

/** A native button. Explicitly set type="submit" to submit a form. */
export function Button({ className, variant = "secondary", type = "button", ...props }: ButtonProps) {
  return <button {...props} type={type} className={classes("pxo-button", `pxo-button--${variant}`, className)} />;
}

const browserPresentedInputTypes = new Set([
  "button", "checkbox", "color", "file", "hidden", "image", "radio", "range", "reset", "submit",
]);

/** A native input with reading typography for text-entry types. */
export function Input({ className, type = "text", ...props }: InputProps) {
  return <input {...props} type={type} className={classes("pxo-input", !browserPresentedInputTypes.has(type.toLowerCase()) && "pxo-input--entry", className)} />;
}

/** A native select; children are ordinary option and optgroup elements. */
export function Select({ className, ...props }: SelectProps) {
  return <select {...props} className={classes("pxo-select", className)} />;
}

/** Associate with a control using htmlFor/id, or wrap the control. */
export function Label({ className, htmlFor, children, ...props }: LabelProps) {
  return <label {...props} htmlFor={htmlFor} className={classes("pxo-label", className)}>{children}</label>;
}
