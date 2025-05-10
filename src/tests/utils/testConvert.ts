import { readFileSync } from "node:fs";
import { expect } from "vitest";
import { convert } from "../..";

export const testConvert = async (
  formikFilepath: string,
  conformFilepath: string,
) => {
  const formikFile = readFileSync(formikFilepath, "utf-8");
  const conformFile = readFileSync(conformFilepath, "utf-8");
  const result = await convert(formikFile);
  const normalize = (s: string) => s.replace(/\s+/g, "").replace(/,}/g, "}");
  // biome-ignore lint/suspicious/noMisplacedAssertion: <explanation>
  expect(normalize(result)).toEqual(normalize(conformFile));
};
