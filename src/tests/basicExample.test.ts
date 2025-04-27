import { convert } from "..";
import { test, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

test("basic example", () => {
  const file = readFileSync(
    path.join(__dirname, "formik.basicExample.jsx"),
    "utf-8",
  );
  expect(convert(file)).toMatchSnapshot();
});
