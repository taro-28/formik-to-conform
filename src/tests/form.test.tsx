import { readFileSync } from "node:fs";
import path from "node:path";
import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, test } from "vitest";
import { convert } from "..";
import { SampleForm as ConformSampleForm } from "./conform.form";
import { SampleForm as FormikSampleForm } from "./formik.form";
test("convert", async () => {
  const formikFile = readFileSync(
    path.join(__dirname, "formik.form.tsx"),
    "utf-8",
  );
  const conformFile = readFileSync(
    path.join(__dirname, "conform.form.tsx"),
    "utf-8",
  );
  const result = await convert(formikFile);
  expect(result).toEqual(conformFile);
});

describe("compornent test", () => {
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
  });
});
