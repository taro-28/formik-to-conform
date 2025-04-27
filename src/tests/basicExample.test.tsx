import { readFileSync } from "node:fs";
import path from "node:path";
import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, test } from "vitest";
import { convert } from "..";
import { BasicExample as ConformBasicExample } from "./conform.basicExample";
import { BasicExample as FormikBasicExample } from "./formik.basicExample";
test("convert", async () => {
  const formikFile = readFileSync(
    path.join(__dirname, "formik.basicExample.tsx"),
    "utf-8",
  );
  const conformFile = readFileSync(
    path.join(__dirname, "conform.basicExample.tsx"),
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
