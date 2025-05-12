import path from "node:path";
import { FormProvider, getFormProps, useForm } from "@conform-to/react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Form, Formik } from "formik";
import type { ReactNode } from "react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { SampleField1 as ConformSampleField } from "./field.conform";
import { SampleField1 as FormikSampleField } from "./field.formik";
import { testConvert } from "./utils/testConvert";

describe("field", async () => {
  test("convert", async () =>
    await testConvert(
      path.join(__dirname, "field.formik.tsx"),
      path.join(__dirname, "field.conform.tsx"),
    ));

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
