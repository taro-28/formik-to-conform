import { readFileSync } from "node:fs";
import path from "node:path";
import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { convert } from "..";
import { SampleField as ConformSampleField } from "./useField.conform";
import { SampleField as FormikSampleField } from "./useField.formik";
import { Form, Formik } from "formik";
import { FormProvider, getFormProps, useForm } from "@conform-to/react";
import userEvent from "@testing-library/user-event";

test("convert", async () => {
  const formikFile = readFileSync(
    path.join(__dirname, "useField.formik.tsx"),
    "utf-8",
  );
  const conformFile = readFileSync(
    path.join(__dirname, "useField.conform.tsx"),
    "utf-8",
  );
  const result = await convert(formikFile);
  expect(result).toEqual(conformFile);
});

describe("compornent test", () => {
  afterEach(() => {
    cleanup();
  });

  test.each<{
    name: string;
    Component: (props: { onSubmit: (values: unknown) => void }) => ReactNode;
  }>([
    {
      name: "formik",
      Component: ({ onSubmit }) => (
        <Formik
          initialValues={{ name: "" }}
          onSubmit={(values) => onSubmit(values)}
        >
          <Form>
            <FormikSampleField />
            <button type="submit">Submit</button>
          </Form>
        </Formik>
      ),
    },
    {
      name: "conform",
      Component: ({ onSubmit }) => {
        const [form] = useForm({
          defaultValue: { name: "" },
          onSubmit: (_, { formData }) => onSubmit(Object.fromEntries(formData)),
        });
        return (
          <FormProvider context={form.context}>
            <form {...getFormProps(form)}>
              <ConformSampleField />
              <button type="submit">Submit</button>
            </form>
          </FormProvider>
        );
      },
    },
  ])("render $name", async ({ Component }) => {
    const handleSubmit = vi.fn();
    render(<Component onSubmit={handleSubmit} />);

    expect(
      screen.getByRole<HTMLInputElement>("textbox", {
        name: "Name",
      }).value,
    ).toBe("");

    await userEvent.type(
      screen.getByRole<HTMLInputElement>("textbox", { name: "Name" }),
      "test",
    );

    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(handleSubmit).toHaveBeenCalledWith({ name: "test" });
  });
});
