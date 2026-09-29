import "./dom.js";
import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { createRef, useState } from "react";
import { Button, Input, Label, Select } from "@pixeloven/ui";

afterEach(cleanup);

test("native forms retain submit, reset, values, disabled omission and a safe default button", async () => {
  const user = userEvent.setup();
  const submissions: FormData[] = [];
  render(<form onSubmit={event => {
    event.preventDefault();
    submissions.push(new window.FormData(event.currentTarget, (event.nativeEvent as SubmitEvent).submitter));
  }}>
    <Label htmlFor="title">Title</Label>
    <Input id="title" name="title" defaultValue="Original" required />
    <Label htmlFor="status">Status</Label>
    <Select id="status" name="status" defaultValue="ready">
      <option value="ready">Ready</option>
      <optgroup label="Progress"><option value="done">Done</option></optgroup>
    </Select>
    <Input aria-label="Locked identifier" name="identifier" defaultValue="note-1" readOnly />
    <Input aria-label="Unavailable" name="unavailable" defaultValue="excluded" disabled />
    <Button>Inspect</Button>
    <Button type="submit" name="action" value="save">Save</Button>
    <Button type="reset">Reset</Button>
  </form>);
  await user.click(screen.getByRole("button", { name: "Inspect" }));
  assert.equal(submissions.length, 0, "ordinary actions do not unexpectedly submit forms");
  await user.clear(screen.getByRole("textbox", { name: "Title" }));
  await user.type(screen.getByRole("textbox", { name: "Title" }), "Edited");
  await user.selectOptions(screen.getByRole("combobox", { name: "Status" }), "done");
  await user.click(screen.getByRole("button", { name: "Save" }));
  assert.equal(submissions.length, 1);
  const submission = submissions[0];
  assert.ok(submission);
  assert.deepEqual(Object.fromEntries(submission), { title: "Edited", status: "done", identifier: "note-1", action: "save" });
  await user.click(screen.getByRole("button", { name: "Reset" }));
  assert.equal((screen.getByRole("textbox", { name: "Title" }) as HTMLInputElement).value, "Original");
  assert.equal((screen.getByRole("combobox", { name: "Status" }) as HTMLSelectElement).value, "ready");
});

test("keyboard order skips disabled controls and native buttons activate with Enter and Space", async () => {
  const user = userEvent.setup();
  let enabledClicks = 0;
  let disabledClicks = 0;
  render(<>
    <Label htmlFor="query">Find a note</Label><Input id="query" />
    <Input disabled aria-label="Unavailable query" />
    <Label>Status<Select defaultValue="ready"><option value="ready">Ready</option></Select></Label>
    <fieldset disabled><Button onClick={() => { disabledClicks += 1; }}>Inherited disabled</Button></fieldset>
    <Button disabled onClick={() => { disabledClicks += 1; }}>Disabled</Button>
    <Button onClick={() => { enabledClicks += 1; }}>Explore</Button>
  </>);
  await user.tab();
  assert.equal(document.activeElement, screen.getByRole("textbox", { name: "Find a note" }));
  await user.tab();
  assert.equal(document.activeElement, screen.getByRole("combobox", { name: "Status" }));
  await user.tab();
  assert.equal(document.activeElement, screen.getByRole("button", { name: "Explore" }));
  await user.keyboard("{Enter} ");
  assert.equal(enabledClicks, 2);
  await user.click(screen.getByRole("button", { name: "Disabled" }));
  await user.click(screen.getByRole("button", { name: "Inherited disabled" }));
  assert.equal(disabledClicks, 0);
  await user.click(screen.getByText("Find a note"));
  assert.equal(document.activeElement, screen.getByRole("textbox", { name: "Find a note" }));
});

test("refs expose real native elements and React 19 callback ref cleanup runs", () => {
  const input = createRef<HTMLInputElement>();
  const select = createRef<HTMLSelectElement>();
  const label = createRef<HTMLLabelElement>();
  const button: { current: HTMLButtonElement | null } = { current: null };
  let cleaned = false;
  const view = render(<>
    <Button ref={node => { button.current = node; return () => { cleaned = true; }; }}>Focus me</Button>
    <Label ref={label} htmlFor="ref-input">Value</Label><Input ref={input} id="ref-input" />
    <Select ref={select} aria-label="Choice"><option>First</option></Select>
  </>);
  assert.ok(button.current instanceof HTMLButtonElement);
  assert.ok(input.current instanceof HTMLInputElement);
  assert.ok(select.current instanceof HTMLSelectElement);
  assert.ok(label.current instanceof HTMLLabelElement);
  input.current.focus();
  assert.equal(document.activeElement, input.current);
  select.current.focus();
  assert.equal(document.activeElement, select.current);
  view.unmount();
  assert.equal(input.current, null);
  assert.equal(select.current, null);
  assert.equal(label.current, null);
  assert.equal(cleaned, true);
});

test("native constraints and accessible error descriptions reach the form control", async () => {
  const user = userEvent.setup();
  const email = createRef<HTMLInputElement>();
  let submits = 0;
  render(<form onSubmit={event => { event.preventDefault(); submits += 1; }}>
    <Label htmlFor="email">Email address</Label>
    <Input id="email" ref={email} name="email" type="email" required aria-invalid="true" aria-describedby="email-error" autoComplete="email" />
    <p id="email-error">Enter a complete email address.</p>
    <Button type="submit">Continue</Button>
  </form>);
  const control = screen.getByRole("textbox", { name: "Email address", description: "Enter a complete email address." });
  assert.equal(control.getAttribute("aria-invalid"), "true");
  assert.equal(control.getAttribute("autocomplete"), "email");
  assert.equal(email.current?.checkValidity(), false);
  await user.type(control, "incomplete");
  await user.click(screen.getByRole("button", { name: "Continue" }));
  assert.equal(submits, 0);
  await user.clear(control);
  await user.type(control, "person@example.com");
  assert.equal(email.current?.checkValidity(), true);
  await user.click(screen.getByRole("button", { name: "Continue" }));
  assert.equal(submits, 1);
});

test("controlled values, multiple select and native checked inputs remain usable", async () => {
  const user = userEvent.setup();
  function Editor() {
    const [title, setTitle] = useState("");
    const [selected, setSelected] = useState<string[]>([]);
    const [checked, setChecked] = useState(false);
    return <>
      <Label>Title<Input value={title} onChange={event => setTitle(event.currentTarget.value)} /></Label>
      <Label>Tags<Select multiple value={selected} onChange={event => setSelected(Array.from(event.currentTarget.selectedOptions, option => option.value))}>
        <option value="design">Design</option><option value="research">Research</option>
      </Select></Label>
      <Label><Input type="checkbox" checked={checked} onChange={event => setChecked(event.currentTarget.checked)} /> Keep private</Label>
      <output aria-label="Current values">{title}:{selected.join(",")}:{String(checked)}</output>
    </>;
  }
  render(<Editor />);
  await user.type(screen.getByRole("textbox", { name: "Title" }), "Notes");
  await user.selectOptions(screen.getByRole("listbox", { name: "Tags" }), ["design", "research"]);
  await user.click(screen.getByRole("checkbox", { name: "Keep private" }));
  assert.equal(screen.getByLabelText("Current values").textContent, "Notes:design,research:true");
});
