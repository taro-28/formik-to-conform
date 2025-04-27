import { convert } from "..";
import { test, expect, describe, afterEach } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import type { ReactNode } from "react";
import { BasicExample as FormikBasicExample } from "./formik.basicExample";
import { BasicExample as ConformBasicExample } from "./conform.basicExample";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
test("convert", () => {
  const formikFile = readFileSync(
    path.join(__dirname, "formik.basicExample.tsx"),
    "utf-8",
  );
  const conformFile = readFileSync(
    path.join(__dirname, "conform.basicExample.tsx"),
    "utf-8",
  );
  const result = convert(formikFile);
  expect(result).toEqual(conformFile);
});

describe("compornent test", () => {
  afterEach(() => {
    cleanup();
  });
  test.each<{ name: string; Component: () => ReactNode }>([
    {
      name: "formik",
      Component: FormikBasicExample,
    },
    {
      name: "conform",
      Component: ConformBasicExample,
    },
  ])("render $name", ({ Component }) => {
    render(<Component />);

    expect(
      screen.getByRole<HTMLInputElement>("textbox", { name: "Name" }).value,
    ).toBe("jared");
  });
});
