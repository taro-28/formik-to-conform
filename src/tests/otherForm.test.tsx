import path from "node:path";
import { describe, test } from "vitest";
import { testConvert } from "./utils/testConvert";

describe("otherForm", () => {
  test("convert", async () =>
    await testConvert(
      path.join(__dirname, "otherForm.tsx"),
      path.join(__dirname, "otherForm.tsx"),
    ));
});
