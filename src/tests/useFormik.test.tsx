import path from "node:path";
import { FormProvider, getFormProps, useForm } from "@conform-to/react";
import { cleanup, render, screen } from "@testing-library/react";
import { Form, Formik } from "formik";
import type { ReactNode } from "react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { SampleUseFormikContext1 as ConformDisplayValues } from "./useFormMetadata.conform";
import { SampleUseFormikContext1 as FormikDisplayValues } from "./useFormikContext.formik";
import { testConvert } from "./utils/testConvert";

describe("useFormikContext", async () => {
  test("convert", async () =>
    await testConvert(
      path.join(__dirname, "useFormikContext.formik.tsx"),
      path.join(__dirname, "useFormMetadata.conform.tsx"),
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
          initialValues={{ name: "taro" }}
          onSubmit={(values) => onSubmit(values)}
        >
          <Form>
            <FormikDisplayValues />
            <button type="submit">Submit</button>
          </Form>
        </Formik>
      ),
    },
    {
      name: "conform",
      Component: ({ onSubmit }) => {
        const [form] = useForm({
          defaultValue: { name: "taro" },
          onSubmit: (_, { formData }) => onSubmit(Object.fromEntries(formData)),
        });
        return (
          <FormProvider context={form.context}>
            <form {...getFormProps(form)}>
              <ConformDisplayValues />
              <button type="submit">Submit</button>
            </form>
          </FormProvider>
        );
      },
    },
  ])("render $name", ({ Component }) => {
    render(<Component onSubmit={vi.fn()} />);
    expect(screen.getByText('Values: {"name":"taro"}')).toBeInTheDocument();
  });
});
