import { createRef, type ComponentProps } from "react";
import { Button, Input, Label, Select, type ButtonProps, type InputProps, type LabelProps, type SelectProps } from "@pixeloven/ui";

const buttonRef = createRef<HTMLButtonElement>();
const inputRef = createRef<HTMLInputElement>();
const selectRef = createRef<HTMLSelectElement>();
const labelRef = createRef<HTMLLabelElement>();

export const form = <form>
  <Label htmlFor="email" ref={labelRef}>Email</Label>
  <Input id="email" type="email" name="email" ref={inputRef} required autoComplete="email" aria-describedby="hint" aria-invalid="grammar" onChange={event => event.currentTarget.setCustomValidity("")} />
  <Select name="status" ref={selectRef} multiple defaultValue={["ready"]} onChange={event => event.currentTarget.selectedOptions.item(0)}>
    <optgroup label="Status"><option value="ready">Ready</option></optgroup>
  </Select>
  <Button type="submit" variant="primary" ref={buttonRef} formAction="/save" formMethod="post" onClick={event => event.currentTarget.checkValidity()}>Save</Button>
  <Button ref={node => { node?.focus(); return () => { /* React 19 cleanup is accepted. */ }; }}>Inspect</Button>
</form>;

export const nativeButton: ButtonProps = {} satisfies ComponentProps<"button">;
export const nativeInput: InputProps = { type: "checkbox", checked: false, readOnly: true };
export const nativeSelect: SelectProps = { size: 4, multiple: true };
export const nativeLabel: LabelProps = { htmlFor: "email" };

// @ts-expect-error Variants are intentionally limited to the extracted action roles.
export const unsupportedVariant = <Button variant="danger" />;
// @ts-expect-error The native button is not polymorphic and cannot become a link.
export const unsupportedLink = <Button href="/notes" />;
// @ts-expect-error Refs retain the exact native element type.
export const wrongRef = <Input ref={buttonRef} />;
// @ts-expect-error Select uses native children and does not accept custom-popup items.
export const unsupportedItems = <Select items={[{ label: "First", value: "first" }]} />;
// @ts-expect-error Event currentTarget is an HTMLInputElement.
export const wrongEvent = <Input onChange={event => event.currentTarget.selectedOptions} />;
