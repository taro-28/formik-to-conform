import path from "node:path";
import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, test } from "vitest";
import { SampleForm as ConformSampleForm } from "./form.conform";
import { SampleForm as FormikSampleForm } from "./form.formik";
import { testConvert } from "./utils/testConvert";

describe("form", async () => {
  test("convert", async () =>
    await testConvert(
      path.join(__dirname, "form.formik.tsx"),
      path.join(__dirname, "form.conform.tsx"),
    ));

  afterEach(() => {
    cleanup();
  });
  test.each<{ name: string; Component: () => ReactNode }>([
    {
      name: "formik",
      Component: FormikSampleForm,
    },
    {
      name: "conform",
      Component: ConformSampleForm,
    },
  ])("render $name", ({ Component }) => {
    render(<Component />);

    expect(
      screen.getByRole<HTMLInputElement>("textbox", {
        name: "Raw Input",
      }).value,
    ).toBe("initial rawInput value");
    expect(
      screen.getByRole<HTMLInputElement>("textbox", {
        name: "Field Input",
      }).value,
    ).toBe("initial fieldInput value");
    expect(
      screen.getByRole<HTMLInputElement>("textbox", {
        name: "Many Attributes Input",
      }).value,
    ).toBe("initial manyAttributesInput value");
    expect(
      screen.getByRole<HTMLInputElement>("spinbutton", {
        name: "Custom Input",
      }).value,
    ).toBe("123");
  });
});
